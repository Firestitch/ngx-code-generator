import { clone } from 'lodash-es';

import {
  AttributeColor,
  AttributeImage,
  AttributeOrder,
  FsAttributeConfig
} from '@firestitch/attribute';
import { FsPrompt } from '@firestitch/prompt';
import { FlatItemNode } from '@firestitch/tree';
import { list } from '@firestitch/common';
import { FsMessage } from '@firestitch/message';

import { of, Observable, concat } from 'rxjs';
import { map, switchMap, concatAll } from 'rxjs/operators';

import { AttributeData, AttributeService } from '../';

export function attributeConfigFactory(
  attributeData: AttributeData,
  attributeService: AttributeService,
  prompt: FsPrompt,
  message: FsMessage
): FsAttributeConfig {

  const tagClass = attributeService.getClass('tag');

  const config = {
    configs: [
      {
        class: tagClass.value,
        name: tagClass.name,
        pluralName: tagClass.pluralName,
        image: AttributeImage.Disabled,
        backgroundColor: AttributeColor.Enabled,
        color: AttributeColor.Enabled,
        order: AttributeOrder.Custom
      }
    ],
    mapping: {
      id: 'id',
      name: 'name',
      image: 'image.tiny',
      backgroundColor: 'background_color',
      configs: 'configs',
      childAttributes: 'child_attributes',
      parentAttribute: 'parent_attribute'
    },
    getAttributeTree: (e) => {
      return attributeData.gets({
        class: e.class,
        child_attributes: true
      }).pipe(
        switchMap((data) => {
          return of({attributes: data})
        })
      );
    },
    reorderAttributeTree: (event: any) => {
      console.log('reorderAttributeTree', event);

      const requests: any = [];

      if (event.toParent) {
        const moveRequest = attributeData.put({
          ...event.attribute,
          parent_attribute_id: event.toParent,
        });

        const orderRequest = attributeData.order({
          class: event.class,
          parent_attribute_id: event.toParent,
          attribute_ids: event.childIds,
        });

        requests.push(moveRequest, orderRequest);
      } else {
        const orderRequest = attributeData.order({
          class: event.class,
          attribute_ids: event.parentIds,
        });

        requests.push(orderRequest);
      }

      return concat(requests).pipe(concatAll());
    },
    canDropTreeAttribute: (
      node?: FlatItemNode,
      fromParent?: FlatItemNode,
      toParent?: FlatItemNode,
      dropPosition?: any,
      prevElement?: FlatItemNode,
      nextElement?: FlatItemNode
    ) => {

      // Sorting Rule
      const prevElSortCoimplied = prevElement && prevElement.data.name < node.data.name || !prevElement;
      const nextElSortCoimplied = nextElement && node.data.name < nextElement.data.name || !nextElement;
      const compliedWithSort = prevElSortCoimplied && nextElSortCoimplied;

      return (!fromParent && !toParent) ||
        (fromParent && toParent && fromParent.data.class === toParent.data.class && compliedWithSort);
    },
    sortByAttributeTree: (data, parent) => {
      if (!parent) { return data; }

      return data.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (b.name < b.name) { return 1; }

        return 0;
      });
    },
    saveAttribute: (e, draft = false) => {
      console.log('saveAttribute', e);

      const state = draft ? 'draft' : 'active';

      const attribute = e.attribute;
      attribute.class = e.class;
      attribute.state = state;

      if (e.data && e.data.project_id) {
        attribute.project_id = e.data.project_id;
      }

      return attributeData.save(attribute);
    },
    saveAttributeImage: (e) => {
      if (e.attribute.id) {
        return attributeData
          .image({ id: e.attribute.id }, e.file.file);
      } else {
        e.attribute.state = 'draft';

        return config.saveAttribute(e, !e.attribute.id)
          .pipe(
            switchMap((response: any) => {
              const attribute = response.attribute;

              return attributeData
                .image({ id: attribute.id }, e.file.file);
            })
          );
      }
    },
    getAttributes: (e) => {
      console.log('getAttributes', e);

      const query = {
        ...e.query,
        class: e.class,
      };

      if (e.keyword) {
        query.keyword = e.keyword;
      }

      if (e.data && e.data.childAttributes) {
        query.child_attributes = !!e.data.childAttributes
      }

      if (e.data && e.data.excludeEmpty) {
        query.exclude_empty_parent_attributes = !!e.data.excludeEmpty
      }

      if (e.data && e.data.parentAttributes) {
        query.parent_attributes = !!e.data.parentAttributes;
      }

      if (e.data && e.data.project_id) {
        query.project_id = e.data.project_id;
      }

      return attributeData.gets(query,
        {
          key: null
        }).pipe(
        map((response) => {
          return { data: response.attributes, paging: response.paging };
        })
      );
    },
    getSelectedAttributes: (e) => {
      console.log('getSelectedAttributes', e);

      const query = {
        ...e.query,
        class: e.class,
        parent_attributes: !!e.parentClass,
      };

      if (e.data && e.data.childAttributes) {
        query.child_attributes = !!e.data.childAttributes
      }

      if (e.data && e.data.parentAttributes) {
        query.parent_attributes = !!e.data.parentAttributes;
      }

      if (e.data && e.data.project_id) {
        query.project_id = e.data.project_id;
      }

      return attributeData.getObjectAttributes(e.data.object_id, query,
        {
          key: null
        }).pipe(
        map((response) => {
          return { data: response.attributes, paging: response.paging };
        })
      );
    },
    reorderAttributes: (e) => {
      console.log('reorderAttributes', e);

      return attributeData.order({
        class: e.class,
        attribute_ids: list(e.attributes, 'id')
      });
    },
    attributeSelectionChanged: (e) => {
      console.log('attributeSelectionChanged', e);
      if (e.data.disableAutoSave) {
        return of({ attribute: e.attribute })
      }

      const attribute = e.value;
      return new Observable(observer => {

        if (e.selected) {
          attributeData.assignObject(attribute.id, e.data.object_id)
            .subscribe(response => {
              message.success('Saved Changes');
              observer.next({ attribute });
              observer.complete();
            });
          return;
        }

        attributeData.deleteObject(attribute.id, e.data.object_id)
          .subscribe(response => {
            message.success('Saved Changes');
            observer.next({ attribute });
            observer.complete();
          });
      });
    },
    deleteAttribute: (e) => {
      console.log('deleteAttribute', e);

      return attributeData.delete({ id: e.id })
        .pipe(
          switchMap((data) => {
            return of({ attribute: data })
          }),
        );
    },
    compareAttributes: (o1, o2) => {
      return o1 && o2 && o1.id === o2.id;
    },
    deleteConfirmation: (event) => {
      const klass = attributeService.getClass(event.class);
      const templateName = `Are you sure you would like to delete this ${klass ? klass.name : 'Undefined'}?`;

      return prompt.confirm({
        title: 'Confirm',
        template: templateName
      })
    },
  };

  return config;
}

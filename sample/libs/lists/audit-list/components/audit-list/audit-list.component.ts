import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { FsListConfig, FsListComponent } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';

import { AuditData } from '@app/core';
import { AuditModel } from '@app/shared/models';
import { Object } from '@app/shared/interfaces';
import { ObjectClass } from '@app/shared/enums';
import { ObjectDrawerService } from 'libs/drawers/drawer';


@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss']
})
export class AuditListComponent implements OnInit {

  @Input() public object_id = null;
  @Input() public object_type = null;

  @ViewChild('list')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  constructor(
    private _auditData: AuditData,
    private _objectDrawerService: ObjectDrawerService,
    private _router: Router
  ) { }

  public ngOnInit() {

    this.config = {
      sort: 'date,desc',
      paging: {
        limits: [25, 50, 150, 250, 500, 1000]
      },
      filters: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search'
        },
        {
          name: 'object_class',
          type: ItemType.Select,
          label: 'Subject',
          values: () => {
            // return this.auditData.object_classes(this.object_type);
            return [
              { name: 'All', value: '__all' },
              { name: 'Account', value: 'account' },
              { name: 'Type', value: 'type' },
              { name: 'Status', value: 'status' },
              { name: 'Category', value: 'category' },
              { name: 'Project', value: 'project' },
              { name: 'Document', value: 'doc' },
              { name: 'Task', value: 'task' }
            ];
          }
        },
        {
          name: 'type',
          type: ItemType.Select,
          label: 'Type',
          values: () => {
            // return this.auditData.types(this.object_type);
            return [
              { name: 'All', value: '__all' },
              { name: 'Add', value: 'add' },
              { name: 'Edit', value: 'update' },
              { name: 'Create', value: 'create' },
              { name: 'Delete', value: 'delete' },
              { name: 'Login', value: 'login' }
            ];
          }
        }
      ],
      fetch: query => {

        query.object_id = this.object_id;
        query.objects = true;
        query.object_projects = true;
        query.statuses = true;
        query.types = true;
        query.actor_accounts = true;
        query.audit_objects = true;

        return this._auditData.gets(query, { key: null })
        .pipe(
          map(response => {
            const audits = response.audits.map((audit) => new AuditModel(audit));
            return { data: audits, paging: response.paging };
          })
        );
      }
    }
  }

  public proceedObject(object: Object) {
    switch (object.class) {
      case ObjectClass.Doc:
      case ObjectClass.Task:
      case ObjectClass.Asset:

        this._objectDrawerService.openObjectDrawer(object.project, object);

        break;
      case ObjectClass.Account:
        this._router.navigateByUrl(`/admin/account/${object.id}`);
        break;
      case ObjectClass.Project:
        this._router.navigateByUrl(`/projects/${object.id}/overview/settings`);
        break;
    }
  }

}

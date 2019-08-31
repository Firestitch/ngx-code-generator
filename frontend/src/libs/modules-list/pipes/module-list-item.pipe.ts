import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'moduleListItem'
})
export class ModuleListItemPipe implements PipeTransform {
  transform(value: any, ...args): any {

    let path = '';

    if (value && value.moduleFullPath) {

      path = value.name.replace('.ts', '');

      return path;
    }

    return '-';
  }
}

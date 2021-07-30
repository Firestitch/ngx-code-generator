import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serviceListItem',
})
export class ServiceListItemPipe implements PipeTransform {
  transform(value: any, ...args): any {
    if (value) {
      return value.name;
    }

    return '-';
  }
}

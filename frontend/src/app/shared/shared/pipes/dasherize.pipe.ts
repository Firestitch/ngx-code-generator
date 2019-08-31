import { Pipe, PipeTransform } from '@angular/core';
import { dasherize } from '@angular-devkit/core/src/utils/strings';

@Pipe({name: 'dasherize'})
export class DasherizePipe implements PipeTransform {
  transform(value: string): string {
    return dasherize(value);
  }
}

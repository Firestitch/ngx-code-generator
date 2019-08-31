import { Pipe, PipeTransform } from '@angular/core';
import { classify } from '@angular-devkit/core/src/utils/strings';

@Pipe({name: 'classify'})
export class ClassifyPipe implements PipeTransform {
  transform(value: string): string {
    return classify(value);
  }
}

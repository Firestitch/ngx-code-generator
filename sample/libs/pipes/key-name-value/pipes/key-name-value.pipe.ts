import { Injectable, Pipe, PipeTransform } from '@angular/core';


@Pipe({
   name: 'keyNameValue'
})
@Injectable()
export class KeyNameValuePipe implements PipeTransform {

  transform(values, args: string[]): any {
      return Object.keys(values).map(key => {
          return { value: key, name: values[key] }
      });
  }
}

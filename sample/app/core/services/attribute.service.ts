import { Injectable } from '@angular/core';

import { AttributeClasses } from '../../shared/consts';


@Injectable()
export class AttributeService {

  public getClass(cls) {
    return AttributeClasses.find((klass) => klass.value === cls);
  }
}

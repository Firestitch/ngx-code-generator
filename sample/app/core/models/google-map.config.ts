import { Inject } from '@angular/core';
import { LazyMapsAPILoaderConfigLiteral } from '@agm/core';

import { GOOGLE_MAP_KEY } from '@firestitch/address';

export class GoogleMapConfig implements LazyMapsAPILoaderConfigLiteral {

  public apiKey: string = null;
  public libraries: string[] = ['places'];

  constructor(@Inject(GOOGLE_MAP_KEY) apiKey) {
    if (!apiKey) {
      throw new Error('GoogleMapKey injector invalid');
    }

    this.apiKey = apiKey;
  }
}

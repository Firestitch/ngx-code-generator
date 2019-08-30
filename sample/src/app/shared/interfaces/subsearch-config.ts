import { IFilterConfigItem } from '@firestitch/filter';


export interface SubsearchConfig {
  groups: {
    [index: number]: {
      name: string;
      label: string;
      items: IFilterConfigItem[];
    }
  }
}

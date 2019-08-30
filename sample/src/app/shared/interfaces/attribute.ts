export interface Attribute {
  readonly id: number;
  parent_attribute_id?: number;
  parent_attribute?: any;
  project_id?: number;
  project?: any;
  class?: string;
  name?: string;
  icon?: string;
  color?: string;
  guid?: string;
  state?: string;
  image?: any;
  order?: number;
  selected?: boolean;
  configs?: any;
  object_configs?: any;
}

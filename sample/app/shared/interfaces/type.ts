export interface Type {
  readonly id: number;
  workflow_id?: number;
  workflow?: any;
  name?: string;
  name_template?: string;
  state?: string;
  order?: number;
  class?: string;
  icon?: string;
  color?: string;
  object_fields?: any;
}

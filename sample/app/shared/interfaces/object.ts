import { Project } from './project';
import { Account } from './account';


export interface Object {
  readonly id: number;
  class?: string;
  state?: string;
  subclass?: string;
  class_name?: string;
  name?: string;
  image_url?: string;
  content?: string;
  project_id?: number;
  project?: Project;
  modifier_account?: Account;
  identifier?: string;
  primary_keyword?: string;
  secondary_keyword?: string;
  modify_date?: string;
  create_date?: string;
  number?: any;
  meta?: any;
  objects?: Object[];
  related_object_highlight?: number;
}

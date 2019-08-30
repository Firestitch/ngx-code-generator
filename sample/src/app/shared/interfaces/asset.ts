import { Project } from './project';
import { Account } from './account';
import { Section } from './section';
import { Type } from './type';
import { Attribute } from './attribute';


export interface Asset {
  id: number;
  project_id?: number;
  project?: Project;
  create_account_id?: number;
  create_account?: Account;
  modifier_account_id?: number;
  modifier_account?: Account;
  section_id?: number;
  section?: Section;
  file_id?: number;
  file?: any;
  type_id?: number;
  type?: Type;
  tags?: Attribute[];
  state?: string;
  number?: number;
  order?: number;
  modify_date?: string;
  name?: string;
  class?: string;
  content?: string;
}

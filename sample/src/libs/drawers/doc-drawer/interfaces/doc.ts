import { Account } from '@app/shared/interfaces/account';
import { Category } from '@app/shared/interfaces/category';
import { Project } from '@app/shared/interfaces/project';
import { Status } from '@app/shared/interfaces/status';
import { Attribute } from '@app/shared/interfaces/attribute';
import { Type } from '@app/shared/interfaces/type';

export interface Doc {
  id: number | null;
  category?: Category;
  category_id?: number;
  content?: string;
  creator_account?: Account;
  creator_account_id?: number;
  create_date?: Date;
  class?: string;
  fullName?: string;
  modifier_account?: Account;
  modifier_account_id?: number;
  modify_date?: Date;
  name?: string;
  number?: string;
  project?: Project;
  project_id?: number;
  state?: string;
  status?: Status;
  status_id?: number;
  tags?: Attribute[];
  type_id?: number;
  type?: Type;
  object_version_id?: number;
  object_version?: any;
}

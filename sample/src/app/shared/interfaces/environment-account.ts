import { Account } from './account';
import { Workspace } from './workspace';
import { AclEntry } from './acl-entry';
import { AclRole } from './acl-role';


export interface EnvironmentAccount {
  readonly id: number;
  account_id?: number;
  account?: Account;
  environment_id?: number;
  environment?: Workspace;
  create_date?: string;
  state?: string;
  signin_date?: string;
  acl_entries?: AclEntry[];
  acl_roles?: AclRole[];
}

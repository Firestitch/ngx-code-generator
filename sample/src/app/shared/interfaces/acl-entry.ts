import { AclRole } from './acl-role';
import { Account } from './account';
import { Object } from './object';
import { Workspace } from './workspace';


export interface AclEntry {
  id: number;
  acl_role_id?: number;
  acl_role?: AclRole;
  account_id?: number;
  account?: Account;
  object_id?: number;
  object?: Object;
  environment_id?: number;
  environment?: Workspace;
}

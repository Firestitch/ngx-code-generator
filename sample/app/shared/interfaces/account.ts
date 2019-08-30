import { Address } from './address';
import { AclRole } from './acl-role';

/* Update most objects as interfaces */

export interface Account {
  id?: number;
  gender?: string;
  phone?: string;
  address?: Address;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  guid?: string;
  state?: string;
  activate_email_date?: string;
  activate_email_message?: string;
  password?: string;
  create_date?: string;
  signin_date?: string;
  password_change?: boolean;
  permissions?: {
    app: number;
  };
  image?: any;
  acl_roles?: AclRole[];
  api_key?: string;
  api_secret?: string;
  type?: string;
}

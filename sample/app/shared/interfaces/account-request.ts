import { Account } from './account';


export interface AccountRequest {
  id?: number;
  creator_account_id?: number;
  creator_account?: Account;
  account_id?: number;
  account?: Account;
  state?: string;
  create_date?: string;
  expiry_date?: string;
  response_date?: string;
  guid?: string;
  creator_ip?: string;
  meta?: string;
  type?: string;
  email?: string;
  role_objects?: any;
}

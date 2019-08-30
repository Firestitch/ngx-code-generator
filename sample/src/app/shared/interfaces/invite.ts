import { Account } from './account';


export interface Invite {
  id: number;
  invitee_account_id?: number;
  invitee_account?: Account;
  invited_account_id?: number;
  invited_account?: Account;
  state?: string;
  create_date?: string;
  guid?: string;
  ip?: string;
  user_agent?: string;
  activate_date?: string;
  email?: string;
  meta?: string;
}

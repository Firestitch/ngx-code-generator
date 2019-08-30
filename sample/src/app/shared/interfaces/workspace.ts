import { Account } from './account';

export interface Workspace {
  readonly id: number;
  creator_account_id?: number;
  creator_account?: Account;
  name?: string;
  create_date?: string;
  state?: string;
  guid?: string;
  image_time?: number;
  image_type?: string;
  image?: any;
  projects?: any;
  project_count?: number;
}

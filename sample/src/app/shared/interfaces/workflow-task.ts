import { Workflow } from './workflow';
import { Account } from './account';
import { Type } from './type';


export interface WorkflowTask {
  id: number;
  workflow_id?: number;
  workflow?: Workflow;
  name?: string;
  configs?: number[];
  name_template?: string;
  assign_account_id?: number;
  assign_account?: Account;
  type_id?: number;
  type?: Type;
  state?: string;
  subscribers?: Account[];
}


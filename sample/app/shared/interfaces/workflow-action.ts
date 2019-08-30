import { WorkflowActionType } from '../enums';
import { WorkflowTask } from './workflow-task'

export interface WorkflowAction {
  id?: number;
  type?: WorkflowActionType;
  assign_account?: Account;
  subscriber_accounts?: Account[];
  configs?: ActionConfig;
  order?: number;
  state?: string;
  workflow_path_id?: number;
  target_object_id?: number;
  target_workflow_task_id?: number;
  target_workflow_task?: WorkflowTask;
}

interface ActionConfig {
  comment?: string;
  comment_required?: boolean;
  assign_account_id?: number;
  subscriber_account_ids: number[];
}

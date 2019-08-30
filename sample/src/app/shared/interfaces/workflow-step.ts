import { Workflow } from './workflow';
import { Status } from './status';
import { WorkflowPath } from './workflow-path';
import { WorkflowTask } from './workflow-task';


export interface WorkflowStep {
  id: number;
  workflow_id?: number;
  workflow?: Workflow;
  status_id?: number;
  workflow_task?: WorkflowTask;
  workflow_task_id?: number;
  status?: Status;
  styles?: any;
  x1?: number;
  y1?: number;
  name?: string;
  type?: string;
  state?: string;
  workflow_paths?: WorkflowPath[];
  workback_time?: number;
}

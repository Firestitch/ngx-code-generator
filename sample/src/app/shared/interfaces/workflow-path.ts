import { Workflow } from './workflow';
import { WorkflowAction } from './workflow-action';
import { WorkflowStep } from './workflow-step';


export interface WorkflowPath {
  id?: number;
  workflow_id?: number;
  workflow?: Workflow;
  workflow_actions?: WorkflowAction[];
  source_workflow_step_id?: number;
  target_workflow_step_id?: number;
  target_workflow_step?: WorkflowStep;
  name?: string;
  state?: string;
  order?: number;
  action?: string;
  configs?: string;
  tooltip?: string;
}

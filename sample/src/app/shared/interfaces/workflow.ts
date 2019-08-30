import { Project } from './project';

export interface Workflow {
  id: number;
  default_workflow_step_id?: number;
  project_id?: number;
  project?: Project;
  name?: string;
  state?: string;
  default?: number;
}

import { Status } from './status';
import { Workspace } from './workspace';


export interface Project {
  id: number;
  status_id?: number;
  status?: Status;
  workspace_id?: number;
  workspace?: Workspace;
  name?: string;
  state?: string;
  guid?: string;
  meta?: any;
  abr?: string;
  image?: any;
}

import { Project } from './project';
import { Asset } from './asset';


export interface Section {
  id: number;
  project_id?: number;
  project?: Project;
  assets?: Asset[];
  name?: string;
  order?: number;
  state?: string;
}

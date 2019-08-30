import { Account } from '../../shared/interfaces/account';
import { Project } from '../../shared/interfaces/project';
import { Task } from '../../shared/interfaces/task';
import { TimeEntryType } from '../enums/time-entry-type.enum';


export interface TimeEntry {
  readonly id?: number;
  account_id?: number;
  task_id?: number;
  task?: Task;
  account?: Account;
  project_id?: number;
  project?: Project;
  state?: string;
  start_date?: string;
  end_date?: string;
  timezone?: string;
  date?: string;
  type?: TimeEntryType;
  minutes?: number;
  description?: string;
  create_date?: string;
}

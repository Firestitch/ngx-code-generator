import { TimeEntry } from './time-entry';


export interface Timer {
  time_entry: TimeEntry;
  formatted_time: string;
  duration: number;
}

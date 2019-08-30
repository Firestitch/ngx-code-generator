
import { SessionState } from '../enums/session-state.enum';

export const SessionStates = [
  { name: 'Active', value: SessionState.Active, undelete: true },
  { name: 'Deleted', value: SessionState.Deleted, deleted: true }
];


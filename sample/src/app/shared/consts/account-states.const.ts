
import { AccountState } from '../enums/account-state.enum';

export const AccountStates = [
  { name: 'Active', value: AccountState.Active, undelete: true },
  { name: 'Pending', value: AccountState.PendingActivation, pendingActivation: true, undelete: true },
  { name: 'Deleted', value: AccountState.Deleted, deleted: true }
];


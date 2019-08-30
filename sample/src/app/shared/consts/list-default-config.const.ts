import { PaginationStrategy, FsListConfig } from '@firestitch/list';

export const ListDefaultConfig: FsListConfig = {
  scrollable: {
    name: 'app-scroll',
  },
  paging: {
    strategy: PaginationStrategy.Offset,
    limit: 25
  },
  chips: true
};

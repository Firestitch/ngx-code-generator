
export function jwtOptionsFactory(fsStore) {
  return {
    tokenGetter: () => {
      return fsStore.get('token');
    },
    whitelistedDomains: []
  }
}

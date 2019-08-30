import { env } from './env';

export const environment = {
  production: true,
  apiPath: '/api/',
  apiDomain: '',
  build: {},
  platform: (<any>env).platform,
  facebookAppId: '',
  googleClientId: ''
};

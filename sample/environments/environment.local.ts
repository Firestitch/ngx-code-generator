import { env } from './env';

export const environment = {
  production: false,
  apiPath: '/api/',
  apiDomain: '',
  build: {},
  platform: (<any>env).platform,
  facebookAppId: '197085513672785',
  googleClientId: '46829300559-mhh6fcjfsermhun515blfn58td8b1h29.apps.googleusercontent.com'
};

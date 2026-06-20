import { firebaseConfig } from './firebase.config';

export const environment = {
  production: false,
  feedMode: 'demo' as 'live' | 'demo',
  useEmulators: false,
  firebase: firebaseConfig,
};

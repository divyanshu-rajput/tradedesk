import { firebaseConfig } from './firebase.config';

export const environment = {
  production: false,
  feedMode: 'live' as 'live' | 'demo',
  useEmulators: false,
  firebase: firebaseConfig,
};

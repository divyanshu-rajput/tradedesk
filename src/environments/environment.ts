import { firebaseConfig } from './firebase.config';

export const environment = {
  production: true,
  feedMode: 'live' as 'live' | 'demo',
  useEmulators: false,
  firebase: firebaseConfig,
};

import { firebaseConfig } from './firebase.config';

/** Demo feed + Firebase emulators — used by Playwright in CI. */
export const environment = {
  production: false,
  feedMode: 'demo' as 'live' | 'demo',
  useEmulators: true,
  firebase: firebaseConfig,
};

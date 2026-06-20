import { signal } from '@angular/core';

export class MockAuthService {
  displayLabel = signal('Guest session');
  isAnonymous = signal(true);
  user = signal({ uid: 'guest-uid', isAnonymous: true });
  signInAsGuest = jest.fn().mockResolvedValue({ uid: 'guest-uid', isAnonymous: true });
  startGoogleSignInRedirect = jest.fn().mockResolvedValue(undefined);
  handleGoogleRedirectResult = jest.fn().mockResolvedValue(null);
  signOut = jest.fn().mockResolvedValue(undefined);
  waitForAuthResolution = jest.fn().mockResolvedValue({ uid: 'guest-uid', isAnonymous: true });
  waitForUser = jest.fn().mockResolvedValue({ uid: 'guest-uid', isAnonymous: true });
  hasActiveAppSession = jest.fn().mockReturnValue(true);
  markAppSessionActive = jest.fn();
  clearAppSession = jest.fn();
}

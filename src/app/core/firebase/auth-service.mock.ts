import { signal } from '@angular/core';

export class MockAuthService {
  displayLabel = signal('Guest session');
  isAnonymous = signal(true);
  signInAsGuest = jest.fn().mockResolvedValue({ uid: 'guest-uid', isAnonymous: true });
  signInWithGoogle = jest.fn();
  waitForAuthResolution = jest.fn().mockResolvedValue({ uid: 'guest-uid', isAnonymous: true });
  waitForUser = jest.fn().mockResolvedValue({ uid: 'guest-uid', isAnonymous: true });
  hasActiveAppSession = jest.fn().mockReturnValue(true);
  markAppSessionActive = jest.fn();
}

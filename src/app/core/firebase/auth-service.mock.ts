import { signal } from '@angular/core';

export class MockAuthService {
  displayLabel = signal('Guest session');
  isAnonymous = signal(true);
  signInWithGoogle = jest.fn();
}

import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthStatusComponent } from './auth-status.component';

class MockAuthService {
  displayLabel = signal('Guest session');
  isAnonymous = signal(true);
  signInWithGoogle = jest.fn();
}

jest.mock('../../core/firebase/auth.service', () => ({
  AuthService: MockAuthService,
}));

import { AuthService } from '../../core/firebase/auth.service';

describe('AuthStatusComponent', () => {
  let fixture: ComponentFixture<AuthStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthStatusComponent],
      providers: [provideZonelessChangeDetection(), AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthStatusComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthStatusComponent } from './auth-status.component';

jest.mock('../../core/firebase/auth.service', () => {
  const { MockAuthService } = jest.requireActual<
    typeof import('../../core/firebase/auth-service.mock')
  >('../../core/firebase/auth-service.mock');
  return { AuthService: MockAuthService };
});

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

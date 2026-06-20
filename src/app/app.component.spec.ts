import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

jest.mock('./core/firebase/auth.service', () => {
  const { MockAuthService } = jest.requireActual<
    typeof import('./core/firebase/auth-service.mock')
  >('./core/firebase/auth-service.mock');
  return { AuthService: MockAuthService };
});

import { AuthService } from './core/firebase/auth.service';
import AppComponent from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideZonelessChangeDetection(), provideRouter(routes), AuthService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render TradeDesk title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1.shell__title')?.textContent).toContain('TradeDesk');
  });
});

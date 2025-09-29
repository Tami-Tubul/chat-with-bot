import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Directionality } from '@angular/cdk/bidi';
import { BehaviorSubject } from 'rxjs';

const dirChange$ = new BehaviorSubject<'ltr' | 'rtl'>('rtl');

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  {
    provide: Directionality,
    useValue: {
      value: 'rtl',
      change: dirChange$
    }
  }
  ]
};

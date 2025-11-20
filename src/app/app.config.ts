import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { AuthService } from './shared/services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'budget-pwa-15650',
        appId: '1:850076580826:web:b32e84abdd36600b5ddee3',
        storageBucket: 'budget-pwa-15650.firebasestorage.app',
        apiKey: 'AIzaSyAaeoKCe2L-NGZH0t8OCeLDVlbMQ_8MGUc',
        authDomain: 'budget-pwa-15650.firebaseapp.com',
        messagingSenderId: '850076580826',
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.ensureInit();
    }),
  ],
};

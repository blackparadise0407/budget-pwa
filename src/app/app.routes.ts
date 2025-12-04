import { Routes } from '@angular/router';

import { authGuard } from './shared/guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/core-layout/core-layout.component').then(
        (m) => m.CoreLayoutComponent,
      ),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            './categories/categories-config/categories-config.component'
          ).then((m) => m.CategoriesConfigComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./user/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  { path: '**', redirectTo: '' },
];

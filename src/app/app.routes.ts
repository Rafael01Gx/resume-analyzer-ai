import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home.component';
import {authGuard} from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: 'Resumo',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    title: 'Login',
    pathMatch: 'full',
    loadComponent: ()=> import ('./pages/login.component').then(m => m.LoginComponent),
  }
];

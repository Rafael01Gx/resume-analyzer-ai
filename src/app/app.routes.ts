import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home.component';
import {authGuard} from './guards/auth.guard';


export const routes: Routes = [

  {
    path: 'home',
    title: 'Resumo',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'upload',
    title: 'Upload',
    pathMatch: 'full',
    loadComponent: () => import ('./pages/upload.component').then(m => m.UploadComponent),
    canActivate: [authGuard]
  },
  {
    path: 'wipe',
    title: 'Remove',
    pathMatch: 'full',
    loadComponent: () => import ('./pages/wipe.component').then(m => m.WipeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'resume/:id',
    title: 'Detalhes | Currículo',
    pathMatch: 'full',
    loadComponent: () => import ('./pages/resume.component').then(m => m.ResumeComponent),
    canActivate: [authGuard]
  },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'},
];

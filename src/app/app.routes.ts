import { Routes } from '@angular/router';
import { Index } from './pages/index';
import { Login } from './pages/login/login.component';
import { SignUp } from './pages/sign-up/sign-up';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { Dashboard } from './pages/dashboard/dashboard';
import { Exportpage } from './pages/exportpage/exportpage';
import { Perfil } from './pages/perfil/perfil';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: Index, canActivate: [AuthGuard], data: { protected: false } },
  { path: 'login', component: Login, canActivate: [AuthGuard], data: { protected: false } },
  { path: 'sign-up', component: SignUp, canActivate: [AuthGuard], data: { protected: false } },
  
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], data: { protected: true } },
  { path: 'export', component: Exportpage, canActivate: [AuthGuard], data: { protected: true } },
  { path: 'perfil', component: Perfil, canActivate: [AuthGuard], data: { protected: true } },

  { path: '**', component: PageNotFound }
];

import { Routes } from '@angular/router';
import { Index } from './pages/index';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    {path:'', component: Index},
    {path:'login', component:Login},
    {path:'sign-up',component:SignUp},
    {path:'dashboard',component:Dashboard},
    {path:'**', component:PageNotFound}
];


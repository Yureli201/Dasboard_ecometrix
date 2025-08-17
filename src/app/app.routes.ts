import { Routes } from '@angular/router';
import { Index } from './pages/index';
import { Login } from './pages/login/login.component';
import { SignUp } from './pages/sign-up/sign-up';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { Dashboard } from './pages/dashboard/dashboard';
import { Exportpage } from './pages/exportpage/exportpage';


export const routes: Routes = [
    {path:'', component: Index},
    {path:'login', component:Login},
    {path:'sign-up',component:SignUp},
    {path:'dashboard',component:Dashboard},
    {path:'export',component:Exportpage},
    {path:'**', component:PageNotFound}
];


import { Routes } from '@angular/router';
import {iamGuard} from './IAM/presentation/iam.guard';
import {Layout} from './shared/presentation/component/layout/layout';

const signInForm = () => import('./IAM/presentation/views/sign-in-form/sign-in-form').then(m => m.SignInForm);
const signUpForm = () => import('./IAM/presentation/views/sign-up-form/sign-up-form').then(m => m.SignUpForm);
const dashboardRoutes = () => import('./Dashboard/presentation/dashboard.routes').then(m => m.dashboardRoutes);
const carsRoutes = () => import('./Cars/presentation/cars.routes').then(m => m.carsRoutes);
const clientsRoutes = () => import('./Clients/presentation/clients.routes').then(m => m.clientsRoutes);
const simulatorRoutes = () => import('./Simulator/presentation/simulator.routes').then(m => m.simulatorRoutes);
const schedulesRoutes = () => import('./Schedules/presentation/schedules.routes').then(m => m.schedulesRoutes);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);

// Título base que se reutiliza en todas las pestañas del navegador
const baseTitle = 'PayDrive';

export const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', loadComponent: signInForm },
  { path: 'sign-up', loadComponent: signUpForm },
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard],
    children: [
      { path: 'dashboard', loadChildren: dashboardRoutes, title: `${baseTitle} - Dashboard` },
      { path: 'clients', loadChildren: clientsRoutes },
      { path: 'cars', loadChildren: carsRoutes },
      { path: 'simulator', loadChildren: simulatorRoutes },
      { path: 'schedules', loadChildren: schedulesRoutes },
    ],
  },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];

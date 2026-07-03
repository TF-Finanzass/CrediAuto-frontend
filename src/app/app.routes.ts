import { Routes } from '@angular/router';
import {iamGuard} from './IAM/presentation/iam.guard';

const iamRoutes = () => import('./IAM/presentation/iam.routes').then(m => m.iamRoutes);
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
  { path: '', loadChildren: iamRoutes },
  { path: 'dashboard', loadChildren: dashboardRoutes, canActivate: [iamGuard], title: `${baseTitle} - Dashboard` },
  { path: 'clients', loadChildren: clientsRoutes, canActivate: [iamGuard] },
  { path: 'cars', loadChildren: carsRoutes, canActivate: [iamGuard] },
  { path: 'simulator', loadChildren: simulatorRoutes, canActivate: [iamGuard] },
  { path: 'schedules', loadChildren: schedulesRoutes, canActivate: [iamGuard] },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];

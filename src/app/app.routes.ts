import { Routes } from '@angular/router';
import { iamGuard } from './IAM/presentation/iam.guard';
import { buyerOnlyGuard } from './IAM/presentation/role.guard';

const iamRoutes = () => import('./IAM/presentation/iam.routes').then((m) => m.iamRoutes);
const dashboardRoutes = () => import('./Dashboard/presentation/dashboard.routes').then((m) => m.dashboardRoutes);
const clientsRoutes = () => import('./Clients/presentation/clients.routes').then((m) => m.clientsRoutes);
const carsRoutes = () => import('./Cars/presentation/cars.routes').then((m) => m.carsRoutes);
const simulatorRoutes = () => import('./Simulator/presentation/simulator.routes').then((m) => m.simulatorRoutes);
const schedulesRoutes = () => import('./Schedules/presentation/schedules.routes').then((m) => m.schedulesRoutes);
const configurationRoutes = () => import('./Configuration/presentation/configuration.routes').then((m) => m.configurationRoutes);
const helpRoutes = () => import('./Helps/presentation/helps.routes').then((m) => m.helpRoutes);
const unauthorized = () => import('./shared/presentation/views/unauthorized/unauthorized').then((m) => m.Unauthorized);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const baseTitle = 'PayDrive';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', loadChildren: iamRoutes },
  { path: 'unauthorized', loadComponent: unauthorized, canActivate: [iamGuard] },
  { path: 'dashboard', loadChildren: dashboardRoutes, canActivate: [iamGuard, buyerOnlyGuard], title: `${baseTitle} - Dashboard` },
  { path: 'clients', loadChildren: clientsRoutes, canActivate: [iamGuard, buyerOnlyGuard] },
  { path: 'cars', loadChildren: carsRoutes, canActivate: [iamGuard, buyerOnlyGuard] },
  { path: 'simulator', loadChildren: simulatorRoutes, canActivate: [iamGuard, buyerOnlyGuard] },
  { path: 'schedules', loadChildren: schedulesRoutes, canActivate: [iamGuard, buyerOnlyGuard] },
  { path: 'configuration', loadChildren: configurationRoutes, canActivate: [iamGuard, buyerOnlyGuard] },
  { path: 'help', loadChildren: helpRoutes, canActivate: [iamGuard, buyerOnlyGuard] },
  { path: '**',  loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found`, data: { hideLayoutSidebar: true } }
];

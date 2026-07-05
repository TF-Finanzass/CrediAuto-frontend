import { Routes } from '@angular/router';

const dashboard = () => import('./views/dashboard/dashboard').then(m => m.Dashboard);

export const dashboardRoutes: Routes = [
  { path: '', loadComponent: dashboard }
];

import { Routes } from '@angular/router';

const simulator = () => import('./views/simulator/simulator').then(m => m.Simulator);

export const simulatorRoutes: Routes = [
  { path: '', loadComponent: simulator }
];

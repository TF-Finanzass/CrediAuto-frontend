import { Routes } from '@angular/router';

const help = () => import('./views/help/help').then((m) => m.Help);

export const helpRoutes: Routes = [{ path: '', loadComponent: help }];

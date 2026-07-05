import { Routes } from '@angular/router';

const clientList = () => import('./views/client-list/client-list').then(m => m.ClientList);
const clientForm = () => import('./views/client-form/client-form').then(m => m.ClientForm);

export const clientsRoutes: Routes = [
  { path: '',    loadComponent: clientList },
  { path: 'new', loadComponent: clientForm }
];

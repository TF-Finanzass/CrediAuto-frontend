import { Routes } from '@angular/router';

const carList = () => import('./views/car-list/car-list').then((m) => m.CarList);
const carForm = () => import('./views/car-form/car-form').then((m) => m.CarForm);

export const carsRoutes: Routes = [
  { path: '', loadComponent: carList },
  { path: 'new', loadComponent: carForm },
  { path: ':id/edit', loadComponent: carForm },
];

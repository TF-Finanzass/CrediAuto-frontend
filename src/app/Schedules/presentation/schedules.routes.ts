import { Routes } from '@angular/router';

const operationList = () => import('./views/operation-list/operation-list').then(m => m.OperationList);
const operationDetail = () => import('./views/operation-detail/operation-detail').then(m => m.OperationDetail);

export const schedulesRoutes: Routes = [
  { path: '',       loadComponent: operationList },
  { path: ':id',    loadComponent: operationDetail }
];

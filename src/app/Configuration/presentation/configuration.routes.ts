import { Routes } from '@angular/router';

const configuration = () =>  import('./views/configuration/configuration').then((m) => m.Configuration);

export const configurationRoutes: Routes = [{
  path: '', loadComponent: configuration
}];

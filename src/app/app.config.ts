import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideTranslateService} from '@ngx-translate/core';
import {iamInterceptor} from './IAM/presentation/iam.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Habilita peticiones HTTP usando la API moderna fetch del navegador
    provideHttpClient(withFetch(), withInterceptors([iamInterceptor])),
    // Activa el sistema de traducciones (ngx-translate)
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'es'
    }),
    provideRouter(routes)
  ]
};

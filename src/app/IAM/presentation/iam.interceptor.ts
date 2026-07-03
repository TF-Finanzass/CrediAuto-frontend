import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {IamStore} from '../application/iam.store';

/**
 * HTTP interceptor for adding authorization headers to requests in the infrastructure layer of the IAM bounded context.
 */
export const iamInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(IamStore);
  const token = store.currentToken();
  const handledRequest = token
    ? request.clone({headers: request.headers.set('Authorization', `Bearer ${token}`)})
    : request;
  return next(handledRequest);
};

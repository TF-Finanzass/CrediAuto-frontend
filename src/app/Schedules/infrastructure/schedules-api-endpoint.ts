import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { CreditOperation } from '../domain/model/credit-operation';
import { CreditOperationResource, CreditOperationsResponse } from './credit-operation-response';
import { CreditOperationAssembler } from './credit-operation-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class SchedulesApiEndpoint extends BaseApiEndpoint< CreditOperation, CreditOperationResource, CreditOperationsResponse, CreditOperationAssembler > {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderCreditOperationsEndpointPath}`,
      new CreditOperationAssembler(),
    );
  }
}

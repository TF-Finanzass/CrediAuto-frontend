import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Car} from '../domain/model/car.entity';
import {CarResource, CarsResponse} from './cars-response';
import {CarAssembler} from './car-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * API endpoint for managing cars in the infrastructure layer of the 'cars' bounded context.
 */
export class CarsApiEndpoint extends BaseApiEndpoint<Car, CarResource, CarsResponse, CarAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderCarsEndpointPath}`, new CarAssembler());
  }
}

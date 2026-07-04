import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Car, CarStatus } from '../domain/model/car.entity';
import { CarResource, CarsResponse } from './cars-response';
import { Currency } from '../../Configuration/domain/model/currency';

export class CarAssembler implements BaseAssembler<Car, CarResource, CarsResponse> {
  toEntitiesFromResponse(response: CarsResponse): Car[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: CarResource): Car {
    return new Car({
      id: resource.id,
      brand: resource.brand,
      model: resource.model,
      year: resource.year,
      price: resource.price,
      currency: resource.currency as Currency,
      detail: resource.detail,
      status: resource.status as CarStatus,
    });
  }

  toResourceFromEntity(entity: Car): CarResource {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      year: entity.year,
      price: entity.price,
      currency: entity.currency,
      detail: entity.detail,
      status: entity.status,
    } as CarResource;
  }
}

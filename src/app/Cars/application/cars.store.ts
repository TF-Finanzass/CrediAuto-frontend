import {computed, Injectable, signal} from '@angular/core';
import {Car} from '../domain/model/car.entity';
import {HttpClient} from '@angular/common/http';
import {CarsApiEndpoint} from '../infrastructure/cars-api-endpoint';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CarsStore {
  private readonly carsEndpoint: CarsApiEndpoint;

  private readonly carsSignal = signal<Car[]>([]);
  readonly cars = this.carsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly carCount = computed(() => this.cars().length);

  constructor(http: HttpClient) {
    this.carsEndpoint = new CarsApiEndpoint(http);
    this.loadCars();
  }

  addCar(car: Car): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.carsEndpoint.create(car).pipe(retry(2)).subscribe({
      next: createdCar => {
        this.carsSignal.update(cars => [...cars, createdCar]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create car'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateCar(id: number, car: Car): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.carsEndpoint.update(car, id).pipe(retry(2)).subscribe({
      next: updatedCar => {
        this.carsSignal.update(cars => cars.map(c => c.id === id ? updatedCar : c));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update car'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteCar(car: Car): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.carsEndpoint.delete(car.id).pipe(retry(2)).subscribe({
      next: () => {
        this.carsSignal.update(cars => cars.filter(c => c.id !== car.id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete car'));
        this.loadingSignal.set(false);
      }
    });
  }

  getCarById(id: number) {
    return this.carsEndpoint.getById(id);
  }

  private loadCars(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.carsEndpoint.getAll().pipe(takeUntilDestroyed()).subscribe({
      next: cars => {
        this.carsSignal.set(cars);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load cars'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}

import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CarsStore} from '../../../application/cars.store';
import {Car, CarStatus} from '../../../domain/model/car.entity';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Component for creating a new car in the presentation layer of the 'cars' bounded context.
 */
@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, TranslatePipe],
  templateUrl: './car-form.html',
  styleUrl: './car-form.css'
})
export class CarForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(CarsStore);

  statuses = Object.values(CarStatus);

  form = this.fb.group({
    brand: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    model: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    year: new FormControl<number>(new Date().getFullYear(), {nonNullable: true, validators: [Validators.required, Validators.min(1990)]}),
    price: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    fuelType: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    transmission: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    detail: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    status: new FormControl<CarStatus>(CarStatus.Disponible, {nonNullable: true, validators: [Validators.required]})
  });

  submit() {
    if (this.form.invalid) return;

    const car: Car = new Car({
      id: 0,
      brand: this.form.value.brand!,
      model: this.form.value.model!,
      year: this.form.value.year!,
      price: this.form.value.price!,
      fuelType: this.form.value.fuelType!,
      transmission: this.form.value.transmission!,
      detail: this.form.value.detail!,
      status: this.form.value.status!
    });

    this.store.addCar(car);
    this.router.navigate(['cars']).then();
  }
}

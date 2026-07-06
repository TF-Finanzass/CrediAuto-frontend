import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarsStore } from '../../../application/cars.store';
import { Car, CarStatus } from '../../../domain/model/car.entity';
import { Currency } from '../../../../Configuration/domain/model/currency';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-car-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './car-form.html',
  styleUrl: './car-form.css',
})
export class CarForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(CarsStore);

  statuses = Object.values(CarStatus);
  currencies = Object.values(Currency);

  carId: number | null = null;
  isEditMode = false;

  form = this.fb.group({
    brand: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    model: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl<number>(new Date().getFullYear(), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1990)],
    }),
    price: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    currency: new FormControl<Currency>(Currency.PEN, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    detail: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<CarStatus>(CarStatus.Disponible, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.carId = Number(idParam);
      this.isEditMode = true;
      this.store.getCarById(this.carId).subscribe((car) => {
        this.form.patchValue({
          brand: car.brand,
          model: car.model,
          year: car.year,
          price: car.price,
          currency: car.currency,
          detail: car.detail,
          status: car.status,
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const car: Car = new Car({
      id: this.carId ?? 0,
      brand: this.form.value.brand!,
      model: this.form.value.model!,
      year: this.form.value.year!,
      price: this.form.value.price!,
      currency: this.form.value.currency!,
      detail: this.form.value.detail!,
      status: this.form.value.status!,
    });

    if (this.isEditMode && this.carId !== null) {
      this.store.updateCar(this.carId, car);
    } else {
      this.store.addCar(car);
    }
    this.router.navigate(['cars']).then();
  }

  goBack() {
    this.router.navigate(['cars']).then();
  }
}

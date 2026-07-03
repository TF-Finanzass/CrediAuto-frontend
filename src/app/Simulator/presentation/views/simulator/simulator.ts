import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {DecimalPipe, DatePipe} from '@angular/common';
import {ClientsStore} from '../../../../Clients/application/clients.store';
import {CarsStore} from '../../../../Cars/application/cars.store';
import {FrenchAmortizationService} from '../../../application/services/french-amortization.service';
import {CreditSimulationResult} from '../../../domain/model/installment';
import {RateType} from '../../../domain/model/rate-type';
import {GraceType} from '../../../domain/model/grace-type';
import {PaymentFrequency} from '../../../domain/model/payment-frequency';
import {SchedulesStore} from '../../../../Schedules/application/schedules.store';

@Component({
  selector: 'app-simulator',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatButtonToggleModule, DecimalPipe, DatePipe
  ],
  templateUrl: './simulator.html',
  styleUrl: './simulator.css'
})
export class Simulator {
  private fb = inject(FormBuilder);
  private amortizationService = inject(FrenchAmortizationService);
  private schedulesStore = inject(SchedulesStore);
  private router = inject(Router);

  clientsStore = inject(ClientsStore);
  carsStore = inject(CarsStore);

  rateTypes = Object.values(RateType);
  graceTypes = Object.values(GraceType);
  frequencies = Object.values(PaymentFrequency);

  result = signal<CreditSimulationResult | null>(null);

  form = this.fb.group({
    clientId: [null as number | null, Validators.required],
    carId: [null as number | null, Validators.required],
    vehiclePrice: [0, [Validators.required, Validators.min(0)]],
    downPaymentPercent: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
    rateType: [RateType.Efectiva, Validators.required],
    annualRate: [18, [Validators.required, Validators.min(0)]],
    capitalization: [PaymentFrequency.Mensual],
    paymentFrequency: [PaymentFrequency.Mensual, Validators.required],
    termMonths: [48, [Validators.required, Validators.min(1)]],
    graceType: [GraceType.Sin, Validators.required],
    graceMonths: [0, [Validators.min(0)]],
    monthlyInsurance: [0, [Validators.min(0)]]
  });

  /** Cuando eligen un vehículo, autocompleta el precio. */
  onCarSelected(carId: number): void {
    const car = this.carsStore.cars().find(c => c.id === carId);
    if (car) this.form.patchValue({vehiclePrice: car.price});
  }

  calcular(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const result = this.amortizationService.simulate({
      clientId: v.clientId!,
      carId: v.carId!,
      currency: 'PEN',
      vehiclePrice: v.vehiclePrice!,
      downPaymentPercent: v.downPaymentPercent!,
      rateType: v.rateType!,
      annualRate: v.annualRate!,
      capitalization: v.capitalization!,
      paymentFrequency: v.paymentFrequency!,
      termMonths: v.termMonths!,
      graceType: v.graceType!,
      graceMonths: v.graceMonths ?? 0,
      monthlyInsurance: v.monthlyInsurance ?? 0
    });
    this.result.set(result);
  }

  guardar(): void {
    const r = this.result();
    if (!r) return;

    const client = this.clientsStore.clients().find(c => c.id === this.form.value.clientId);
    const car = this.carsStore.cars().find(c => c.id === this.form.value.carId);
    if (!client || !car) return;

    const operacion = this.schedulesStore.addOperation({
      clientId: client.id,
      clientName: `${client.fullName} ${client.lastName}`,
      carId: car.id,
      carLabel: `${car.brand} ${car.model} ${car.year}`,
      financedAmount: r.financedAmount,
      tea: r.tea,
      periodicRate: r.periodicRate,
      installmentAmount: r.installmentAmount,
      totalPeriods: r.totalPeriods,
      gracePeriods: r.gracePeriods,
      schedule: r.schedule
    });

    this.router.navigate(['/schedules', operacion.id]).then();
    this.router.navigate(['/cronogramas', operacion.id]).then();
  }

  limpiar(): void {
    this.form.reset({
      downPaymentPercent: 20, rateType: RateType.Efectiva, annualRate: 18,
      capitalization: PaymentFrequency.Mensual, paymentFrequency: PaymentFrequency.Mensual,
      termMonths: 48, graceType: GraceType.Sin, graceMonths: 0, monthlyInsurance: 0
    });
    this.result.set(null);
  }

  protected readonly RateType = RateType;
  protected readonly GraceType = GraceType;
}

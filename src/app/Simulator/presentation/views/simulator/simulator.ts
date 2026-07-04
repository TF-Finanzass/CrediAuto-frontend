import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DecimalPipe } from '@angular/common';
import { ClientsStore } from '../../../../Clients/application/clients.store';
import { CarsStore } from '../../../../Cars/application/cars.store';
import { FrenchAmortizationService } from '../../../application/services/french-amortization.service';
import { CreditSimulationResult } from '../../../domain/model/installment';
import { RateType } from '../../../domain/model/rate-type';
import { GraceType } from '../../../domain/model/grace-type';
import { PaymentFrequency } from '../../../domain/model/payment-frequency';
import { SchedulesStore } from '../../../../Schedules/application/schedules.store';
import { ConfigurationStore } from '../../../../Configuration/application/configuration.store';
import { Currency, currencySymbol } from '../../../../Configuration/domain/model/currency';

@Component({
  selector: 'app-simulator',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    DecimalPipe,
  ],
  templateUrl: './simulator.html',
  styleUrl: './simulator.css',
})
export class Simulator {
  private fb = inject(FormBuilder);
  private amortizationService = inject(FrenchAmortizationService);
  private router = inject(Router);

  schedulesStore = inject(SchedulesStore);
  clientsStore = inject(ClientsStore);
  carsStore = inject(CarsStore);
  configStore = inject(ConfigurationStore);

  rateTypes = Object.values(RateType);
  graceTypes = Object.values(GraceType);
  frequencies = Object.values(PaymentFrequency);

  result = signal<CreditSimulationResult | null>(null);

  protected readonly currencySymbol = currencySymbol;
  selectedCarCurrency = signal<Currency | null>(null);

  guardando = signal(false);

  /** Marca si el resultado mostrado quedó desactualizado por un cambio de moneda/tipo de cambio. */
  resultadoDesactualizado = signal(false);

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
    monthlyInsurance: [0, [Validators.min(0)]],
    discountRate: [10, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    // Reacciona a cambios de moneda global o de tipo de cambio (configStore.currency() / exchangeRate()
    // se leen dentro de convert()), y reconvierte el precio del vehículo desde su moneda original.
    effect(() => {
      const target = this.configStore.currency();
      const carCurrency = this.selectedCarCurrency();
      if (!carCurrency) return;

      const carId = this.form.value.carId;
      const car = this.carsStore.cars().find((c) => c.id === carId);
      if (!car) return;

      const convertedPrice = this.configStore.convert(car.price, carCurrency, target);
      this.form.patchValue({ vehiclePrice: convertedPrice }, { emitEvent: false });

      // El cronograma/VAN/TIR ya calculados quedaron en la moneda anterior: los marcamos obsoletos.
      if (this.result()) {
        this.resultadoDesactualizado.set(true);
      }
    });
  }

  /** Cuando eligen un vehículo, convierte su precio a la moneda global y autocompleta el campo. */
  onCarSelected(carId: number): void {
    const car = this.carsStore.cars().find((c) => c.id === carId);
    if (!car) return;

    this.selectedCarCurrency.set(car.currency);
    const targetCurrency = this.configStore.currency();
    const convertedPrice = this.configStore.convert(car.price, car.currency, targetCurrency);
    this.form.patchValue({ vehiclePrice: convertedPrice });
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
      currency: this.configStore.currency(),
      vehiclePrice: v.vehiclePrice!,
      downPaymentPercent: v.downPaymentPercent!,
      rateType: v.rateType!,
      annualRate: v.annualRate!,
      capitalization: v.capitalization!,
      paymentFrequency: v.paymentFrequency!,
      termMonths: v.termMonths!,
      graceType: v.graceType!,
      graceMonths: v.graceMonths ?? 0,
      monthlyInsurance: v.monthlyInsurance ?? 0,
      discountRate: v.discountRate!,
    });
    this.result.set(result);
    this.resultadoDesactualizado.set(false);
  }

  guardar(): void {
    const r = this.result();
    if (!r) return;

    const client = this.clientsStore.clients().find((c) => c.id === this.form.value.clientId);
    const car = this.carsStore.cars().find((c) => c.id === this.form.value.carId);
    if (!client || !car) return;

    this.guardando.set(true);

    this.schedulesStore.addOperation(
      {
        clientId: client.id,
        clientName: `${client.fullName} ${client.lastName}`,
        carId: car.id,
        carLabel: `${car.brand} ${car.model} ${car.year}`,
        currency: this.configStore.currency(),
        financedAmount: r.financedAmount,
        tea: r.tea,
        periodicRate: r.periodicRate,
        installmentAmount: r.installmentAmount,
        totalPeriods: r.totalPeriods,
        gracePeriods: r.gracePeriods,
        schedule: r.schedule,
        van: r.van,
        tir: r.tir,
        discountRate: r.discountRate,
      },
      (operacion) => {
        this.guardando.set(false);
        this.router.navigate(['/schedules', operacion.id]).then();
      },
      () => {
        this.guardando.set(false);
      },
    );
  }

  limpiar(): void {
    this.form.reset({
      downPaymentPercent: 20,
      rateType: RateType.Efectiva,
      annualRate: 18,
      capitalization: PaymentFrequency.Mensual,
      paymentFrequency: PaymentFrequency.Mensual,
      termMonths: 48,
      graceType: GraceType.Sin,
      graceMonths: 0,
      monthlyInsurance: 0,
      discountRate: 10,
    });
    this.result.set(null);
    this.selectedCarCurrency.set(null);
    this.resultadoDesactualizado.set(false);
  }

  protected readonly RateType = RateType;
  protected readonly GraceType = GraceType;
}

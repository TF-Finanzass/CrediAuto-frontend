import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ClientsStore } from '../../../../Clients/application/clients.store';
import { ClientStatus } from '../../../../Clients/domain/model/client.entity';
import { CarsStore } from '../../../../Cars/application/cars.store';
import { CarStatus } from '../../../../Cars/domain/model/car.entity';
import { FrenchAmortizationService } from '../../../application/services/french-amortization.service';
import { CreditSimulationResult } from '../../../domain/model/installment';
import { RateType } from '../../../domain/model/rate-type';
import { PaymentFrequency } from '../../../domain/model/payment-frequency';
import { defaultFinalInstallmentPercent } from '../../../domain/model/plan-type';
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
    MatCheckboxModule,
    DecimalPipe,
    TranslatePipe,
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
  frequencies = Object.values(PaymentFrequency).filter((f) => f !== PaymentFrequency.Diaria);
  capitalizationFrequencies = Object.values(PaymentFrequency);

  result = signal<CreditSimulationResult | null>(null);

  approvedClients = computed(() =>
    this.clientsStore.clients().filter((c) => c.status === ClientStatus.Aprobado),
  );

  availableCars = computed(() =>
    this.carsStore.cars().filter((c) => c.status === CarStatus.Disponible),
  );

  protected readonly currencySymbol = currencySymbol;
  selectedCarCurrency = signal<Currency | null>(null);

  guardando = signal(false);
  resultadoDesactualizado = signal(false);

  form = this.fb.group({
    clientId: [null as number | null, Validators.required],
    carId: [null as number | null, Validators.required],
    vehiclePrice: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
    downPaymentPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    rateType: [RateType.Efectiva, Validators.required],
    annualRate: [0, [Validators.required, Validators.min(0)]],
    capitalization: [PaymentFrequency.Diaria],
    paymentFrequency: [PaymentFrequency.Mensual, Validators.required],
    termMonths: [0, [Validators.required, Validators.min(1)]],

    useAutoFinalInstallment: [true],
    finalInstallmentPercent: [
      { value: 40, disabled: true },
      [Validators.min(0), Validators.max(100)],
    ],

    graceTotalMonths: [0, [Validators.min(0)]],
    gracePartialMonths: [0, [Validators.min(0)]],

    initialCosts: this.fb.group({
      notarial: [0, [Validators.min(0)]],
      registration: [0, [Validators.min(0)]],
      appraisal: [0, [Validators.min(0)]],
      studyFee: [0, [Validators.min(0)]],
      activationFee: [0, [Validators.min(0)]],
    }),

    periodicCharges: this.fb.group({
      gps: [0, [Validators.min(0)]],
      postage: [0, [Validators.min(0)]],
      administrativeFee: [0, [Validators.min(0)]],
    }),

    desgravamenInsurancePercent: [0, [Validators.min(0)]],
    riskInsurancePercent: [0, [Validators.min(0)]],

    discountRate: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      const target = this.configStore.currency();
      const carCurrency = this.selectedCarCurrency();
      if (!carCurrency) return;

      const carId = this.form.value.carId;
      const car = this.carsStore.cars().find((c) => c.id === carId);
      if (!car) return;

      const convertedPrice = this.configStore.convert(car.price, carCurrency, target);
      this.form.patchValue({ vehiclePrice: convertedPrice }, { emitEvent: false });

      if (this.result()) {
        this.resultadoDesactualizado.set(true);
      }
    });

    this.form.controls.termMonths.valueChanges.subscribe((term) => {
      if (this.form.value.useAutoFinalInstallment && term) {
        this.form.controls.finalInstallmentPercent.setValue(defaultFinalInstallmentPercent(term), {
          emitEvent: false,
        });
      }
    });

    this.form.controls.useAutoFinalInstallment.valueChanges.subscribe((auto) => {
      const control = this.form.controls.finalInstallmentPercent;
      if (auto) {
        const term = this.form.value.termMonths ?? 36;
        control.setValue(defaultFinalInstallmentPercent(term), { emitEvent: false });
        control.disable({ emitEvent: false });
      } else {
        control.enable({ emitEvent: false });
      }
    });
  }

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
      finalInstallmentPercent: v.useAutoFinalInstallment ? undefined : v.finalInstallmentPercent!,
      graceTotalMonths: v.graceTotalMonths ?? 0,
      gracePartialMonths: v.gracePartialMonths ?? 0,
      initialCosts: {
        notarial: v.initialCosts!.notarial ?? 0,
        registration: v.initialCosts!.registration ?? 0,
        appraisal: v.initialCosts!.appraisal ?? 0,
        studyFee: v.initialCosts!.studyFee ?? 0,
        activationFee: v.initialCosts!.activationFee ?? 0,
      },
      periodicCharges: {
        gps: v.periodicCharges!.gps ?? 0,
        postage: v.periodicCharges!.postage ?? 0,
        administrativeFee: v.periodicCharges!.administrativeFee ?? 0,
      },
      desgravamenInsurancePercent: v.desgravamenInsurancePercent ?? 0,
      riskInsurancePercent: v.riskInsurancePercent ?? 0,
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

    const v = this.form.getRawValue();

    this.schedulesStore.addOperation(
      {
        clientId: client.id,
        clientName: `${client.fullName} ${client.lastName}`,
        carId: car.id,
        carLabel: `${car.brand} ${car.model} ${car.year}`,
        currency: this.configStore.currency(),
        loanAmount: r.loanAmount,
        finalInstallmentAmount: r.finalInstallmentAmount,
        netFinancedBalance: r.netFinancedBalance,
        tea: r.tea,
        periodicRate: r.periodicRate,
        installmentAmount: r.installmentAmount,
        totalPeriods: r.totalPeriods,
        graceTotalPeriods: r.graceTotalPeriods,
        gracePartialPeriods: r.gracePartialPeriods,
        initialCosts: {
          notarial: v.initialCosts!.notarial ?? 0,
          registration: v.initialCosts!.registration ?? 0,
          appraisal: v.initialCosts!.appraisal ?? 0,
          studyFee: v.initialCosts!.studyFee ?? 0,
          activationFee: v.initialCosts!.activationFee ?? 0,
        },
        periodicCharges: {
          gps: v.periodicCharges!.gps ?? 0,
          postage: v.periodicCharges!.postage ?? 0,
          administrativeFee: v.periodicCharges!.administrativeFee ?? 0,
        },
        desgravamenInsurancePercent: v.desgravamenInsurancePercent ?? 0,
        riskInsurancePercent: v.riskInsurancePercent ?? 0,
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
      clientId: null,
      carId: null,
      vehiclePrice: 0,
      downPaymentPercent: 0,
      rateType: RateType.Efectiva,
      annualRate: 0,
      capitalization: PaymentFrequency.Diaria,
      paymentFrequency: PaymentFrequency.Mensual,
      termMonths: 0,
      useAutoFinalInstallment: true,
      finalInstallmentPercent: 40,
      graceTotalMonths: 0,
      gracePartialMonths: 0,
      initialCosts: { notarial: 0, registration: 0, appraisal: 0, studyFee: 0, activationFee: 0 },
      periodicCharges: { gps: 0, postage: 0, administrativeFee: 0 },
      desgravamenInsurancePercent: 0,
      riskInsurancePercent: 0,
      discountRate: 0,
    });
    this.result.set(null);
    this.selectedCarCurrency.set(null);
    this.resultadoDesactualizado.set(false);
  }

  protected readonly RateType = RateType;

  protected rateTypeKey(rt: RateType): string {
    const map: Record<RateType, string> = {
      [RateType.Efectiva]: 'effective',
      [RateType.Nominal]: 'nominal',
    };
    return map[rt];
  }

  protected frequencyKey(freq: PaymentFrequency): string {
    const map: Record<PaymentFrequency, string> = {
      [PaymentFrequency.Diaria]: 'daily',
      [PaymentFrequency.Mensual]: 'monthly',
      [PaymentFrequency.Bimestral]: 'bimonthly',
      [PaymentFrequency.Trimestral]: 'quarterly',
      [PaymentFrequency.Cuatrimestral]: 'four-monthly',
      [PaymentFrequency.Semestral]: 'semiannual',
      [PaymentFrequency.Anual]: 'annual',
    };
    return map[freq];
  }
}

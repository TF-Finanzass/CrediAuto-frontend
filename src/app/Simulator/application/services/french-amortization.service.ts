import { Injectable } from '@angular/core';
import {
  CreditSimulationInput,
  CreditSimulationResult,
  Installment,
  InstallmentPeriodType,
} from '../../domain/model/installment';
import { RateType } from '../../domain/model/rate-type';
import { monthsPerPeriod, periodsPerYear } from '../../domain/model/payment-frequency';
import { sumInitialCosts } from '../../domain/model/initial-costs';
import { sumPeriodicCharges } from '../../domain/model/periodic-charges';
import { defaultFinalInstallmentPercent } from '../../domain/model/plan-type';

/**
 * Servicio de cálculo financiero: "Compra Inteligente" estilo Interbank.
 * Método francés de amortización + cuota inicial + cuota final (cuotón) +
 * gracia mixta (total seguida de parcial) + seguros y cargos periódicos.
 */
@Injectable({ providedIn: 'root' })
export class FrenchAmortizationService {
  simulate(input: CreditSimulationInput): CreditSimulationResult {
    const paymentFreq = periodsPerYear(input.paymentFrequency);
    const monthsPerPmt = monthsPerPeriod(input.paymentFrequency);

    const downPaymentAmount = input.vehiclePrice * (input.downPaymentPercent / 100);
    const initialCostsTotal = sumInitialCosts(input.initialCosts);
    const loanAmount = input.vehiclePrice - downPaymentAmount + initialCostsTotal;

    const finalInstallmentPercent =
      input.finalInstallmentPercent ?? defaultFinalInstallmentPercent(input.termMonths);
    const finalInstallmentAmount = input.vehiclePrice * (finalInstallmentPercent / 100);

    const totalPeriods = Math.round(input.termMonths / monthsPerPmt); // N
    const graceTotalPeriods = Math.round(input.graceTotalMonths / monthsPerPmt); // T
    const gracePartialPeriods = Math.round(input.gracePartialMonths / monthsPerPmt); // P
    const servicePeriods = Math.max(totalPeriods - graceTotalPeriods - gracePartialPeriods, 0); // S

    const tea = this.computeTEA(input);
    const i = Math.pow(1 + tea, 1 / paymentFreq) - 1; // TEM: tasa efectiva del periodo de pago

    const desgravamenPeriodRate = (input.desgravamenInsurancePercent / 100) * monthsPerPmt;
    const riskInsurancePerPeriod =
      ((input.riskInsurancePercent / 100) * input.vehiclePrice) / paymentFreq;

    // Saldo neto a amortizar con cuotas regulares = Préstamo menos el valor presente del cuotón
    const netFinancedBalance =
      loanAmount -
      finalInstallmentAmount / Math.pow(1 + i + desgravamenPeriodRate, totalPeriods + 1);

    const schedule: Installment[] = [];
    let currentDate = input.startDate ?? new Date();

    // Cronograma paralelo del Cuotón: nace como VP y crece capitalizando hasta N+1
    let finalBalance =
      finalInstallmentAmount / Math.pow(1 + i + desgravamenPeriodRate, totalPeriods + 1);

    let balance = netFinancedBalance;
    let serviceCuota: number | null = null; // se fija una sola vez al iniciar la fase de servicio

    for (let k = 1; k <= totalPeriods + 1; k++) {
      currentDate = this.addMonths(currentDate, monthsPerPmt);
      const isPayoffRow = k === totalPeriods + 1;

      // -- cronograma del cuotón para este periodo --
      const finalInterest = finalBalance * i;
      const finalDesgrav = finalBalance * desgravamenPeriodRate;
      const finalInitial = finalBalance;
      let finalAmortization = 0;
      if (isPayoffRow) {
        finalAmortization = finalBalance + finalInterest + finalDesgrav; // = finalInstallmentAmount
        finalBalance = 0;
      } else {
        finalBalance = finalBalance + finalInterest + finalDesgrav; // capitaliza
      }

      // -- fila regular (T/P/N) --
      let periodType: InstallmentPeriodType = 'N';
      let interest = 0;
      let desgrav = 0;
      let amortization = 0;
      let installmentAmount = 0;
      const initialBalance = balance;

      if (!isPayoffRow) {
        if (k <= graceTotalPeriods) {
          periodType = 'T';
          interest = balance * i;
          desgrav = balance * desgravamenPeriodRate; // se cobra en efectivo, no se capitaliza
          amortization = 0;
          installmentAmount = 0;
          balance = balance + interest; // el interés sí se capitaliza
        } else if (k <= graceTotalPeriods + gracePartialPeriods) {
          periodType = 'P';
          interest = balance * i;
          desgrav = balance * desgravamenPeriodRate;
          amortization = 0;
          installmentAmount = interest + desgrav; // solo paga interés + seguro
        } else {
          periodType = 'N';
          if (serviceCuota === null) {
            serviceCuota = this.pmt(i + desgravamenPeriodRate, servicePeriods, balance);
          }
          interest = balance * i;
          desgrav = balance * desgravamenPeriodRate;
          amortization = serviceCuota - interest - desgrav;
          installmentAmount = serviceCuota;
          balance = Math.max(balance - amortization, 0);
        }
      }

      const riskInsurance = riskInsurancePerPeriod;
      const gps = input.periodicCharges.gps;
      const postage = input.periodicCharges.postage;
      const administrativeFee = input.periodicCharges.administrativeFee;

      const totalCashOutflow =
        installmentAmount + riskInsurance + gps + postage + administrativeFee + finalAmortization;

      schedule.push({
        number: k,
        dueDate: currentDate,
        periodType,
        isGracePeriod: periodType !== 'N',
        initialBalance,
        interest,
        amortization,
        desgravamenInsurance: desgrav,
        installmentAmount,
        finalBalance: balance,
        riskInsurance,
        gps,
        postage,
        administrativeFee,
        finalInstallmentInitialBalance: finalInitial,
        finalInstallmentInterest: finalInterest,
        finalInstallmentAmortization: finalAmortization,
        finalInstallmentFinalBalance: finalBalance,
        totalCashOutflow,
      });
    }

    // --- VAN y TIR (desde el punto de vista del deudor) ---
    const cashFlows = [loanAmount, ...schedule.map((row) => -row.totalCashOutflow)];

    const discountRateAnnual = input.discountRate / 100;
    const periodicDiscountRate = Math.pow(1 + discountRateAnnual, 1 / paymentFreq) - 1;

    const van = this.computeNPV(cashFlows, periodicDiscountRate);
    const periodicTIR = this.computeIRR(cashFlows);
    const tir = Math.pow(1 + periodicTIR, paymentFreq) - 1;

    return {
      downPaymentAmount,
      initialCostsTotal,
      loanAmount,
      finalInstallmentAmount,
      netFinancedBalance,
      periodicRate: i,
      tea,
      installmentAmount: serviceCuota ?? 0,
      totalPeriods,
      graceTotalPeriods,
      gracePartialPeriods,
      schedule,
      van,
      tir,
      discountRate: discountRateAnnual,
    };
  }

  /** Cuota constante de una anualidad: pv = cuota * (1-(1+rate)^-nper)/rate. */
  private pmt(rate: number, nper: number, pv: number): number {
    if (nper <= 0) return 0;
    if (Math.abs(rate) < 1e-12) return pv / nper;
    return (pv * rate) / (1 - Math.pow(1 + rate, -nper));
  }

  /** Convierte la tasa ingresada (TEA o TNA + capitalización) a TEA. */
  private computeTEA(input: CreditSimulationInput): number {
    if (input.rateType === RateType.Efectiva) {
      return input.annualRate / 100;
    }
    const capFreq = periodsPerYear(input.capitalization);
    const periodicCapRate = input.annualRate / 100 / capFreq;
    return Math.pow(1 + periodicCapRate, capFreq) - 1;
  }

  private computeNPV(cashFlows: number[], periodicRate: number): number {
    return cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + periodicRate, t), 0);
  }

  private computeIRR(cashFlows: number[], guess = 0.05): number {
    const maxIterations = 100;
    const tolerance = 1e-7;
    let rate = guess;

    for (let iter = 0; iter < maxIterations; iter++) {
      const npv = this.computeNPV(cashFlows, rate);
      const derivative = cashFlows.reduce(
        (acc, cf, t) => (t === 0 ? acc : acc - (t * cf) / Math.pow(1 + rate, t + 1)),
        0,
      );
      if (Math.abs(derivative) < 1e-12) break;

      const nextRate = rate - npv / derivative;
      if (Math.abs(nextRate - rate) < tolerance) return nextRate;
      rate = nextRate;
    }

    return this.computeIRRByBisection(cashFlows);
  }

  private computeIRRByBisection(cashFlows: number[]): number {
    let low = -0.99;
    let high = 10;
    for (let iter = 0; iter < 200; iter++) {
      const mid = (low + high) / 2;
      const npv = this.computeNPV(cashFlows, mid);
      if (Math.abs(npv) < 1e-6) return mid;
      if (npv > 0) low = mid;
      else high = mid;
    }
    return (low + high) / 2;
  }

  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
}

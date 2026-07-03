import {Injectable} from '@angular/core';
import {CreditSimulationInput, CreditSimulationResult, Installment} from '../../domain/model/installment';
import {RateType} from '../../domain/model/rate-type';
import {GraceType} from '../../domain/model/grace-type';
import {monthsPerPeriod, periodsPerYear} from '../../domain/model/payment-frequency';

/**
 * Servicio de cálculo financiero: método francés de amortización con soporte
 * para tasa nominal/efectiva, frecuencia de pago variable y periodo de gracia.
 */
@Injectable({providedIn: 'root'})
export class FrenchAmortizationService {

  simulate(input: CreditSimulationInput): CreditSimulationResult {
    const downPaymentAmount = input.vehiclePrice * (input.downPaymentPercent / 100);
    const financedAmount = input.vehiclePrice - downPaymentAmount;

    const paymentFreq = periodsPerYear(input.paymentFrequency);
    const monthsPerPmt = monthsPerPeriod(input.paymentFrequency);

    const totalPeriods = Math.round(input.termMonths / monthsPerPmt);
    const gracePeriods = input.graceType === GraceType.Sin
      ? 0
      : Math.round(input.graceMonths / monthsPerPmt);

    const tea = this.computeTEA(input);
    const i = Math.pow(1 + tea, 1 / paymentFreq) - 1; // tasa efectiva del periodo de pago

    const insurancePerPeriod = input.monthlyInsurance * monthsPerPmt;
    const schedule: Installment[] = [];
    let balance = financedAmount;
    let currentDate = input.startDate ?? new Date();

    // --- Periodo de gracia ---
    for (let k = 1; k <= gracePeriods; k++) {
      currentDate = this.addMonths(currentDate, monthsPerPmt);
      const interest = balance * i;

      if (input.graceType === GraceType.Total) {
        const finalBalance = balance + interest; // se capitaliza
        schedule.push({
          number: k, dueDate: currentDate, isGracePeriod: true,
          initialBalance: balance, interest, amortization: 0,
          insurance: 0, installmentAmount: 0, finalBalance
        });
        balance = finalBalance;
      } else { // Parcial: solo se paga el interés
        schedule.push({
          number: k, dueDate: currentDate, isGracePeriod: true,
          initialBalance: balance, interest, amortization: 0,
          insurance: insurancePerPeriod, installmentAmount: interest + insurancePerPeriod,
          finalBalance: balance
        });
      }
    }

    // --- Cronograma regular (método francés) ---
    const remainingPeriods = totalPeriods - gracePeriods;
    const cuota = balance * i / (1 - Math.pow(1 + i, -remainingPeriods));

    for (let k = 1; k <= remainingPeriods; k++) {
      currentDate = this.addMonths(currentDate, monthsPerPmt);
      const interest = balance * i;
      const amortization = cuota - interest;
      const finalBalance = Math.max(balance - amortization, 0);

      schedule.push({
        number: gracePeriods + k, dueDate: currentDate, isGracePeriod: false,
        initialBalance: balance, interest, amortization,
        insurance: insurancePerPeriod, installmentAmount: cuota + insurancePerPeriod,
        finalBalance
      });
      balance = finalBalance;
    }

    return {
      downPaymentAmount, financedAmount, periodicRate: i, tea,
      installmentAmount: cuota, totalPeriods, gracePeriods, schedule
    };
  }

  /** Convierte la tasa ingresada (TEA o TNA + capitalización) a TEA. */
  private computeTEA(input: CreditSimulationInput): number {
    if (input.rateType === RateType.Efectiva) {
      return input.annualRate / 100;
    }
    const capFreq = periodsPerYear(input.capitalization);
    const periodicCapRate = (input.annualRate / 100) / capFreq;
    return Math.pow(1 + periodicCapRate, capFreq) - 1;
  }

  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
}

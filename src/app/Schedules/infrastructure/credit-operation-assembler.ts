import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CreditOperation } from '../domain/model/credit-operation';
import {
  CreditOperationResource,
  CreditOperationsResponse,
  InstallmentResource,
} from './credit-operation-response';
import { Installment } from '../../Simulator/domain/model/installment';
import { Currency } from '../../Configuration/domain/model/currency';

export class CreditOperationAssembler implements BaseAssembler <
CreditOperation,
  CreditOperationResource,
CreditOperationsResponse
> {
  toEntitiesFromResponse(response: CreditOperationsResponse): CreditOperation[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: CreditOperationResource): CreditOperation {
    return {
      id: resource.id,
      clientId: resource.clientId,
      clientName: resource.clientName,
      carId: resource.carId,
      carLabel: resource.carLabel,
      currency: resource.currency as Currency,
      loanAmount: resource.loanAmount,
      finalInstallmentAmount: resource.finalInstallmentAmount,
      netFinancedBalance: resource.netFinancedBalance,
      tea: resource.tea,
      periodicRate: resource.periodicRate,
      installmentAmount: resource.installmentAmount,
      totalPeriods: resource.totalPeriods,
      graceTotalPeriods: resource.graceTotalPeriods,
      gracePartialPeriods: resource.gracePartialPeriods,
      initialCosts: { ...resource.initialCosts },
      periodicCharges: { ...resource.periodicCharges },
      desgravamenInsurancePercent: resource.desgravamenInsurancePercent,
      riskInsurancePercent: resource.riskInsurancePercent,
      schedule: resource.schedule.map((i) => this.toInstallmentFromResource(i)),
      van: resource.van,
      tir: resource.tir,
      discountRate: resource.discountRate,
      createdAt: resource.created ? new Date(resource.created) : new Date(),
    };
  }

  private toInstallmentFromResource(r: InstallmentResource): Installment {
    return {
      number: r.number,
      dueDate: new Date(r.dueDate),
      periodType: r.periodType,
      isGracePeriod: r.isGracePeriod,
      initialBalance: r.initialBalance,
      interest: r.interest,
      amortization: r.amortization,
      desgravamenInsurance: r.desgravamenInsurance,
      installmentAmount: r.installmentAmount,
      finalBalance: r.finalBalance,
      riskInsurance: r.riskInsurance,
      gps: r.gps,
      postage: r.postage,
      administrativeFee: r.administrativeFee,
      finalInstallmentInitialBalance: r.finalInstallmentInitialBalance,
      finalInstallmentInterest: r.finalInstallmentInterest,
      finalInstallmentAmortization: r.finalInstallmentAmortization,
      finalInstallmentDesgravamenInsurance: r.finalInstallmentDesgravamenInsurance,
      finalInstallmentFinalBalance: r.finalInstallmentFinalBalance,
      totalCashOutflow: r.totalCashOutflow,
    };
  }

toResourceFromEntity(entity: CreditOperation): CreditOperationResource {
  return {
    id: entity.id,
    clientId: entity.clientId,
    carId: entity.carId,
    clientName: entity.clientName,
    carLabel: entity.carLabel,
    currency: entity.currency,
    loanAmount: entity.loanAmount,
    finalInstallmentAmount: entity.finalInstallmentAmount,
    netFinancedBalance: entity.netFinancedBalance,
    tea: entity.tea,
    periodicRate: entity.periodicRate,
    installmentAmount: entity.installmentAmount,
    totalPeriods: entity.totalPeriods,
    graceTotalPeriods: entity.graceTotalPeriods,
    gracePartialPeriods: entity.gracePartialPeriods,
    initialCosts: { ...entity.initialCosts },
    periodicCharges: { ...entity.periodicCharges },
    desgravamenInsurancePercent: entity.desgravamenInsurancePercent,
    riskInsurancePercent: entity.riskInsurancePercent,
    schedule: entity.schedule.map((i) => ({
      id: 0,
      number: i.number,
      dueDate: i.dueDate.toISOString(),
      periodType: i.periodType,
      isGracePeriod: i.isGracePeriod,
      initialBalance: i.initialBalance,
      interest: i.interest,
      amortization: i.amortization,
      desgravamenInsurance: i.desgravamenInsurance,
      installmentAmount: i.installmentAmount,
      finalBalance: i.finalBalance,
      riskInsurance: i.riskInsurance,
      gps: i.gps,
      postage: i.postage,
      administrativeFee: i.administrativeFee,
      finalInstallmentInitialBalance: i.finalInstallmentInitialBalance,
      finalInstallmentInterest: i.finalInstallmentInterest,
      finalInstallmentAmortization: i.finalInstallmentAmortization,
      finalInstallmentDesgravamenInsurance: i.finalInstallmentDesgravamenInsurance,
      finalInstallmentFinalBalance: i.finalInstallmentFinalBalance,
      totalCashOutflow: i.totalCashOutflow,
    })),
    van: entity.van,
    tir: entity.tir,
    discountRate: entity.discountRate,
    created: null,
    updated: null,
  } as CreditOperationResource;
}
}

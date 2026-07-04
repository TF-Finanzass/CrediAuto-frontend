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
      financedAmount: resource.financedAmount,
      tea: resource.tea,
      periodicRate: resource.periodicRate,
      installmentAmount: resource.installmentAmount,
      totalPeriods: resource.totalPeriods,
      gracePeriods: resource.gracePeriods,
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
    isGracePeriod: r.isGracePeriod,
    initialBalance: r.initialBalance,
    interest: r.interest,
    amortization: r.amortization,
    insurance: r.insurance,
    installmentAmount: r.installmentAmount,
    finalBalance: r.finalBalance,
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
    financedAmount: entity.financedAmount,
    tea: entity.tea,
    periodicRate: entity.periodicRate,
    installmentAmount: entity.installmentAmount,
    totalPeriods: entity.totalPeriods,
    gracePeriods: entity.gracePeriods,
    schedule: entity.schedule.map((i) => ({
      id: 0,
      number: i.number,
      dueDate: i.dueDate.toISOString(),
      isGracePeriod: i.isGracePeriod,
      initialBalance: i.initialBalance,
      interest: i.interest,
      amortization: i.amortization,
      insurance: i.insurance,
      installmentAmount: i.installmentAmount,
      finalBalance: i.finalBalance,
    })),
    van: entity.van,
    tir: entity.tir,
    discountRate: entity.discountRate,
    created: null,
    updated: null,
  } as CreditOperationResource;
}
}

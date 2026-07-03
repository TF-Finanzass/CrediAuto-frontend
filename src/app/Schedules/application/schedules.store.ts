import {Injectable, computed, signal} from '@angular/core';
import {CreditOperation} from '../domain/model/credit-operation';

/**
 * Store en memoria para las operaciones de crédito guardadas desde el Simulador.
 * Mock por ahora; cuando exista el backend, se reemplaza por llamadas HTTP igual que en Cars/Clients.
 */
@Injectable({providedIn: 'root'})
export class SchedulesStore {
  private readonly operationsSignal = signal<CreditOperation[]>([]);
  readonly operations = this.operationsSignal.asReadonly();

  readonly operationCount = computed(() => this.operations().length);

  private nextId = 1;

  /** Agrega una nueva operación calculada (llamado desde el Simulador al presionar Guardar). */
  addOperation(operation: Omit<CreditOperation, 'id' | 'createdAt'>): CreditOperation {
    const nueva: CreditOperation = {
      ...operation,
      id: this.nextId++,
      createdAt: new Date()
    };
    this.operationsSignal.update(ops => [...ops, nueva]);
    return nueva;
  }

  getById(id: number) {
    return computed(() => this.operations().find(o => o.id === id));
  }

  getByClientId(clientId: number) {
    return computed(() => this.operations().filter(o => o.clientId === clientId));
  }
}

import { computed, Injectable, signal } from '@angular/core';
import { CreditOperation } from '../domain/model/credit-operation';
import { HttpClient } from '@angular/common/http';
import { SchedulesApiEndpoint } from '../infrastructure/schedules-api-endpoint';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchedulesStore {
  private readonly schedulesEndpoint: SchedulesApiEndpoint;

  private readonly operationsSignal = signal<CreditOperation[]>([]);
  readonly operations = this.operationsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly operationCount = computed(() => this.operations().length);

  constructor(http: HttpClient) {
    this.schedulesEndpoint = new SchedulesApiEndpoint(http);
    this.loadOperations();
  }

  addOperation(
    operation: Omit<CreditOperation, 'id' | 'createdAt'>,
    onSuccess?: (created: CreditOperation) => void,
    onError?: (message: string) => void,
  ): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const payload = { ...operation, id: 0, createdAt: new Date() } as CreditOperation;

    this.schedulesEndpoint
      .create(payload)
      .pipe(retry(2))
      .subscribe({
        next: (createdOperation) => {
          this.operationsSignal.update((ops) => [...ops, createdOperation]);
          this.loadingSignal.set(false);
          onSuccess?.(createdOperation);
        },
        error: (err) => {
          const message = this.formatError(err, 'Failed to save operation');
          this.errorSignal.set(message);
          this.loadingSignal.set(false);
          onError?.(message);
        },
      });
  }

  deleteOperation(operation: CreditOperation): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.schedulesEndpoint.delete(operation.id).pipe(retry(2)).subscribe({
      next: () => {
        this.operationsSignal.update(ops => ops.filter(o => o.id !== operation.id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete operation'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadOperations(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.schedulesEndpoint
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (operations) => {
          this.operationsSignal.set(operations);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load operations'));
          this.loadingSignal.set(false);
        },
      });
  }

  getById(id: number) {
    return computed(() => this.operations().find((o) => o.id === id));
  }

  getByClientId(clientId: number) {
    return computed(() => this.operations().filter((o) => o.clientId === clientId));
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}

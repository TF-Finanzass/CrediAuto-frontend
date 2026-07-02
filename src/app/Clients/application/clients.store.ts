import {computed, Injectable, signal} from '@angular/core';
import {Client} from '../domain/model/client.entity';
import {HttpClient} from '@angular/common/http';
import {ClientsApiEndpoint} from '../infrastructure/clients-api-endpoint';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ClientsStore {
  private readonly clientsEndpoint: ClientsApiEndpoint;

  private readonly clientsSignal = signal<Client[]>([]);
  readonly clients = this.clientsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly clientCount = computed(() => this.clients().length);

  constructor(http: HttpClient) {
    this.clientsEndpoint = new ClientsApiEndpoint(http);
    this.loadClients();
  }

  addClient(client: Client): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.clientsEndpoint.create(client).pipe(retry(2)).subscribe({
      next: createdClient => {
        this.clientsSignal.update(clients => [...clients, createdClient]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create client'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadClients(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.clientsEndpoint.getAll().pipe(takeUntilDestroyed()).subscribe({
      next: clients => {
        this.clientsSignal.set(clients);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load clients'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}

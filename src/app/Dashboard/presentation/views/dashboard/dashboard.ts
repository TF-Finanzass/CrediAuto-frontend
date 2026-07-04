import { Component, computed, inject } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarsStore } from '../../../../Cars/application/cars.store';
import { ClientsStore } from '../../../../Clients/application/clients.store';
import { SchedulesStore } from '../../../../Schedules/application/schedules.store';
import { CarStatus } from '../../../../Cars/domain/model/car.entity';
import { ClientStatus } from '../../../../Clients/domain/model/client.entity';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  carsStore = inject(CarsStore);
  clientsStore = inject(ClientsStore);
  schedulesStore = inject(SchedulesStore);

  // --- Vehículos ---
  totalCars = computed(() => this.carsStore.cars().length);
  availableCars = computed(
    () => this.carsStore.cars().filter((c) => c.status === CarStatus.Disponible).length,
  );
  reservedCars = computed(
    () => this.carsStore.cars().filter((c) => c.status === CarStatus.Reservado).length,
  );
  soldOutCars = computed(
    () => this.carsStore.cars().filter((c) => c.status === CarStatus.Agotado).length,
  );

  // --- Clientes por estado ---
  totalClients = computed(() => this.clientsStore.clients().length);
  clientsByStatus = computed(() => {
    const clients = this.clientsStore.clients();
    const total = clients.length || 1;
    return Object.values(ClientStatus).map((status) => {
      const count = clients.filter((c) => c.status === status).length;
      return { status, count, percent: Math.round((count / total) * 100) };
    });
  });

  // --- Operaciones / cronogramas ---
  totalOperations = computed(() => this.schedulesStore.operations().length);

  /** Suma del monto de préstamo (Precio - Cuota inicial + costos iniciales) de todas las operaciones. */
  totalFinanced = computed(() =>
    this.schedulesStore.operations().reduce((sum, op) => sum + op.loanAmount, 0),
  );

  avgTea = computed(() => {
    const ops = this.schedulesStore.operations();
    if (!ops.length) return 0;
    return ops.reduce((sum, op) => sum + op.tea, 0) / ops.length;
  });

  recentOperations = computed(() =>
    [...this.schedulesStore.operations()]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 4),
  );
}

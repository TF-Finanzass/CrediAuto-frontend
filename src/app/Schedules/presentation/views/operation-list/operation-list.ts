import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {DecimalPipe, DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {SchedulesStore} from '../../../application/schedules.store';
import {ClientsStore} from '../../../../Clients/application/clients.store';

@Component({
  selector: 'app-operation-list',
  imports: [
    DecimalPipe, DatePipe, MatButtonModule, MatSelectModule, MatFormFieldModule,
    MatTable, MatHeaderCellDef, MatCellDef, MatColumnDef, MatHeaderCell,
    MatCell, MatHeaderRowDef, MatRowDef, MatHeaderRow, MatRow
  ],
  templateUrl: './operation-list.html',
  styleUrl: './operation-list.css'
})
export class OperationList {
  readonly store = inject(SchedulesStore);
  readonly clientsStore = inject(ClientsStore);
  private router = inject(Router);

  displayedColumns = ['client', 'car', 'financedAmount', 'installmentAmount', 'totalPeriods', 'createdAt', 'actions'];

  clienteFiltro = signal<number | null>(null);

  operacionesFiltradas = computed(() => {
    const id = this.clienteFiltro();
    return id ? this.store.getByClientId(id)() : this.store.operations();
  });

  verCronograma(id: number): void {
    this.router.navigate(['/cronogramas', id]).then();
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { SchedulesStore } from '../../../application/schedules.store';
import { ClientsStore } from '../../../../Clients/application/clients.store';
import { CreditOperation } from '../../../domain/model/credit-operation';
import { Currency, currencySymbol } from '../../../../Configuration/domain/model/currency';
import { ConfirmDialog } from '../../../../shared/presentation/component/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-operation-list',
  imports: [
    DecimalPipe,
    DatePipe,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    TranslatePipe,
  ],
  templateUrl: './operation-list.html',
  styleUrl: './operation-list.css',
})
export class OperationList {
  readonly store = inject(SchedulesStore);
  readonly clientsStore = inject(ClientsStore);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  displayedColumns = [
    'client',
    'car',
    'loanAmount',
    'installmentAmount',
    'finalInstallmentAmount',
    'totalPeriods',
    'createdAt',
    'actions',
  ];

  clienteFiltro = signal<number | null>(null);

  operacionesFiltradas = computed(() => {
    const id = this.clienteFiltro();
    return id ? this.store.getByClientId(id)() : this.store.operations();
  });

  protected symbolFor(currency: Currency): string {
    return currencySymbol[currency];
  }

  verCronograma(id: number): void {
    this.router.navigate(['/schedules', id]).then();
  }

  confirmDelete(operation: CreditOperation): void {
    const message = this.translate.instant('schedules.list.delete-confirm', {
      clientName: operation.clientName,
      carLabel: operation.carLabel,
    });
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'schedules.list.delete-title',
        message,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.store.deleteOperation(operation);
    });
  }
}

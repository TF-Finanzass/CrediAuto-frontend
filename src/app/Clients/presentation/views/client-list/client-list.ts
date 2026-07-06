import { AfterViewChecked, Component, computed, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsStore } from '../../../application/clients.store';
import { Client } from '../../../domain/model/client.entity';
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
  MatTableDataSource,
} from '@angular/material/table';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/presentation/component/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-client-list',
  imports: [
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
    MatIconButton,
    MatHeaderRow,
    MatRow,
    MatProgressSpinner,
    TranslatePipe,
    MatSort,
    MatSortHeader,
    MatPaginator,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList implements AfterViewChecked {
  readonly store = inject(ClientsStore);
  protected router = inject(Router);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  displayedColumns: string[] = [
    'fullName',
    'lastName',
    'documentNumber',
    'email',
    'phone',
    'status',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = computed(() => {
    const source = new MatTableDataSource(this.store.clients());
    source.sort = this.sort;
    source.paginator = this.paginator;
    return source;
  });

  navigateToNew() {
    this.router.navigate(['clients/new']).then();
  }

  editClient(id: number) {
    this.router.navigate(['clients', id, 'edit']).then();
  }

  confirmDelete(client: Client) {
    const message = this.translate.instant('client.delete-confirm', {
      fullName: client.fullName,
      lastName: client.lastName,
    });
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'client.delete-title',
        message,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.store.deleteClient(client);
    });
  }

  ngAfterViewChecked() {
    if (this.dataSource().paginator !== this.paginator) {
      this.dataSource().paginator = this.paginator;
    }
    if (this.dataSource().sort !== this.sort) {
      this.dataSource().sort = this.sort;
    }
  }
}

import {AfterViewChecked, Component, computed, inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';
import {ClientsStore} from '../../../application/clients.store';
import {MatError} from '@angular/material/form-field';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TranslatePipe} from '@ngx-translate/core';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-client-list',
  imports: [
    MatError, MatTable, MatHeaderCellDef, MatCellDef, MatColumnDef,
    MatHeaderCell, MatCell, MatHeaderRowDef, MatRowDef, MatButton,
    MatHeaderRow, MatRow, MatProgressSpinner, TranslatePipe, MatSort,
    MatSortHeader, MatPaginator, DecimalPipe, MatIconModule
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements AfterViewChecked {
  readonly store = inject(ClientsStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['fullName', 'lastName', 'documentNumber', 'email', 'phone', 'monthlyIncome', 'status'];

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

  ngAfterViewChecked() {
    if (this.dataSource().paginator !== this.paginator) {
      this.dataSource().paginator = this.paginator;
    }
    if (this.dataSource().sort !== this.sort) {
      this.dataSource().sort = this.sort;
    }
  }
}

import { AfterViewChecked, Component, computed, inject, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CarsStore } from '../../../application/cars.store';
import { Currency, currencySymbol } from '../../../../Configuration/domain/model/currency';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-car-list',
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
    MatHeaderRow,
    MatRow,
    MatProgressSpinner,
    TranslatePipe,
    MatSort,
    MatSortHeader,
    MatPaginator,
    DecimalPipe,
    MatIconModule,
  ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css',
})

export class CarList implements AfterViewChecked {
  readonly store = inject(CarsStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['brand', 'model', 'year', 'price', 'status'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = computed(() => {
    const source = new MatTableDataSource(this.store.cars());
    source.sort = this.sort;
    source.paginator = this.paginator;
    return source;
  });

  navigateToNew() {
    this.router.navigate(['cars/new']).then();
  }

  /** Devuelve el símbolo de moneda (S/, $) para el auto, evitando problemas de tipado en el template. */
  protected symbolFor(currency: Currency): string {
    return currencySymbol[currency];
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

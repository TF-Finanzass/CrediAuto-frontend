import { AfterViewChecked, Component, computed, inject, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CarsStore } from '../../../application/cars.store';
import { Car } from '../../../domain/model/car.entity';
import { Currency, currencySymbol } from '../../../../Configuration/domain/model/currency';
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
    MatIconButton,
    MatHeaderRow,
    MatRow,
    MatProgressSpinner,
    TranslatePipe,
    MatSort,
    MatSortHeader,
    MatPaginator,
    DecimalPipe,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css',
})
export class CarList implements AfterViewChecked {
  readonly store = inject(CarsStore);
  protected router = inject(Router);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  displayedColumns: string[] = ['brand', 'model', 'year', 'price', 'status', 'actions'];

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

  editCar(id: number) {
    this.router.navigate(['cars', id, 'edit']).then();
  }

  confirmDelete(car: Car) {
    const message = this.translate.instant('car.delete-confirm', {
      brand: car.brand,
      model: car.model,
    });
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'car.delete-title',
        message,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.store.deleteCar(car);
    });
  }

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

import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SchedulesStore } from '../../../application/schedules.store';
import { Currency, currencySymbol } from '../../../../Configuration/domain/model/currency';

@Component({
  selector: 'app-operation-detail',
  imports: [DecimalPipe, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './operation-detail.html',
  styleUrl: './operation-detail.css',
})
export class OperationDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(SchedulesStore);

  operationId = Number(this.route.snapshot.paramMap.get('id'));
  operation = this.store.getById(this.operationId);

  /** Devuelve el símbolo de moneda (S/, $) para la operación, evitando problemas de tipado en el template. */
  protected symbolFor(currency: Currency): string {
    return currencySymbol[currency];
  }

  volver(): void {
    this.router.navigate(['/schedules']).then();
  }
}

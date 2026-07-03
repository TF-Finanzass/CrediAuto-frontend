import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DecimalPipe, DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SchedulesStore} from '../../../application/schedules.store';

@Component({
  selector: 'app-operation-detail',
  imports: [DecimalPipe, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './operation-detail.html',
  styleUrl: './operation-detail.css'
})
export class OperationDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(SchedulesStore);

  operationId = Number(this.route.snapshot.paramMap.get('id'));
  operation = this.store.getById(this.operationId);

  volver(): void {
    this.router.navigate(['/cronogramas']).then();
  }
}

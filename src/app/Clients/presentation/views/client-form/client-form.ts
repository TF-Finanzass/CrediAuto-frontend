import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsStore } from '../../../application/clients.store';
import { Client, ClientStatus } from '../../../domain/model/client.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-client-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
})
export class ClientForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(ClientsStore);

  statuses = Object.values(ClientStatus);

  clientId: number | null = null;
  isEditMode = false;

  private existingUserId: number | null = null;

  form = this.fb.group({
    fullName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    documentNumber: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    monthlyIncome: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    status: new FormControl<ClientStatus>(ClientStatus.Pendiente, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clientId = Number(idParam);
      this.isEditMode = true;
      this.store.getClientById(this.clientId).subscribe((client) => {
        this.existingUserId = client.userId;
        this.form.patchValue({
          fullName: client.fullName,
          lastName: client.lastName,
          documentNumber: client.documentNumber,
          email: client.email,
          phone: client.phone,
          monthlyIncome: client.monthlyIncome,
          status: client.status,
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const client: Client = new Client({
      id: this.clientId ?? 0,
      fullName: raw.fullName,
      lastName: raw.lastName,
      documentNumber: raw.documentNumber,
      email: raw.email,
      phone: raw.phone,
      monthlyIncome: raw.monthlyIncome,
      userId: this.existingUserId ?? this.generateUserId(),
      status: raw.status,
    });

    if (this.isEditMode && this.clientId !== null) {
      this.store.updateClient(this.clientId, client);
    } else {
      this.store.addClient(client);
    }
    this.router.navigate(['clients']).then();
  }

  goBack() {
    this.router.navigate(['clients']).then();
  }

  private generateUserId(): number {
    return Math.floor(Date.now() / 1000);
  }
}

import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ClientsStore} from '../../../application/clients.store';
import {Client, ClientStatus} from '../../../domain/model/client.entity';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css'
})
export class ClientForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(ClientsStore);

  statuses = Object.values(ClientStatus);

  form = this.fb.group({
    fullName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    lastName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    documentNumber: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    phone: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    monthlyIncome: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    status: new FormControl<ClientStatus>(ClientStatus.Pendiente, {nonNullable: true, validators: [Validators.required]})
  });

  submit() {
    if (this.form.invalid) return;

    const client: Client = new Client({
      id: 0,
      fullName: this.form.value.fullName!,
      lastName: this.form.value.lastName!,
      documentNumber: this.form.value.documentNumber!,
      email: this.form.value.email!,
      phone: this.form.value.phone!,
      monthlyIncome: this.form.value.monthlyIncome!,
      status: this.form.value.status!
    });

    this.store.addClient(client);
    this.router.navigate(['clients']).then();
  }

  goBack() {
    this.router.navigate(['clients']).then();
  }
}

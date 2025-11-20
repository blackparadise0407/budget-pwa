import { Component } from '@angular/core';
import { AddTransactionComponent } from 'app/transactions/add-transaction/add-transaction.component';

@Component({
  selector: 'app-home',
  imports: [AddTransactionComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}

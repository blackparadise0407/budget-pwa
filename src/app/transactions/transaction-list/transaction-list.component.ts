import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Transaction } from '@/shared/interfaces';

@Component({
  selector: 'app-transaction-list',
  imports: [DatePipe, CurrencyPipe, NgClass],
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent {
  @Input({ required: true }) transactions: Transaction[];
}

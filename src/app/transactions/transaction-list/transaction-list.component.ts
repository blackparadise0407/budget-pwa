import { Component, Input } from '@angular/core';

import { Transaction } from '@/shared/interfaces';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';

@Component({
  selector: 'app-transaction-list',
  imports: [TransactionItemComponent],
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent {
  @Input({ required: true }) transactions: Transaction[];
}

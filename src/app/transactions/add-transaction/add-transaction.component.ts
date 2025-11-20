import { Component, EventEmitter, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TransactionType } from 'app/interfaces';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-add-transaction',
  imports: [ReactiveFormsModule],
  templateUrl: './add-transaction.component.html',
  providers: [TransactionService],
})
export class AddTransactionComponent {
  private readonly transactionService = inject(TransactionService);

  public close = new EventEmitter<void>();
  public TransactionType = TransactionType;

  public formGroup = new FormGroup({
    type: new FormControl<TransactionType>(TransactionType.expense),
    category: new FormControl(''),
    description: new FormControl(''),
    amount: new FormControl(0, Validators.min(0)),
  });

  public changeType(type: TransactionType): void {
    if (type !== this.formGroup.controls.type.value) {
      this.formGroup.controls.type.setValue(type);
    }
  }

  public createTransaction(): void {
    this.transactionService.create({
      amount: 1001,
      category: 'test',
      description: '',
      type: TransactionType.expense,
    });
  }

  public closeDialog(): void {
    this.close.emit();
  }
}

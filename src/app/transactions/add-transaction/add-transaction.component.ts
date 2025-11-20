import { Component, EventEmitter, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CategoriesService } from '@/categories/services/categories.service';
import { FormErrorComponent } from '@/shared/components';
import { FormatNumberDirective } from '@/shared/directives';
import { CreateTransaction, TransactionType } from '@/shared/interfaces';
import { AsyncPipe } from '@angular/common';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-add-transaction',
  imports: [
    ReactiveFormsModule,
    FormErrorComponent,
    AsyncPipe,
    FormatNumberDirective,
  ],
  templateUrl: './add-transaction.component.html',
  providers: [TransactionService],
})
export class AddTransactionComponent {
  private readonly transactionService = inject(TransactionService);
  private readonly categoriesService = inject(CategoriesService);

  public close = new EventEmitter<void>();
  public TransactionType = TransactionType;
  public categories$ = this.categoriesService.getCategories();

  public formGroup = new FormGroup({
    type: new FormControl<TransactionType>(TransactionType.expense),
    categoryId: new FormControl<string | null>(null, [Validators.required]),
    amount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    description: new FormControl(''),
  });

  public changeType(type: TransactionType): void {
    if (type !== this.formGroup.controls.type.value) {
      this.formGroup.controls.type.setValue(type);
    }
  }

  public createTransaction(): void {
    if (!this.formGroup.valid) {
      throw new Error('Invalid form');
    }
    this.transactionService.create(this.formGroup.value as CreateTransaction);
  }

  public closeDialog(): void {
    this.close.emit();
  }
}

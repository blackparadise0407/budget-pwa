import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
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

@Component({
  selector: 'app-add-transaction',
  imports: [
    ReactiveFormsModule,
    FormErrorComponent,
    AsyncPipe,
    FormatNumberDirective,
  ],
  templateUrl: './add-transaction.component.html',
})
export class AddTransactionComponent {
  private readonly categoriesService = inject(CategoriesService);

  @Output()
  public create = new EventEmitter<CreateTransaction>();
  public close = new EventEmitter<void>();
  public TransactionType = TransactionType;
  public categories$ = this.categoriesService.getAll();

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

  public async createTransaction(): Promise<void> {
    if (!this.formGroup.valid) {
      throw new Error('Invalid form');
    }
    this.create.emit(this.formGroup.value as CreateTransaction);
  }

  public closeDialog(): void {
    this.close.emit();
  }
}

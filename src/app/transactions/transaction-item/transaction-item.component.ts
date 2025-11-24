import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoriesService } from '@/categories/services/categories.service';
import { Category, Transaction, TransactionType } from '@/shared/interfaces';

@Component({
  selector: 'app-transaction-item',
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
  templateUrl: './transaction-item.component.html',
})
export class TransactionItemComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  @Input({ required: true }) transaction: Transaction;
  public readonly TransactionType = TransactionType;
  public category$: Observable<Category>;

  public ngOnInit(): void {
    this.category$ = this.categoriesService.getById(
      this.transaction.categoryId,
    );
  }
}

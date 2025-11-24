import { Component, inject, OnInit } from '@angular/core';

import { TransactionService } from '@/transactions/services/transaction.service';
import { TransactionListComponent } from '@/transactions/transaction-list/transaction-list.component';

@Component({
  selector: 'app-home',
  imports: [TransactionListComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly transactionService = inject(TransactionService);

  public transactions = this.transactionService.getAll();
  public canLoadMore = this.transactionService.getCanLoadMore();
  public isLoading = this.transactionService.getIsLoading();

  public ngOnInit(): void {
    if (!this.transactions()) {
      this.transactionService.load();
    }
  }

  public loadMore(): void {
    this.transactionService.load();
  }
}

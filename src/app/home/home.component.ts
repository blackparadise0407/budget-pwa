import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { from, mergeMap, take } from 'rxjs';

import { DialogService } from '@/shared/services';
import { TransactionService } from '@/transactions/services/transaction.service';
import { TransactionListComponent } from '@/transactions/transaction-list/transaction-list.component';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, CurrencyPipe, TransactionListComponent],
  templateUrl: './home.component.html',
  host: {
    class: 'space-y-5',
  },
})
export class HomeComponent implements OnInit {
  private readonly transactionService = inject(TransactionService);
  private readonly dialogService = inject(DialogService);

  public transactions = this.transactionService.getAll();
  public canLoadMore = this.transactionService.getCanLoadMore();
  public isLoading = this.transactionService.getIsLoading();
  public stats$ = this.transactionService.getStats();

  public ngOnInit(): void {
    if (!this.transactions()) {
      this.transactionService.load();
    }
  }

  public loadMore(): void {
    this.transactionService.load();
  }

  public deleteById(uid: string): void {
    const ref = this.dialogService.confirm({
      title: 'Permanently delete this transaction?',
      description:
        'This item will be removed permanently. You cannot recover it after deletion.',
      danger: true,
      confirmText: 'Delete',
    });
    ref.componentInstance?.confirm
      .pipe(
        take(1),
        mergeMap(() => from(this.transactionService.deleteById(uid))),
      )
      .subscribe(() => {
        ref.close();
      });
  }
}

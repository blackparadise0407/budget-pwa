import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { from, mergeMap, take } from 'rxjs';

import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-add-transaction-button',
  imports: [],
  templateUrl: './add-transaction-button.component.html',
  providers: [TransactionService],
})
export class AddTransactionButtonComponent {
  private readonly dialog = inject(Dialog);
  private readonly transactionService = inject(TransactionService);

  public handleClick(): void {
    const ref = this.dialog.open(AddTransactionComponent);
    ref.componentInstance?.close.pipe(take(1)).subscribe(() => {
      ref.close();
    });

    ref.componentInstance?.create
      .pipe(
        mergeMap((payload) => from(this.transactionService.create(payload))),
      )
      .subscribe(() => {
        ref.close();
      });
  }
}

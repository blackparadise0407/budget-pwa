import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { take } from 'rxjs';

import { AddTransactionComponent } from '../add-transaction/add-transaction.component';

@Component({
  selector: 'app-add-transaction-button',
  imports: [],
  templateUrl: './add-transaction-button.component.html',
})
export class AddTransactionButtonComponent {
  private readonly dialog = inject(Dialog);

  public handleClick(): void {
    const ref = this.dialog.open(AddTransactionComponent);
    ref.componentInstance?.close.pipe(take(1)).subscribe(() => {
      ref.close();
    });
  }
}

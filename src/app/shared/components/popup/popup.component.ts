import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { inject } from '@angular/core';

export class PopupComponent<TData = unknown> {
  protected readonly dialogRef = inject(DialogRef);
  public readonly data = inject<TData>(DIALOG_DATA);

  public close(): void {
    this.dialogRef.close();
  }
}

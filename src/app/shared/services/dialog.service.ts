import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { ConfirmPopupComponent } from '../components';
import { ConfirmPopupPayload } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialog = inject(Dialog);

  public confirm({
    title,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    danger,
    description,
  }: ConfirmPopupPayload): DialogRef<unknown, ConfirmPopupComponent> {
    return this.dialog.open(ConfirmPopupComponent, {
      data: {
        title,
        cancelText,
        confirmText,
        danger,
        description,
      },
    });
  }
}

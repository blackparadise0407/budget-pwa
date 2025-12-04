import { Component, EventEmitter } from '@angular/core';

import { ConfirmPopupPayload } from '@/shared/interfaces';
import { PopupComponent } from '../popup.component';

@Component({
  selector: 'app-confirm-popup',
  imports: [],
  templateUrl: './confirm-popup.component.html',
})
export class ConfirmPopupComponent extends PopupComponent<ConfirmPopupPayload> {
  public confirm = new EventEmitter<void>();

  public handleConfirm() {
    this.confirm.emit();
  }
}

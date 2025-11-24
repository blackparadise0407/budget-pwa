import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormErrorComponent } from '@/shared/components';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './add-category.component.html',
})
export class AddCategoryComponent {
  @Output()
  public create = new EventEmitter<any>();
  public close = new EventEmitter<void>();

  public readonly formGroup = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
  });

  public submit() {
    if (!this.formGroup.valid) {
      throw new Error('Invalid form');
    }

    this.create.emit(this.formGroup.value);
  }

  public cancel() {
    this.close.emit();
  }
}

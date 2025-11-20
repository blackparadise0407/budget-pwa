import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-form-error',
  imports: [AsyncPipe],
  templateUrl: './form-error.component.html',
})
export class FormErrorComponent implements OnInit, OnChanges {
  @Input() control: AbstractControl | null;

  public message$?: Observable<string>;

  public ngOnInit(): void {
    if (this.control) {
      this.message$ = this.control.statusChanges.pipe(
        map(() => this.getErrorMessage(this.control?.errors)),
      );
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']) {
      this.getErrorMessage(this.control?.errors);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getErrorMessage(errors: any): string {
    if (!errors) {
      return '';
    }
    switch (true) {
      case errors['required']:
        return 'Field is required';
      case !!errors['min']:
        return `Minimum value is ${errors['min'].min} but receive ${errors['min'].actual}`;
      default:
        return '';
    }
  }
}

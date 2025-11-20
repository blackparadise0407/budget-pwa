import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormatNumber]',
  providers: [DecimalPipe],
})
export class FormatNumberDirective {
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private decimal = inject(DecimalPipe);
  private ngControl = inject(NgControl, { optional: true, self: true });

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;

    const raw = input.value.replace(/,/g, '');
    const num = Number(raw);

    // update raw value in FormControl
    this.ngControl?.control?.setValue(num, { emitEvent: false });

    // UI formatting only
    input.value = raw ? this.decimal.transform(num, '1.0-0')! : '';
  }

  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    const raw = input.value.replace(/,/g, '');
    input.value = raw ? this.decimal.transform(Number(raw), '1.0-0')! : '';
  }
}

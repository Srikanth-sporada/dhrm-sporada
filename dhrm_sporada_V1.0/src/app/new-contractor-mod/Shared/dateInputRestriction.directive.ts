import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateInputRestriction]'
})
export class DateInputRestrictionDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Adjust the regex as needed

    if (!regex.test(value)) {
      input.value = '';
    }
  }
}

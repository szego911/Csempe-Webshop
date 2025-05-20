import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appIsAvailable]',
})
export class IsAvailableDirective implements OnChanges {
  @Input('appIsAvailable') available!: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.available === false) {
      this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'color');
    }
  }
}

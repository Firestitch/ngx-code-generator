import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[dueDateExpired]'
})
export class DueDateExpiredDirective implements OnChanges {
  @Input() date: string;

  private _now = new Date();
  private _date: Date;

  constructor(private _element: ElementRef,){
  }

  public ngOnChanges() {
    this._date = new Date(this.date);
    if (this._date < this._now) {
      this._element.nativeElement.style.color = 'red';
    }
  }
}

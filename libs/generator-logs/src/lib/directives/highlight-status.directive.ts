import { Directive, OnChanges, ElementRef, Input } from '@angular/core';

const CREATE = 'CREATE';
const UPDATE = 'UPDATE';

@Directive({
  selector: '[highlightStatus]'
})

export class HighlightStatusDirective implements OnChanges {
  @Input() text: string;
  constructor(private el: ElementRef) {

  }

  public ngOnChanges() {
    if (this.text.indexOf(CREATE) !== -1 || this.text.indexOf(UPDATE) !== -1) {
      const element = document.createElement('span');
      element.innerText = this.text.slice(0, 6);
      this.el.nativeElement.appendChild(element);

      const style = this.text.indexOf(CREATE) !== -1 ? 'success' : 'warning';
      element.classList.add(style);

      const commonText = document.createElement('span');
      commonText.innerText = this.text.slice(6);
      this.el.nativeElement.appendChild(commonText);
    } else {
      const commonText = document.createElement('span');
      commonText.innerText = this.text;
      this.el.nativeElement.appendChild(commonText);
    }
  }
}

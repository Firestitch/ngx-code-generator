import { Directive, OnChanges, ElementRef, Input } from '@angular/core';

const CREATE = 'CREATE';
const UPDATE = 'UPDATE';

@Directive({
  selector: '[highlightStatus]',
})
export class HighlightStatusDirective implements OnChanges {

  @Input() text: string;
  
  constructor(private el: ElementRef) {}

  public ngOnChanges() {

    const text =  this.text.replace(/\\u[\dA-Fa-f]{4}/g, match => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });

    if (text.indexOf(CREATE) !== -1 || text.indexOf(UPDATE) !== -1) {
      const parts = text.split(' ');

      const element = document.createElement('span');
      element.innerHTML = text.indexOf(CREATE) !== -1 ? 'CREATE' : 'UPDATE';
      this.el.nativeElement.appendChild(element);

      const style = text.indexOf(CREATE) !== -1 ? 'success' : 'warning';
      element.classList.add(style);

      const commonText = document.createElement('span');
      commonText.innerHTML = parts[1];
      this.el.nativeElement.appendChild(` ${commonText}`);
    } else {
      const commonText = document.createElement('span');
      commonText.innerHTML = text;
      this.el.nativeElement.appendChild(commonText);
    }
  }
}

import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-basic-pattern',
  templateUrl: './basic-pattern.component.html',
})
export class BasicPatternComponent {
  @Input()
  public params;
}

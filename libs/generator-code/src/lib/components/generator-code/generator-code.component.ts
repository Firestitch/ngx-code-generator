import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-generator-code',
  templateUrl: './generator-code.component.html',
  styleUrls: [
    './generator-code.component.scss'
  ]
})
export class GeneratorCodeComponent {

  @Input()
  public code = '';

  constructor() { }
}

import { Component, Input } from '@angular/core';


@Component({
  selector: 'generator-preview',
  templateUrl: './generator-preview.component.html',
  styleUrls: [
    './generator-preview.component.scss'
  ]
})
export class GeneratorPreviewComponent {
  @Input() public params;
}

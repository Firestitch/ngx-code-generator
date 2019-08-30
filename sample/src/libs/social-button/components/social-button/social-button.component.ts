import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-social-button',
  templateUrl: `./social-button.component.html`,
  styleUrls: ['./social-button.component.scss']
})
export class SocialButtonComponent {

  @Input() public label;
  @Input() public platform;
  @Output() public click = new EventEmitter();

  public clicked() {
    this.click.emit();
  }
}

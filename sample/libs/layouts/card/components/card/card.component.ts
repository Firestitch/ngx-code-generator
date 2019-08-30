import { Component } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  public build: any = {};
  public platform;

  constructor() {
    this.build = environment.build || {};
    this.platform = environment.platform;
  }
}

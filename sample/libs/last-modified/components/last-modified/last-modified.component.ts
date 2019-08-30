import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-last-modified',
  templateUrl: './last-modified.component.html',
  styleUrls: ['./last-modified.component.scss']
})
export class LastModifiedComponent {
  @Input() public account: Account = null;
  @Input() public date: Date = null;

  constructor() {

  }


}

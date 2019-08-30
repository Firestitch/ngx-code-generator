import { Component, Input, OnInit } from '@angular/core';
import { NavService } from '@app/core';


@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  public constructor(private _navService: NavService) {}

  ngOnInit() {
    this._navService.setTitle('Not Found');
  }
}

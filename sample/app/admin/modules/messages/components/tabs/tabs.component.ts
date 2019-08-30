import { Component, OnInit } from '@angular/core';


@Component({
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  public navLinks;

  public ngOnInit() {

    this.navLinks = [
      {
        path: '.',
        label: 'Messages'
      },
      {
        path: './queues',
        label: 'Messages Queue'
      },
      {
        path: './templates',
        label: 'Messages Templates'
      }
    ];
  }
}

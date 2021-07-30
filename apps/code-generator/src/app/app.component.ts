import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public title = 'app';

  public navLinks = [
    {
      path: '/generator',
      label: 'Components',
    },
    {
      path: '/enums',
      label: 'Enums',
    },
    {
      path: '/consts',
      label: 'Consts',
    },
    {
      path: '/interfaces',
      label: 'Interfaces',
    },
  ];
}

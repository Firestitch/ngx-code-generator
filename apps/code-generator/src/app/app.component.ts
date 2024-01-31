import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ];
}

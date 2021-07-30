import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-create-edit-pattern',
  templateUrl: './create-edit.component.html',
})
export class CreateEditComponent {
  @Input()
  public params;
}

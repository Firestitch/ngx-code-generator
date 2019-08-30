import { Component, Input } from '@angular/core';

import { Priorities } from '../priority-menu/priority.data';
import { Priority } from '@app/shared/interfaces';


@Component({
  selector: 'app-priority-pill',
  templateUrl: './priority-pill.component.html',
  styleUrls: ['./priority-pill.component.scss']
})
export class PriorityPillComponent {

  @Input() showName = false;
  @Input() showIcon = true;

  @Input('priority')
  set priority(value: number) {
    if (value !== null) {
      this.priorityValue = this._priorities.find((priority) => value === priority.value);
    }
  }

  get priority() {
    return this.priorityValue.value;
  }

  public priorityValue: Priority;
  private _priorities = Priorities;

  constructor() {

  }
}

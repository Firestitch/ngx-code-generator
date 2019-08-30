import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Priorities } from './priority.data';


@Component({
  selector: 'app-priority-menu',
  templateUrl: './priority-menu.component.html',
  styleUrls: ['./priority-menu.component.scss']
})
export class PriorityMenuComponent implements OnInit {

  @Input() public priority = null;
  @Output() priorityChanged = new EventEmitter<any>();

  public priorities = Priorities;

  constructor() {}

  public ngOnInit() {
  }

  public changePriority(priority: number) {
    this.priority = priority;
    this.priorityChanged.emit(this.priority);
  }

  public compareFn(priorityOne: any, priorityTwo: any ): boolean {
    return  priorityOne && priorityOne.value === priorityTwo;
  }
}

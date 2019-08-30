import { Component, Input, } from '@angular/core';

import { Task } from '@app/shared/interfaces';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.scss']
})
export class TaskPreviewComponent {
  @Input() public task: Task = null;

  constructor() {
  }
}

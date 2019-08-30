import {
  Component, EventEmitter, Input, OnChanges, OnDestroy,
  Output, SimpleChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';

import { CommentData, TaskData } from '@app/core';
import { Object, WorkflowPath, WorkflowAction, Task } from '@app/shared/interfaces';
import { WorkflowActionType } from '@app/shared/enums';

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.scss'],
})
export class CommentCreateComponent implements OnDestroy, OnChanges {

  @Input() public object: Object;
  @Input() public workflowPaths: WorkflowPath[] = [];
  @Input() public comment: any[] | string = '';
  @Output() public onSaved = new EventEmitter();

  public selectedPath: WorkflowPath = null;
  public commentAction: WorkflowAction = null;

  private _destroy$ = new Subject();

  constructor(private _commentData: CommentData,
              private _taskData: TaskData,
              private _fsMessage: FsMessage) {}

  public changed(content) {
    this.comment = content;
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.workflowPaths && !changes.workflowPaths.firstChange) {
      this.workflowPaths.forEach((path: WorkflowPath) => {
        path.tooltip = this.formTooltip(path);
      });
    }
  }

  public changeSelectedPath(path: WorkflowPath) {
    this.selectedPath = path;
    this.commentAction = path.workflow_actions.find((action) => {
      return action.type === WorkflowActionType.Comment
    });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save() {

    if (this.workflowPaths.length && this.selectedPath) {
      this.saveWorkflow();
    } else {
      this.saveComment();
    }
  }

  private saveWorkflow() {
    this._taskData.savePathToTask(
      this.object.id,
      { workflow_path_id: this.selectedPath.id, comment: this.comment }
      )
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: { task: Task }) => {
        this.comment = '';
        this.commentAction = null;
        this._fsMessage.success(this.selectedPath.tooltip);

        this.onSaved.emit(response.task);
      });
  }

  private saveComment() {
    if (this.isCommentEmpty()) {
      return;
    }

    this._commentData.save({ object_id: this.object.id, content: this.comment })
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {
        this.comment = '';
        this.onSaved.emit();
      })
  }

  private formTooltip(path: WorkflowPath) {
    let tooltip = '';
    if (path.target_workflow_step.status) {
      `Set Status to ${path.target_workflow_step.status.name}\n`;
    }

    path.workflow_actions.forEach((action) => {
      switch (action.type) {
        case WorkflowActionType.Comment: {
          if (action.configs.comment_required) {
            tooltip += 'Required Comment\n';
          } else {
            tooltip += 'Add Comment\n';
          }
        } break;
        case WorkflowActionType.AccountAssignment: {
          if (action.assign_account) {
            tooltip += `Set ${action.assign_account.name} as a Assign Person\n`;
          }
        } break;
        case WorkflowActionType.AddSubscriber: {
          if (action.subscriber_accounts) {
            action.subscriber_accounts.forEach((subscriber) => {
              tooltip += `Set ${subscriber.name} as a subscriber\n`
            })
          }
        } break;
      }
    });

    return tooltip;
  }

  /**
   * fs-editor on empty comment returns '/n'
   * also we shouldn't save comment that contains only spaces
   * need to check is empty comment or not
   */
  private isCommentEmpty() {
    if (!this.comment && !this.comment.length) {
      return true;
    } else if (this.comment.length > 1) {
      return false;
    }

    let comment = this.comment[0].insert;
    if (typeof comment  === 'string') {
      comment = comment.trim();
    }

    return !comment ? true : false;
  }

}

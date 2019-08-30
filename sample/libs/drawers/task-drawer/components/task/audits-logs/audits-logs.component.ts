import {
  Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange,
} from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { forEach } from 'lodash-es';

import { filter } from '@firestitch/common';

import { Task } from 'app/shared/interfaces';
import { AuditModel } from '@app/shared/models/audit.model';
import { AuditData } from 'app/core';
import { AuditEditCommentComponent } from './audit-edit-comment/audit-edit-comment.component';


@Component({
  selector: 'app-audits-logs',
  templateUrl: './audits-logs.component.html',
  styleUrls: ['./audits-logs.component.scss']
})
export class AuditsLogsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public task: Task = null;

  public audits = [];

  private _destroy$ = new Subject();

  constructor(
    private _auditData: AuditData,
    private _dialog: MatDialog
  ) { }

  public ngOnChanges(changes: { task: SimpleChange }) {
    if (changes.task
      && changes.task.previousValue
      && changes.task.currentValue.id !== changes.task.previousValue.id) {
      this.loadData();
    }
  }

  public ngOnInit() {
    if (this.task.id) {
      this.loadData();
    }
  }

  public refresh() {
    this.loadData();
  }

  public loadData() {
    const query = {
      object_id: this.task.id,
      objects: true,
      actor_accounts: true,
      audit_objects: true,
      order: 'date,desc'
    };

    this._auditData.gets(query, { key: null })
    .pipe(
        takeUntil(this._destroy$),
        map((response) => {
          const audits = response.audits.map((audit) => new AuditModel(audit));
          return { data: audits, paging: response.paging };
        })
      )
      .subscribe((response) => {
        // Filter meta by description. Data without description looks like broken.
        forEach(response.data, audit => {
          audit.meta = filter(audit.meta, item => !!item.description);
        });
        this.audits = response.data;
      });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public remove(audit: AuditModel) {

    this._auditData.delete(audit, { key: null })
    .subscribe(() => {
      const index = this.audits.findIndex((adt) => adt.id === audit.id);

      if (index !== -1) {
        this.audits.splice(index, 1);
      }
    });
  }

  public edit(audit: AuditModel, meta: any) {
    const dialogRef = this._dialog.open( AuditEditCommentComponent,
      { data: { audit, meta }}
      );

    dialogRef.afterClosed().pipe(
        takeUntil(this._destroy$)
      ).subscribe((response) => {
        if (response) {
          meta.object.meta.content = response;
        }
      })
  }
}

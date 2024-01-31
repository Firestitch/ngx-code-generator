import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { Subject, of } from 'rxjs';
import { switchMap, tap, takeUntil } from 'rxjs/operators';

import { ProjectsData } from '../../../../../../common/data/projects.data';


@Component({
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnInit, OnDestroy {

  public projects;

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ProjectComponent>,
    private _message: FsMessage,
    private _projectsData: ProjectsData,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save = () => {
    return this._projectsData.save(this.projects)
      .pipe(
        tap((projects) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(projects);
        }),
      );
  };

  public close(value?): void {
    this._dialogRef.close(value);
  }

  private _fetchData(): void {
    of(this._data.projects)
      .pipe(
        switchMap((projects) => {
          return projects.id
            ? this._projectsData.get(this._data.projects.id)
            : of(projects);
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((projects) => {
        this.projects = { ...projects };

        this._cdRef.markForCheck();
      });
  }

}

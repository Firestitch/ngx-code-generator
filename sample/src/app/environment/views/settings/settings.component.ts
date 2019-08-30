import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { RouteObserver } from '@firestitch/core';
import { FsFileImagePickerComponent } from '@firestitch/file';
import { FsStore } from '@firestitch/store';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EnvironmentData, SessionService } from '@app/core';
import { Environment } from '../../../shared/interfaces';


@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  @ViewChild('environmentImage') public environmentImage: FsFileImagePickerComponent = null;

  public environment: Environment = { id: null, image: {} };
  public routeObserver = new RouteObserver(this._route.parent, 'environment');

  private _storedEnvironment: Environment = null;

  private _destroy$ = new Subject();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _environmentData: EnvironmentData,
    private _message: FsMessage,
    private _store: FsStore,
    private _sessionService: SessionService
  ) { }

  public ngOnInit() {

    this._store.observe('environment')
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(store => this._storedEnvironment = store.value);

    this.routeObserver
      .subscribe(environment => {
        this.environment = environment || { id: null };
      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save() {

    this._environmentData.save(this.environment)
      .subscribe(environment => {
        this._message.success('Saved Changes');
        this.routeObserver.next(environment);
        this.onSuccess(environment);
    })
  }

  public upload(fsFile) {
    this._environmentData.image(this.environment, fsFile.file)
      .subscribe(
        environment => {
        this.routeObserver.next(environment);
        this.onSuccess(environment);
        this._message.success('Image Saved');
      },
      () => {
        this._message.error('Error. Something went wrong.');
      },
      () => {
        this.environmentImage.cancel();
      });
  }

  private onSuccess(environment: Environment) {
    if (this._storedEnvironment && this._storedEnvironment.id === environment.id) {
      this._sessionService.environment(environment);
    }
  }

}

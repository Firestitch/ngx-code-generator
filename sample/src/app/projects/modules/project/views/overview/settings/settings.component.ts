import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { RouteObserver } from '@firestitch/core';
import { FsFileImagePickerComponent } from '@firestitch/file';

import { ProjectData } from '@app/core';
import { Project, Status } from '@app/shared';


@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  @ViewChild('projectImage') public projectImage: FsFileImagePickerComponent = null;

  public project: Project = { id: null, image: {} };
  public routeObserver = new RouteObserver(this._route.parent, 'project');

  public statuses: Status[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _projectData: ProjectData,
    private _message: FsMessage
  ) { }

  public ngOnInit() {
    this.routeObserver
      .subscribe(project => {
        this.project = Object.assign({}, project);
      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
  }

  public changeStatus(data: Status) {
    this.project.status = data;
    this.project.status_id = data.id;
  }

  public save() {

    this._projectData.save(this.project)
      .subscribe(project => {
        this._message.success(`Project successfully ${this.project.id ? 'saved' : 'created'}`);
        if (!this.project.id) {
          this._router.navigate(['/projects', project.id, 'overview', 'settings']);
        }

        this.routeObserver.next(project);
    })
  }

  public upload(fsFile) {
    this._projectData.image(this.project, fsFile.file)
      .subscribe(
        project => {
        this.project.image = project.image;
        this.routeObserver.next(this.project);
        this._message.success('Picture Saved');
      },
      () => {
        this._message.error('Error. Something went wrong.');
      },
      () => {
        this.projectImage.cancel();
      });
  }

}

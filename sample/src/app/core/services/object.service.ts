import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { filter } from 'lodash-es';

import { SessionService } from './session.service';
import { Object, Project } from '../../shared/interfaces';
import { ObjectClass } from '../../shared/enums';
import { ObjectClasses } from '../../shared/consts';


@Injectable()
export class ObjectService {

  public searchClasses = [
    ObjectClass.Doc,
    ObjectClass.Asset,
    ObjectClass.Task,
    ObjectClass.Image
  ];

  private maxRecentCount = 15;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _sessionService: SessionService
  ) { }

  public getRecent() {
    return this._sessionService.searchRecentIds();
  }

  public navigate(object) {

    let codeIdentifier = '';
    switch (object.class) {
      case ObjectClass.Project:
        this._router.navigate(['/projects', object.id, 'overview', 'settings']);
        break;
      case ObjectClass.Account:
        this._router.navigate(['/admin', 'account', object.id]);
        break;
      case ObjectClass.Doc:
      case ObjectClass.Task:
      case ObjectClass.Asset:
      case ObjectClass.Image:
        codeIdentifier = this.getObjectIdentifierCode(object.project, object);
        this._router.navigate(
          [],
          { relativeTo: this._route, queryParams: { object: codeIdentifier }, queryParamsHandling: 'merge' }
        );
        break;
    }

    this.pushRecentId(object.id);
  }

  public objectIdentifier(project: Project, object: Object) {
    let projectAbr = '';
    let objectAbr = '';
    let objectNumber = '';

    if (project) {
      projectAbr = project.abr;
      if (project.meta && project.meta.abr) {
        projectAbr = project.meta.abr;
      }
    }

    if (object) {
      const cls = filter(ObjectClasses, { value: object.class })[0];
      objectAbr = cls ? cls.abr : '';

      objectNumber = object.number;

      if (object.meta && object.meta.number) {
        objectNumber = object.meta.number;
      }
    }

    return { projectAbr, objectAbr, objectNumber };
  }

  public getObjectIdentifierCode(project: Project, object: Object) {
    const identifier = this.objectIdentifier(project, object);
    return `${identifier.projectAbr}-${identifier.objectAbr}${identifier.objectNumber}`;
  }

  private pushRecentId(id: number) {
    const data = this._sessionService.searchRecentIds() || [];

    const index = data.indexOf(id);
    if (index > -1) {
      data.splice(index, 1);
    }

    data.unshift(id);

    if (data.length > this.maxRecentCount) {
      data.splice(this.maxRecentCount, data.length);
    }

    this._sessionService.searchRecentIds(data);
  }
}

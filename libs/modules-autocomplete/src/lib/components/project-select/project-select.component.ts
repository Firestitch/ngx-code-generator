import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsMessage } from '@firestitch/message';

import { ModulesService } from '../../services/modules.service';


@Component({
  selector: 'app-project-select',
  templateUrl: './project-select.component.html',
  styleUrls: ['./project-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ModulesService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectSelectComponent),
      multi: true
    }
  ]
})
export class ProjectSelectComponent implements OnInit, ControlValueAccessor {

  public projects: any[] = [];
  public project: any;
 
  public onChange: (value) => void;
  public onTouch: (value) => void;

  constructor(
    private _modulesService: ModulesService,
    private _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this._loadProjects();
    this._initFromLocalStorage();
  }

  public writeValue(value) {
    this.project = value;
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  private _loadProjects() {
    this._modulesService.listOfProjects()
      .subscribe(({ projects }) => {
        this.projects = projects;
      },
        (response) => {
          this._message.error(response.error && response.error.message || (response.body && response.body.error) || response.message);
        });
  }

  private _initFromLocalStorage(): void {
    setTimeout(() => { 
      const project = localStorage.getItem('project');

      if (project && !this.project) {
        this.project = JSON.parse(project);
        this._cdRef.markForCheck();
        this.onChange(this.project);
      }
    }, 500);
  }

  public compareWith(o1, o2) {
    return o1?.name === o2?.name &&
      o1?.root === o2?.root &&
      o1?.sourceRoot === o2?.sourceRoot;
  }

  public selectProject(project) {
    this.onChange(project);
    localStorage.setItem('project', JSON.stringify(project));
  }

}

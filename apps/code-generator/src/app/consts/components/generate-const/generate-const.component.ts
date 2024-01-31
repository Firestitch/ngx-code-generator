import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { NgForm } from '@angular/forms';

import * as pluralize from 'pluralize';

import { ConstService } from '../../services';
import { classify } from '@angular-devkit/core/src/utils/strings';

@Component({
  selector: 'app-generate-const',
  templateUrl: './generate-const.component.html',
})
export class GenerateConstComponent implements OnInit, AfterViewInit {
  @Input()
  public loading = false;

  @Input()
  public externalParams: Record<string, unknown>;

  @Input()
  public error = '';

  @Output()
  public formChanged = new EventEmitter<any>();

  @Output()
  public generate = new EventEmitter<any>();

  @ViewChild('moduleForm', { static: true })
  public form: NgForm;

  public model = {
    project: null,
    module: null,
    enum: null,
    enumData: null,
    name: null,
    consts: [],
  };

  public enums: any = [];

  constructor(public constsService: ConstService) {}

  public ngOnInit(): void {
    if (this.externalParams) {
      if (this.externalParams.modulePath && this.externalParams.moduleName) {
        this.model.module = {
          modulePath: this.externalParams.modulePath,
          name: this.externalParams.moduleName,
        };
      }

      this.model.name = classify(pluralize(this.externalParams.enumName || ''));

      this.loadEnums();
    }
  }

  public ngAfterViewInit() {
    this.form.valueChanges.subscribe((values) => {
      this.formChanged.emit({ ...values });
    });
  }

  public loadEnums() {
    if (!this.model.module) {
      return;
    }

    this.constsService
      .getEnumsForModule(this.model.project, this.model.module.modulePath)
      .subscribe((response) => {
        this.enums = response;

        if (this.externalParams.enumPath) {
          this.model.enum = this.enums.find((item) => {
            return item.enumFullPath === this.externalParams.enumPath;
          });
        }
      });
  }

  public enumSelected(event) {
    if (event && event.enumFile) {
      const name = event.enumFile.replace('.enum.ts', '');
      this.model.name = classify(pluralize(name));
    }
  }

  public setEnumData(data) {
    this.model.enumData = data;
  }

  public submit() {
    if (this.form.valid && this._checkEnumsValidation()) {
      this.generate.emit(this.model);
    }
  }

  private _checkEnumsValidation() {
    return this.model.consts.every((en) => {
      return !!en;
    });
  }
}

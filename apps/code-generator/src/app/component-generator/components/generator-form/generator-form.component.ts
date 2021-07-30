import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { NgForm } from '@angular/forms';
import { ServicesService } from '../../services';
import * as pluralize from 'pluralize';
import { camelCase } from 'camel-case';

@Component({
  selector: 'app-component-generator-form',
  templateUrl: './generator-form.component.html',
})
export class GeneratorFormComponent implements OnInit, AfterViewInit {
  @Output()
  public formChanged = new EventEmitter<any>();

  @Output()
  public generate = new EventEmitter<any>();

  @ViewChild('moduleForm', { static: true })
  public form: NgForm;

  public model = {
    module: null,
    service: null,
    componentName: null,
    relatedParentType: 'none',
    createEditComponentName: null,
    interfacePattern: null,
    createEditInterfacePattern: 'dialog',
    singularComponentName: null,
    pluralComponentName: null,
    singularModelName: null,
    pluralModelName: null,
    routableComponent: true,
    routableCreateComponent: true,
    titledComponent: true,
    titledCreateComponent: true,
    includedModuleExports: false,
  };

  public services = [];
  public createEditOptions = [];
  public listOptions = [];
  public hasListInterface = false;
  public hasCreateEditInterface = false;
  public hasModel = false;

  constructor(private _servicesService: ServicesService) {}

  public ngOnInit() {
    this._servicesService.listOfServices().subscribe((response: any) => {
      this.services = response.services;
    });
  }

  public ngAfterViewInit() {
    this.form.valueChanges.subscribe((values) => {
      this.formChanged.emit({ ...values });
    });
  }

  public createEditInterfaceChanged() {
    this.createEditOptions = [];
    if (this.model.createEditInterfacePattern === 'full') {
      this.createEditOptions.push({
        name: 'routableCreateComponent',
        value: 'Routable',
      });
      this.createEditOptions.push({
        name: 'titledCreateComponent',
        value: 'Set Title',
      });
      this.createEditOptions.push({
        name: 'includedModuleExports',
        value: 'Include in Module Exports',
      });
    }
  }

  public interfacePatternChanged() {
    this.hasListInterface = false;
    this.hasCreateEditInterface = false;
    this.hasModel = false;

    let hasRoutable = !!this.model.interfacePattern;
    let hasTitle = !!this.model.interfacePattern;
    let hasExports = !!this.model.interfacePattern;

    switch (this.model.interfacePattern) {
      case 'list':
        {
          this.hasListInterface = true;
          this.hasModel = true;
        }
        break;

      case 'list-create-edit':
        {
          this.hasListInterface = true;
          this.hasCreateEditInterface = true;
          this.hasModel = true;
        }
        break;

      case 'create-edit':
        {
          this.hasCreateEditInterface = true;
          this.hasModel = true;
        }
        break;

      case 'tabs':
        {
          this.model.routableComponent = false;
          this.model.componentName = 'nav';
          hasRoutable = false;
        }
        break;

      case 'dialog':
        {
          this.model.routableComponent = false;
          this.model.titledComponent = false;
          hasRoutable = false;
          hasTitle = false;
        }
        break;
    }

    this.listOptions = [];
    if (hasRoutable) {
      this.listOptions.push({ name: 'routableComponent', value: 'Routable' });
    }

    if (hasTitle) {
      this.listOptions.push({ name: 'titledComponent', value: 'Set Title' });
    }

    if (hasExports) {
      this.listOptions.push({
        name: 'includedModuleExports',
        value: 'Include in Module Exports',
      });
    }
  }

  public submit() {
    this.generate.emit(this.model);
  }

  public serviceChanged(service) {
    if (service) {
      const name = service.singularName.replace(
        /(-(data))?\.(data|service)\.ts$/i,
        ''
      );

      this.model.singularModelName = camelCase(name);
      this.model.pluralModelName = camelCase(pluralize(name));
    }
  }
}

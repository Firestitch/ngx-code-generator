import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { NgForm } from '@angular/forms';
import { ServicesService } from '../../services';
import * as pluralize from 'pluralize';


@Component({
  selector: 'app-component-generator-form',
  templateUrl: './generator-form.component.html',
})
export class GeneratorFormComponent implements OnInit, AfterViewInit {

  @Output()
  public formChanged = new EventEmitter<any>();

  @Output()
  public generate = new EventEmitter<void>();

  @ViewChild('moduleForm')
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
    titledCreateComponent: true
  };

  public services = [];
  public createEditOptions = [];
  public listOptions = [];
  public hasListInterface = false;
  public hasCreateEditInterface = false;
  public hasModel = false;

  constructor(
    private _servicesService: ServicesService,
  ) {}

  public ngOnInit() {
   this._servicesService.listOfServices()
     .subscribe((response: any) => {
       this.services = response.services;
     });
  }

  public ngAfterViewInit() {
    this.form.valueChanges.subscribe((values) => {
      this.formChanged.emit({...values});
    });
  }

  public createEditInterfaceChanged() {
    this.createEditOptions = [];
    if (this.model.createEditInterfacePattern === 'full') {
      this.createEditOptions.push({ name:  'routableCreateComponent', value: 'Routable' });
      this.createEditOptions.push({ name:  'titledCreateComponent', value: 'Set Title' });
    }
  }

  public interfacePatternChanged() {
    this.hasListInterface = false;
    this.hasCreateEditInterface = false;
    this.hasModel = false;

    this.listOptions = [];
    if (this.model.interfacePattern && this.model.interfacePattern !== 'create-edit' && this.model.interfacePattern !== 'tabs') {
      this.listOptions.push({ name:  'routableComponent', value: 'Routable' });
      this.listOptions.push({ name:  'titledComponent', value: 'Set Title' });
    }

    switch (this.model.interfacePattern) {
      case 'list': {
        this.hasListInterface = true;
        this.hasModel = true;
      } break;

      case 'list-create-edit': {
        this.hasListInterface = true;
        this.hasCreateEditInterface = true;
        this.hasModel = true;
      } break;

      case 'create-edit': {
        this.hasCreateEditInterface = true;
        this.hasModel = true;
      } break;

      case 'tabs': {
        this.model.routableComponent = false;
        this.model.componentName = 'tabs';
      } break;
    }
  }

  public submit() {
    this.generate.emit();
  }

  public serviceChanged(service) {
    if (service) {
      const name = service.singularName
                    .replace(/(-(data))?\.(data|service)\.ts$/i, '')
                    .replace('-', '_');

      this.model.singularModelName = name;
      this.model.pluralModelName = pluralize(name);
    }
  }
}

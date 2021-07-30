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

@Component({
  selector: 'app-enum-form',
  templateUrl: './generate-enum.component.html',
})
export class GenerateEnumComponent implements OnInit, AfterViewInit {
  @Input()
  public loading = false;

  @Input()
  public error = '';

  @Output()
  public formChanged = new EventEmitter<any>();

  @Output()
  public generate = new EventEmitter<any>();

  @ViewChild('moduleForm', { static: true })
  public form: NgForm;

  public model = {
    module: null,
    name: null,
    enums: [{ name: '', value: '' }],
  };

  public services = [];

  constructor() {}

  public ngOnInit() {}

  public ngAfterViewInit() {
    this.form.valueChanges.subscribe((values) => {
      this.formChanged.emit({ ...values });
    });
  }

  public submit() {
    if (this.form.valid && this._checkEnumsValidation()) {
      this.generate.emit(this.model);
    }
  }

  private _checkEnumsValidation() {
    return this.model.enums.every((en) => {
      return !!en.name && !!en.value;
    });
  }
}

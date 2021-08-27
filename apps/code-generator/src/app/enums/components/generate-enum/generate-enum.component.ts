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
  styleUrls: ['./generate-enum.component.scss'],
})
export class GenerateEnumComponent implements OnInit, AfterViewInit {
  @Input()
  public loading = false;

  @Input()
  public successfulGeneration = false;

  @Output()
  public formChanged = new EventEmitter<any>();

  @Output()
  public generate = new EventEmitter<any>();

  @Output()
  public navigateConstPage = new EventEmitter<void>();

  @ViewChild('moduleForm', { static: true })
  public form: NgForm;

  public model = {
    module: null,
    name: null,
    enums: [{ name: '', value: '' }],
  };

  public services = [];

  constructor() {}

  public get generateConstDisabled(): boolean {
    return !this.successfulGeneration;
  }

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

  public generateConst(): void {
    this.navigateConstPage.emit();
  }

  private _checkEnumsValidation() {
    return this.model.enums.every((en) => {
      return !!en.name && !!en.value;
    });
  }
}

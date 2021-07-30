import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsMessage } from '@firestitch/message';

import { of } from 'rxjs';
import FuzzySearch from 'fuzzy-search';

import { ModuleInterface } from '../../interfaces';
import { ModelsService } from '../../services/models.service';


@Component({
  selector: 'app-models-list',
  templateUrl: './models-list.component.html',
  styleUrls: ['./models-list.component.scss'],
  providers: [
    ModelsService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModelsListComponent),
      multi: true
    }
  ]
})
export class ModelsListComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() public models: ModuleInterface[];
  @Input() public fetchOnFocus = true;
  @Input() public module: ModuleInterface;
  @Input() public showCreateButton = true;
  @Output() public moduleChange = new EventEmitter();

  public onChange: any = () => {};
  public onTouch: any = () => {};

  public loading = true;
  public fuzzer: FuzzySearch;

  constructor(
    private _modulesService: ModelsService,
    private _dialog: MatDialog,
    private _message: FsMessage,
  ) {}

  public ngOnInit() {
    this._loadModels();
  }

  public ngOnChanges(changes) {
    if (changes.modules && changes.modules.currentValue !== void 0) {
      this.loading = false;
    }
  }

  public fetch = (kw) => {
    if (this.models) {
      if (!!kw) {
        const keyword = kw.replace(' ', '');
        return of(this.fuzzer.search(keyword));
      } else {
        return of(this.models);
      }
    }
  }

  public displayWith = (data) => {
    if (data && data.name) {
      return data.name;
    }

    return '-';
  }

  public selectModule(event) {
    this.writeValue(event);

    if (event) {
      this.moduleChange.emit(this.module);
    }
  }

  public writeValue(value) {
    this.module = value;
    this.onChange(value);
    this.onTouch(value);
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  private _loadModels() {
    this._modulesService.list()
      .subscribe((response: any) => {
        this.loading = false;
        this.models = Object.values(response.data.models);

        this._initFuzzer();
      },
        (response) => {
          this._message.error(response.error && response.error.message || (response.body && response.body.error) || response.message);
        });
  }

  private _initFuzzer() {
    this.fuzzer = new FuzzySearch(this.models, ['name']);
  }
}

import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsMessage } from '@firestitch/message';

import { of } from 'rxjs';
import FuzzySearch from 'fuzzy-search';

import { ModuleInterface } from '../../interfaces';
import { CreateModuleDialogComponent } from './create-module-dialog/';
import { ModulesService } from '../../services/modules.service';


@Component({
  selector: 'app-modules-list',
  templateUrl: './modules-list.component.html',
  styleUrls: ['./modules-list.component.scss'],
  providers: [
    ModulesService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModulesListComponent),
      multi: true
    }
  ]
})
export class ModulesListComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() public modules: ModuleInterface[];

  @Input() public module: ModuleInterface;
  @Input() public showCreateButton = true;
  @Output() public moduleChange = new EventEmitter();

  public onChange: any = () => {};
  public onTouch: any = () => {};

  public loading = true;
  public fuzzer: FuzzySearch;

  constructor(
    private _modulesService: ModulesService,
    private _dialog: MatDialog,
    private _message: FsMessage,
  ) {}

  public ngOnInit() {
    this._loadModules();
  }

  public ngOnChanges(changes) {
    if (changes.modules && changes.modules.currentValue !== void 0) {
      this.loading = false;
    }
  }

  public fetch = (kw) => {
    if (this.modules) {
      if (!!kw) {
        const keyword = kw.replace(' ', '');
        return of(this.fuzzer.search(keyword));
      } else {
        return of(this.modules);
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

  public openDialog() {
    const rootModule = this.modules.find((m) => m.moduleName === 'app.module.ts');
    const dialogRef = this._dialog.open(CreateModuleDialogComponent, {
      width: '400px',
      data: { rootModule }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.moduleChange.emit('');
        return;
      }

      debugger;

      this.module = result.module;
      this.selectModule(this.module);

      this.modules = result.modules;
      this._initFuzzer();

      this.moduleChange.emit(this.module);
    });
  }

  public writeValue(value) {
    this.module = value;
    this.onChange(value);
    this.onTouch(value);
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  private _loadModules() {
    this._modulesService.listOfModules()
      .subscribe((response: any) => {
        this.loading = false;
        this.modules = response.modules;
        this._initFuzzer();
      },
        (response) => {
          this._message.error(response.error && response.error.message || (response.body && response.body.error) || response.message);
        });
  }

  private _initFuzzer() {
    this.fuzzer = new FuzzySearch(this.modules, ['moduleFullPath']);
  }
}

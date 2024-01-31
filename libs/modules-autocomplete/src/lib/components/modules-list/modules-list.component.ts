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

import { catchError, map, of, tap, throwError } from 'rxjs';
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
export class ModulesListComponent implements OnInit, ControlValueAccessor {

  @Input()
  public fetchOnFocus = true;

  @Input()
  public showCreateButton = true;

  @Input()
  public namespace: string;

  @Input()
  public project: string;

  public fuzzer: FuzzySearch;
  public module: ModuleInterface;

  private static readonly _LOCAL_STORAGE_KEY = 'codegen-module';

  constructor(
    private _modulesService: ModulesService,
    private _dialog: MatDialog,
    private _message: FsMessage,
  ) {}

  public get localStorageKey(): string {
    return this.namespace || ModulesListComponent._LOCAL_STORAGE_KEY;
  }

  public ngOnInit() {
    //this._initFromLocalStorage();
  }
  
  public fetch = (kw: string) => {
    return this._modulesService.listOfModules(this.project)
      .pipe(
        map(({ modules }) => {
          if (!!kw) {
            const keyword = kw.replace(' ', '');
            this.fuzzer = new FuzzySearch(modules, ['moduleFullPath']);
            return this.fuzzer.search(keyword);
          } 

          return modules;
        }),
        catchError((response) => {
          this._message.error(response.error && response.error.message || (response.body && response.body.error) || response.message);

          return throwError(response);
        })
      );
  }

  public displayWith = (data) => {
    if (data && data.name) {
      return data.name;
    }

    return '-';
  }

  public selectModule(event) {
    this._saveToLocalStorage(event);
    this.writeValue(event);
  }

  public openDialog() {
    this._dialog.open(CreateModuleDialogComponent, {
      width: '400px',
      data: { rootModule: '', project: this.project }
    })
      .afterClosed()
      .subscribe(result => {
        this.module = result?.module;
        this.selectModule(this.module);
      });
  }

  public writeValue(value) {
    this.module = value;
    this.onChange(value);
    this.onTouch(value);
  }

  public onChange: any = () => {};
  public onTouch: any = () => {};
  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }


  private _initFromLocalStorage(): void {
    setTimeout(() => {
      const module = localStorage.getItem(this.localStorageKey);

      if (module && !this.module) {
        this.selectModule(JSON.parse(module));
      }
    }, 0);
  }

  private _saveToLocalStorage(value: ModuleInterface): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(value));
  }

}

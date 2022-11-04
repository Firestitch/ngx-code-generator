import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FsMessage } from '@firestitch/message';

import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import FuzzySearch from 'fuzzy-search';

import { ModulesService } from '../../services/modules.service';


@Component({
  selector: 'app-parent-directory',
  templateUrl: './parent-directory.component.html',
  styleUrls: ['./parent-directory.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ParentDirectoryComponent),
      multi: true
    }
  ]
})

export class ParentDirectoryComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnDestroy {

  public activePath = [];
  public parentPath = '';

  public allDirectories = [];
  public directories = [];

  public fuzzer: FuzzySearch;

  @ViewChild(MatAutocompleteTrigger, { static: true })
  public autoCompleteRef: MatAutocompleteTrigger;

  @ViewChild('input', { static: true })
  public inputRef: ElementRef;

  private _destroy$ = new Subject<void>();

  constructor(
    private _message: FsMessage,
    private _generatorService: ModulesService,
  ) {}

  public get currentPath() {
    return this.activePath.join('/') + '/';
  }

  public ngOnInit() {
    this._load('/');
  }

  public ngAfterViewInit() {
    fromEvent(this.inputRef.nativeElement, 'keydown')
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((event: any) => {

        const key = event.which || event.keyCode || event.charCode;
        const value = this.inputRef.nativeElement.value;

        if (key === 8) {
          if (value[value.length - 1] === '/') {
            event.preventDefault();
            this._removeLastPart();
          } else {
            this._filterDirectoriesByLastPart(true);
          }
        } else {
          {
            this._filterDirectoriesByLastPart();
          }
        }
      });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public select(event) {
    this.activePath.push(event.option.value);

    this.writeValue(this.currentPath);
    this._load(this.currentPath);

    setTimeout(() => {
      this.autoCompleteRef.openPanel();
    }, 100);
  }

  public writeValue(value) {
    this.parentPath = value;

    this.onChange(value);
    this.onTouch(value);
  }

  public onChange: any = () => {};
  public onTouch: any = () => {};
  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  private _load(val = null) {
    if (!val) {
      val = this.currentPath;
    }

    this._generatorService.getModulesFor(val || '/')
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((directories: any) => {
        if (Array.isArray(directories) && directories.length === 0) {
          this._message.success('No submodules for ' + this.currentPath);
        }

        this.allDirectories = directories;
        this.directories = directories.slice();

        this.fuzzer = new FuzzySearch(this.allDirectories);
      });
  }

  private _removeLastPart() {
    this.activePath.pop();
    this.writeValue(this.currentPath);

    this._load();
  }

  private _filterDirectoriesByLastPart(removeLastChar = false) {
    if (this.parentPath) {
      let part = this.parentPath.split('/').pop();

      if (removeLastChar) {
        part = part.slice(0, -1);
      }

      if (!!part) {
        this.directories = this.fuzzer.search(part);
      } else {
        this.directories = this.allDirectories.slice();
      }
    } else {
      this.directories = this.allDirectories.slice();
    }
  }
}

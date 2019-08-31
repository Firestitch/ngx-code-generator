import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { CreateServiceDialogComponent } from './create-service-dialog/';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import FuzzySearch from 'fuzzy-search';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServicesListComponent),
      multi: true
    }
  ]
})
export class ServicesListComponent implements ControlValueAccessor {
  @Input()
  public required;

  @Input()
  public service;

  @Input()
  set services(val) {
    this._initServices(val);
  }

  @Output()
  public serviceChange = new EventEmitter();

  public loading = true;

  public onChange: any = () => {};
  public onTouch: any = () => {};
  public fuzzer: FuzzySearch;

  private _services;

  constructor(private _dialog: MatDialog) {}

  get services() {
    return this._services;
  }

  public fetch = (kw) => {
    if (this.services) {
      if (!!kw) {
        const keyword = kw.replace(' ', '');

        return of(this.fuzzer.search(keyword));
      } else {
        return of(this.services);
      }
    }
  }

  public displayWith = (data) => {
    if (data) {
      return data.name;
    }

    return data;
  }

  public selectService(event) {
    this.writeValue(event);

    if (event) {
      this.serviceChange.emit(this.service);
    }
  }

  public openDialog() {
    const dialogRef = this._dialog.open(CreateServiceDialogComponent, {
      width: '400px',
      data: { services: this.services }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.serviceChange.emit('');
        return;
      }

      this.selectService(result);
      this.service = result;

      this.services.push(result);
    });
  }

  public writeValue(value) {
    this.service = value;
    this.onChange(value);
    this.onTouch(value);
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  private _sortServices(val) {
    // First level sort by module
    val.sort((a, b) => {
      if (a.module < b.module) {
        return -1;
      } else if (a.module > b.module) {
        return 1;
      }

      return 0;
    });

    // Sort by service name
    val.forEach((group) => {
      if (group.services) {
        group.services.sort((a, b) => {
          if (a.singularName < b.singularName) {
            return -1;
          } else if (a.singularName > b.singularName) {
            return 1;
          }

          return 0;
        });
      }
    });
  }

  private _initServices(val) {
    this.loading = !val;

    if (val) {
      this._sortServices(val);

      this._services = val.reduce((acc, group) => {
        group.services.forEach((service) => {
          acc.push({
            ...service,
            fullPath: service.servicePath + '/' + service.singularName
          });
        });

        return acc;
      }, []);

    } else {
      this._services = val;
    }

    this.fuzzer = new FuzzySearch(this._services, ['fullPath']);
  }
}

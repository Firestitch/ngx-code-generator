import {
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import { CreateServiceDialogComponent } from './create-service-dialog/';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import FuzzySearch from 'fuzzy-search';
import { ServicesService } from '../../services';


@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServicesListComponent),
      multi: true,
    },
  ],
})
export class ServicesListComponent implements ControlValueAccessor {
  
  @Input() public required;
  @Input() public module;
  @Input() public project;

  public service;

  public onChange: (value) => void;
  public onTouch: (value) => void;

  public fuzzer: FuzzySearch;

  constructor(
    private _dialog: MatDialog,
    private _servicesService: ServicesService
  ) {}

  public fetch = (kw) => {
    return this._servicesService.listOfServices(this.project, this.module?.name)
      .pipe(
        map(({ services }) => {
          this._sortServices(services);
 
          this.fuzzer = new FuzzySearch(services, ['name']);

          if (!!kw) {
            const keyword = kw.replace(' ', '');
            return this.fuzzer.search(keyword);
          }

          return services;
        })
      );
  };

  public displayWith = (data) => {
    if (data) {
      return data.name;
    }

    return data;
  };

  public selectService(event) {
    this.onChange(event);
  }

  public openDialog() {
    this._dialog.open(CreateServiceDialogComponent, {
      width: '400px',
      data: { module: this.module },
    })
    .afterClosed()
    .subscribe((result) => {
      this.selectService(result);
      this.service = result;
    });
  }

  public writeValue(value) {
    this.service = value;
  }

  public registerOnChange(fn) {
    this.onChange = fn;
  }

  public registerOnTouched(fn) {
    this.onTouch = fn;
  }

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
}

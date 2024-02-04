import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { of } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-enums-list',
  templateUrl: './enums-list.component.html',
  styleUrls: ['./enums-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnumsListComponent),
      multi: true,
    },
  ],
})
export class EnumsListComponent implements ControlValueAccessor {
  @Input() public required;

  @Input()
  public enums;

  @Output() public enumChange = new EventEmitter();

  public selectedEnum;
  public service;

  public loading = false;

  public onChange: any = () => {};
  public onTouch: any = () => {};

  public fetch = (kw) => {
    if (this.enums) {
      if (!!kw) {
        const kwParts = kw.split(' ');

        const matchedEnums = this.enums.filter((service) => {
          return kwParts.every(
            (part) => service.enumFullPath.indexOf(part) > -1
          );
        });
        return of(matchedEnums);
      } else {
        return of(this.enums);
      }
    }
  };

  public displayWith = (data) => {
    if (data) {
      return data.name;
    }

    return data;
  };

  public selectEnum(event) {
    this.writeValue(event);

    this.onChange(event);
    this.onTouch(event);

    if (event) {
      this.enumChange.emit(this.selectedEnum);
    }
  }

  public writeValue(value) {
    this.selectedEnum = value;
  }

  public registerOnChange(fn) {
    this.onChange = fn;
  }
  public registerOnTouched(fn) {
    this.onTouch = fn;
  }
}

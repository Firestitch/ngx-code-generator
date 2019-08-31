import {
  Component, forwardRef,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { capitalize } from '@angular-devkit/core/src/utils/strings';


@Component({
  selector: 'app-enum-builder',
  templateUrl: './enum-builder.component.html',
  styleUrls: [
    './enum-builder.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnumBuilderComponent),
      multi: true
    }
  ]
})
export class EnumBuilderComponent implements OnInit, ControlValueAccessor {

  public items = [];

  public onChange: any = () => {};
  public onTouch: any = () => {};

  constructor() {}

  public ngOnInit() {}

  public writeValue(value) {
    this.items = value;
    this.onChange(value);
    this.onTouch(value);
  }

  public moreItems() {
    this.items.push({
      name: '',
      value: '',
    });
  }

  public removeItem(item) {
    const itemIndex = this.items.indexOf(item);

    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1);
    }
  }

  public capitalizeName(item) {
    item.name = capitalize(item.name);

    if (!item.value && item.name) {
      item.value = item.name.toLowerCase();
    }
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

}

import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { upperFirst } from 'lodash-es';
import { camelCase } from 'camel-case';

@Component({
  selector: 'app-enum-builder',
  templateUrl: './enum-builder.component.html',
  styleUrls: ['./enum-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnumBuilderComponent),
      multi: true,
    },
  ],
})
export class EnumBuilderComponent implements ControlValueAccessor {
  
  @Input() public const = true;
  
  public items = [];  

  public onChange: (value) => void;
  public onTouch: (value) => void;

  public writeValue(value) {
    this.items = value;
  }

  public moreItems(value) {
    if( 
        !value ||
        (value === 'value' && !this.const) ||
        (value === 'text' && this.const)
      ) {
      this.items.push({
        name: '',
        value: '',
      });
    }
  }

  public removeItem(item) {
    const itemIndex = this.items.indexOf(item);

    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1);
    }
  }

  public underscoreName(item) {
    if (!item.value && item.name) {
      item.value = camelCase(item.name);
    }

    item.name = upperFirst(item.name);
    item.text = upperFirst(item.name);
  }

  public registerOnChange(fn) {
    this.onChange = fn;
  }
  public registerOnTouched(fn) {
    this.onTouch = fn;
  }
}

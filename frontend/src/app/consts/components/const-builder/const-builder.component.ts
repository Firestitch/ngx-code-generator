import {
  Component, EventEmitter, forwardRef, Input, OnChanges,
  OnInit, Output, SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConstService } from '../../services';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-const-builder',
  templateUrl: './const-builder.component.html',
  styleUrls: [
    './const-builder.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConstBuilderComponent),
      multi: true
    }
  ]
})
export class ConstBuilderComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input()
  public enum = null;

  @Output()
  public enumDataChange = new EventEmitter();
  public items = [];
  public loading = false;
  public constValue = null;

  public onChange: any = () => {};
  public onTouch: any = () => {};

  private _enumData = null;

  constructor(public constsService: ConstService) {}

  get enumData() {
    return this._enumData;
  }

  set enumData(value) {
    this._enumData = value;
    this.enumDataChange.emit(value);
  }

  public ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.enum) {
        if (changes.enum.currentValue) {
          this.loadEnumDetails();
        } else {
          this.items = [];
          this.enumData = null;
        }
    }
  }

  public loadEnumDetails() {
    this.constsService.getEnumDetails(this.enum.enumFullPath)
      .pipe(
        delay(100) // crutch
      )
      .subscribe((resource) => {
        this.enumData = resource;

        this.items = [];
        this.enumData.members.forEach((member, index) => {
          this.items.push(member);

          this.constValue[index] = member;
        });

        this.writeValue(this.constValue);
      });
  }

  public writeValue(value) {
    this.constValue = value;

    this.onChange(value);
    this.onTouch(value);
  }

  public setItemValue(value, index) {
    this.constValue[index] = value.target.value;

    this.writeValue(this.constValue);
  }

  public itemsTrackByFn(index, item) {
    return index;
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

}

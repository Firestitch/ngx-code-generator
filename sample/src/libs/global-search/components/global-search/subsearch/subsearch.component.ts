import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';


@Component({
  selector: 'app-subsearch',
  templateUrl: './subsearch.component.html',
  styleUrls: ['./subsearch.component.scss']
})
export class SubsearchComponent implements OnInit {

  @Input() defaultQuery: any = {};

  @Input() public selected: string = null;
  @Input() searchObjectClasses = [];

  @Output() public select = new EventEmitter<string>();

  // public hideFilter = false;

  constructor() { }

  public ngOnInit() {
  }

  public onSelect(value: string) {
    this.selected = value;
   // const selectedFilterItems = find(this.config.groups, { name: this.selected }).items;

    // Impossible to change filters and not loose subscriptions
    // this.hideFilter = true;
   // setTimeout(() => {
      // this.filterConfig.items = this._fillDefaultFilters(selectedFilterItems);
      // this.hideFilter = false;
    this.select.emit(this.selected);
    // });
  // }
  }

  // private _fillDefaultFilters(items) {
  //   forEach(items, item => {
  //     if (this.defaultQuery[item.name]) {
  //       item.default = this.defaultQuery[item.name];
  //     } else {
  //       item.default = item.type === ItemType.AutoCompleteChips || item.multiple ? [] : null;
  //     }
  //   });
  //   return items;
  // }

}

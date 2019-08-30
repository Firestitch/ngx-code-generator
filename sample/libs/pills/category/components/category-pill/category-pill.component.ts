import { Component, Input } from '@angular/core';

import { Category } from '@app/shared/interfaces/category';
import { Object } from 'app/shared/interfaces';


@Component({
  selector: 'app-category-pill',
  templateUrl: './category-pill.component.html',
  styleUrls: ['./category-pill.component.scss']
})
export class CategoryPillComponent {

  public name = '';
  public icon = '';
  public color = '';

  @Input('category')
  set Category(category: Category) {
    if (!category) {
      return;
    }
    this.color = category.color;
    this.icon = category.icon;
    this.name = category.name;
  };

  @Input('object')
  set object(object: Object) {
    if (!object) {
      return;
    }
    this.color = object.meta.color;
    this.icon = object.meta.icon;
    this.name = object.name;
  };

  @Input() public size = 30;
}

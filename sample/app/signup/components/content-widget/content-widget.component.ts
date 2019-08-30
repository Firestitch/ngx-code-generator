import {Component, Input, OnDestroy} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContentData } from '@app/core';


@Component({
  selector: 'app-content-widget',
  templateUrl: 'content-widget.component.html',
  styleUrls: ['content-widget.component.scss']
})
export class ContentWidgetComponent implements OnDestroy {

  public content;

  private destroy$ = new Subject();

  @Input('tag') set tagTag(value) {
    this._contentData.gets({ tag: value })
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((content_widgets) => {
      const content_widget = content_widgets.pop();

      if (content_widget) {
        this.content = content_widget.content;
      }
    })
  };

  public constructor(private _contentData: ContentData) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FieldData } from '@app/core';
import { Doc } from '@libs/drawers/doc-drawer/interfaces';

@Component({
  selector: 'app-doc-preview',
  templateUrl: './doc-preview.component.html',
  styleUrls: ['./doc-preview.component.scss']
})
export class DocPreviewComponent implements OnInit, OnDestroy {
  @Input() public doc: Doc = null;

  public config: { fields: any };

  private _destroy$ = new Subject();

  constructor(private _fieldData: FieldData) {
  }

  public ngOnInit() {
    if (this.doc.object_version_id) {
      this._fieldData.getValues(this.doc.id, this.doc.id, this.doc.object_version_id)
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(
          (data) => {
          this.config = { fields: data };
        }
      );
    }
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}

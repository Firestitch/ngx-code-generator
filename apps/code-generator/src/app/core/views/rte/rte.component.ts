import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';


@Component({
  templateUrl: './rte.component.html',
  styleUrls: ['./rte.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RteComponent implements OnInit  {

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._initTitle();
  }

  private _initTitle(): void {
  }

}

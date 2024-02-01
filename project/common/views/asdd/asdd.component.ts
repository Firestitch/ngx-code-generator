import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';

import { FsNavService } from '@firestitch/nav';



@Component({
  templateUrl: './asdd.component.html',
  styleUrls: ['./asdd.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsddComponent implements OnInit  {

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _navService: FsNavService,
  ) {}

  public ngOnInit(): void {
    this._initTitle();
  }

  private _initTitle(): void {
    this._navService.setTitle('Asdd');
  }

}

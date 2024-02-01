import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';

import { FsNavService } from '@firestitch/nav';



@Component({
  templateUrl: './sdfsdf.component.html',
  styleUrls: ['./sdfsdf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdfsdfComponent implements OnInit  {

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _navService: FsNavService,
  ) {}

  public ngOnInit(): void {
    this._initTitle();
  }

  private _initTitle(): void {
    this._navService.setTitle('Sdfsdf');
  }

}

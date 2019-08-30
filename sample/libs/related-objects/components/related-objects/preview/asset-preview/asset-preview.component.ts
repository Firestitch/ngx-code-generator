import { Component, Input, } from '@angular/core';
import { Asset } from '@app/shared/interfaces';


@Component({
  selector: 'app-asset-preview',
  templateUrl: './asset-preview.component.html',
  styleUrls: ['./asset-preview.component.scss']
})
export class AssetPreviewComponent {
  @Input() public asset: Asset = null;

  constructor() {
  }
}

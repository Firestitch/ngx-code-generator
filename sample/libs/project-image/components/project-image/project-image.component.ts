import { Component, Input, OnInit } from '@angular/core';
import { Project } from '@app/shared/interfaces';


@Component({
  selector: 'app-project-image',
  templateUrl: `./project-image.component.html`,
  styleUrls: ['./project-image.component.scss']
})
export class ProjectImageComponent implements OnInit {

  @Input() public size = 30;
  @Input() public project: Project = null;

  constructor() { }

  public ngOnInit() {
  }

}

import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-interface-generator-form',
  templateUrl: './interface-generator-form.component.html',
})
export class InterfaceGeneratorFormComponent implements OnInit {

  @ViewChild('moduleForm', { static: true })
  public form: NgForm;

  public services = [];

  public model = {
    module: null,
    model: null,
  };

  constructor(
  ) {}

  public ngOnInit() {

  }

}

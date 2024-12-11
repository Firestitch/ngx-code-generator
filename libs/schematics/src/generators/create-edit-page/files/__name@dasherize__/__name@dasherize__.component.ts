import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { RouteObserver } from '@firestitch/core';
import { FsMessage } from '@firestitch/message';<% if(titledComponent) { %>
import { FsNavService } from '@firestitch/nav';<% } %>
import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { tap } from 'rxjs/operators';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FsFormModule,
    FsSkeletonModule,
  ],
})
export class <%= classify(name) %>Component implements OnInit {

  public <%= camelize(singleModel) %>: any;

  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _cdRef = inject(ChangeDetectorRef);
  private _<%= camelize(serviceName) %> = inject(<%= classify(serviceName) %>);
  private _message = inject(FsMessage);<% if(titledComponent) { %>
  private _navService = inject(FsNavService);<% } %>
  private _routeObserver$ = new RouteObserver(this._route, '<%= camelize(singleModel) %>');

  public ngOnInit(): void {
    this._initRouteObserver();
  }

  public save = () => {
    return this._<%= camelize(serviceName) %>.save(this.<%= camelize(singleModel) %>)
      .pipe(
        tap((<%= camelize(singleModel) %>) => {
          this._message.success('Saved Changes');
          if (this.<%= camelize(singleModel) %>.id) {
            this._routeObserver$.next({
              ...this.<%= camelize(singleModel) %>,
              ...<%= camelize(singleModel) %>,
            });
          } else {
            this._router.navigate(['../', <%= camelize(singleModel) %>.id], { relativeTo: this._route });
          }
        }),
      );
  };<% if(titledComponent) { %>

  private _initTitle(): void {
    if (this.<%= camelize(singleModel) %>.id) {
      this._navService.setTitle(this.<%= camelize(singleModel) %>.name, '<%= capitalize(singleModel)%>');
    } else {
      this._navService.setTitle('Create <%= capitalize(singleModel)%>');
    }
  }<% } %>

  private _initRouteObserver(): void {
    this._routeObserver$
      .pipe(
        takeUntilDestroyed(),
      )
      .subscribe((<%= camelize(singleModel) %>) => {
        this.<%= camelize(singleModel) %> = <%= camelize(singleModel) %> || {};<% if(titledComponent) { %>
        this._initTitle();<% } %>

        this._cdRef.markForCheck();
      });
  }

}

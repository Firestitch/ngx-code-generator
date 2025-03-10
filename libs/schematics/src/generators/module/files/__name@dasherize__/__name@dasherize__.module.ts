import { NgModule } from '@angular/core';<% if (routing) { %>

import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';<% } %>


@NgModule({
  imports: [
    <% if (routing) { %><%= classify(name) %>RoutingModule,<% } %>
  ],
})
export class <%= classify(name) %>Module { }

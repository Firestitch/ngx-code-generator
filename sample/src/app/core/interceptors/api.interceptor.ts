import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';

import { makeInterceptorFactory, RequestInterceptor } from '@firestitch/api';
import { FsStore } from '@firestitch/store';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';


export class ApiInterceptor extends RequestInterceptor {

  constructor(public config, public data, public fsStore: FsStore) {
    super(config, data);
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let url = environment.apiPath.concat(req.url);

    if (environment.platform === 'mobile' && environment.apiDomain) {
      url = ('https://' + environment.apiDomain).concat(url);
    }

    const token = this.fsStore.get('token');
    let headers = req.headers;

    if (token) {
      headers = headers.append('Token', 'Bearer ' + token);
    }

    return next.handle(req.clone({ url: url, headers }));
  }
}

export const ApiInterceptorFactory = makeInterceptorFactory(ApiInterceptor);

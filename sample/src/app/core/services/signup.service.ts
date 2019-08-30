import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';
import { AuthService } from './auth.service';


@Injectable()
export class SignupService {

  constructor(private _fsApi: FsApi,
              private _authService: AuthService) { }

  public postEmail(data, query = {}): Observable<any> {
    return this._authService.processResponse(this._fsApi.post(`signup/email`, data));
  }

  public validatetEmail(email: string): Observable<any> {
    return this._authService.processResponse(this._fsApi.post(`signup/email/validate`, { email: email }));
  }

  public postFacebook(access_token, data: any = {}): Observable<any> {
    data.access_token = access_token;
    return this._authService.processResponse(this._fsApi.post(`signup/facebook`, data));
  }

  public postGoogle(id_token, access_token, data: any = {}): Observable<any> {
    data.id_token = id_token;
    data.access_token = access_token;
    return this._authService.processResponse(this._fsApi.post(`signup/google`, data));
  }
}

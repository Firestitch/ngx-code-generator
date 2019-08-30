import { Injectable } from '@angular/core';

import { FsStore } from '@firestitch/store';
import { isObject } from 'lodash-es';
import { AclPermission } from 'app/shared/enums/acl-permissions.enum';


@Injectable()
export class AclQueryService {

  constructor(
    private _store: FsStore
  ) {}

  public hasPermission(permission, object_id = null, access = null) {

    const permissions = this.getPermissions() || {};
    const existing_permissions = permissions[object_id || ''];

    if (!isObject(existing_permissions)) {
      return false;
    }

    const existing_access = existing_permissions[permission];

    return existing_access && (access === null || existing_access >= access);
  }

  public hasPermissionApp() {
    return this.hasPermission(AclPermission.App);
  }

  public hasPermissionSystem() {
    return this.hasPermission(AclPermission.System);
  }

  public getObjectIds() {

    return Object.keys(this.getPermissions())
    .filter((value) => {
      return value;
    });
  }

  public getPermissions() {
    return this._store.get('permissions');
  }

}

import { Injectable } from '@angular/core';

import { forEach, isArrayLikeObject } from 'lodash-es';

import { indexOf, find, filter } from '@firestitch/common';

import { AclRole } from 'app/shared/interfaces';
import { AclRoleAccesses } from 'app/shared/consts';


@Injectable()
export class AclRoleService {

  public create(data: AclRole = { id: null }) {

    data.permissions = data.permissions || {};

    if (isArrayLikeObject(data.permissions)) {
      data.permissions = {};
    }

    return data;
  }

  public groupPermissions(permissions, groupBy = 'level') {

    const result = [];

    forEach(permissions, permission => {
      const index = indexOf(result, { [groupBy]: permission[groupBy] });
      let data = null;
      if (index === -1) {
        data = {
          category: permission.category,
          [groupBy]: permission[groupBy],
          permissions: []
        };
        result.push(data);
      } else {
        data = result[index];
      }

      if (permission.inherits) {
        data.inherits = true;
        permission.inheritsLength = Object.keys(permission.inherits).length;
        permission.inheritedPermissions = [];
        permission.inheritedPermissionsTooltip = '';
        for (const key in permission.inherits) {
          if (!permission.inherits[key]) {
            continue;
          }
          const item = find(permissions, { value: key });
          if (item) {
            permission.inheritedPermissions.push(item);

            permission.inheritedPermissionsTooltip
              += item.name + ' ' + AclRoleAccesses.find(access => access.value === permission.inherits[item.value]).name + `\n`;
          }
        }
      }
      data.permissions.push(permission);
    });

    return result;
  }

  public getAccess(permissions, role: AclRole) {
    const result: any = [];
    role.permissions = role.permissions || {};

    const data = filter(permissions, { level: role.level });
    forEach(data, permission => {
        result.push(role.permissions[permission.value] ? role.permissions[permission.value] : 0);
    });

    return result.length === 1 ? result[0] : Math.max(...result);
  }

  public getInheritsCount(permissions, role: AclRole) {
    let result: number = null;

    const data = find(permissions, { level: role.level });

    if (data && data.inherits) {
      result = Object.keys(data.inherits).length
    }

    return result;
  }

}

import { Object } from 'app/shared/interfaces/';
import { filter } from 'lodash-es';
import { AuditType } from '../enums';

export class AuditModel {

  // from server original data
  public id: number;
  public actor_account: Account;
  public actor_account_id: number;
  public date: Date;
  public description: string;
  public audit_objects: any[];
  public objects: any = {};
  public meta: any[] = [];
  public object: Object;
  public object_class: string;
  public object_id: number;
  public type: any;

  private _meta: any;

  constructor(data: any = {}) {
    this._meta = data.meta;
    this.id = data.id || null;
    this.actor_account = data.actor_account || null;
    this.actor_account_id = data.actor_account_id || null;
    this.audit_objects = data.audit_objects || [];
    this.objects = {};
    this.date = new Date(data.date);
    this.description = data.description || null;
    this.object = data.object || null;
    this.object_id = data.object_id || null;
    this.type = data.type || 'change';

    this.init();
  }

  private init() {

    Object.keys(this._meta || {}).map(name => {
      let verb = '';
      switch (this.type) {
        case AuditType.Create: {
          verb = 'created';
        } break;
        case AuditType.Remove: {
          verb = 'deleted';
        } break;
        case AuditType.Relate: {
          verb = 'related';
        } break;
        case AuditType.Unrelate: {
            verb = 'unrelated';
        } break;
        case AuditType.Change: {
          verb = 'changed';
        } break;
        case AuditType.Add: {
          verb = 'added';
        } break;
      }

      let description = '';
      switch (name) {
        case 'status_id': {
          description = 'Status';
        } break;
        case 'priority': {
          description = 'Priority';
        } break;
        case 'assigned_account_id': {
          description = 'Assigned';
        } break;
        case 'comment_id': {
          description = 'comment';
        } break;
        case 'type_id': {
          description = 'Type';
        } break;
        case 'due_date': {
          description = 'Due Date';
        } break;
        case 'category_id': {
          description = 'Category';
        } break;
        case 'content': {
          description = 'Description';
        } break;
        case 'name': {
          description = 'Name';
        } break;
      }

      const meta: any = { name: name,
                          value: this._meta[name],
                          verb: verb,
                          description: description };

      const audit_object = filter(this.audit_objects, { name: name })[0];
      if (audit_object) {
        meta.object = audit_object.object;
      }
      this.meta.push(meta);
    });
  }
}

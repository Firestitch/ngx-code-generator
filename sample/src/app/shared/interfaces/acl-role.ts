export interface AclRole {
  id: number;
  environment_id?: number;
  name?: string;
  description?: string;
  state?: string;
  reference?: string;
  all_permissions?: number;
  role?: string;
  level?: string;
  permissions?: any;
  access?: string;
  protected?: boolean;
}

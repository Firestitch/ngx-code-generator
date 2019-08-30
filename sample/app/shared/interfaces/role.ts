export interface Role {
  id: number;
  role?: string;
  name?: string;
  level?: string;
  permissions?: string;
  access?: string;
  all_permissions?: boolean;
  protected?: boolean;
  state?: string;
}

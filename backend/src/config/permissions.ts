import { ROLES, type Role } from "../constants/roles.js";

type Permission =
  | "users:manage"
  | "articles:create"
  | "articles:read"
  | "articles:update:any"
  | "articles:update:own"
  | "articles:review"
  | "articles:publish"
  | "categories:manage"
  | "comments:moderate"
  | "ads:manage"
  | "settings:manage"
  | "media:manage"
  | "notifications:manage"
  | "homepage:manage"
  | "backup:manage"
  | "logs:view"
  | "subscribers:manage";

type PermissionMap = Record<Role, Permission[]>;

export const rolePermissions: PermissionMap = {
  [ROLES.SUPER_ADMIN]: [
    "users:manage",
    "articles:create",
    "articles:read",
    "articles:update:any",
    "articles:review",
    "articles:publish",
    "categories:manage",
    "comments:moderate",
    "ads:manage",
    "settings:manage",
    "media:manage",
    "notifications:manage",
    "homepage:manage",
    "backup:manage",
    "logs:view",
    "subscribers:manage"
  ],
  [ROLES.ADMIN]: [
    "articles:create",
    "articles:read",
    "articles:update:any",
    "articles:review",
    "articles:publish",
    "categories:manage",
    "comments:moderate",
    "ads:manage",
    "settings:manage",
    "media:manage",
    "notifications:manage",
    "homepage:manage",
    "logs:view",
    "subscribers:manage"
  ],
  [ROLES.EDITOR]: [
    "articles:create",
    "articles:read",
    "articles:update:any",
    "articles:review",
    "categories:manage",
    "comments:moderate",
    "media:manage",
    "homepage:manage"
  ],
  [ROLES.REPORTER]: [
    "articles:create",
    "articles:read",
    "articles:update:own",
    "media:manage"
  ],
  [ROLES.AUTHOR]: [
    "articles:create",
    "articles:read",
    "articles:update:own"
  ],
  [ROLES.SUBSCRIBER]: ["articles:read"]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export type { Permission };

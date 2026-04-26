import { listPermissionsForRole } from "../config/permissions.js";
import type { UserDocument } from "../models/user.model.js";

export function serializeAuthUser(user: UserDocument) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    locale: user.locale,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    isActive: user.isActive,
    is2FAEnabled: user.is2FAEnabled,
    lastLoginAt: user.lastLoginAt,
    permissions: listPermissionsForRole(user.role)
  };
}

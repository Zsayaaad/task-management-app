import { Role } from "@prisma/client";

const VALID_ROLES: readonly Role[] = Object.values(Role);

export function parseRole(value: unknown): Role {
  if (
    typeof value === "string" &&
    (VALID_ROLES as readonly string[]).includes(value as Role)
  ) {
    return value as Role;
  }

  // If it null | undefined return role=member
  return Role.MEMBER;
}

export function isAdmin(role: Role): boolean {
  return role === Role.ADMIN;
}

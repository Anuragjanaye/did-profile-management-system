/**
 * Organizations feature — scaffold only (v1).
 * Organizations are out of scope for v1 per approved spec.
 * This file exists only to reserve the type namespace.
 * Full implementation is deferred to v2.
 */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

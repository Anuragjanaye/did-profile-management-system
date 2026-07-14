/**
 * Profile feature — types scaffold.
 * Full implementation in Phase 4.
 */

export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  ORGANIZATION = "ORGANIZATION",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  FAILED = "FAILED",
}

export enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatarCID: string | null;
  bannerCID: string | null;
  profileScore: number;
  verificationStatus: VerificationStatus;
  visibility: Visibility;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  profileId: string;
  name: string;
  level: SkillLevel;
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number | null;
}

export interface Experience {
  id: string;
  profileId: string;
  company: string;
  role: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
}

export interface Certificate {
  id: string;
  profileId: string;
  title: string;
  issuer: string;
  issueDate: Date;
  credentialURL: string | null;
  cid: string | null;
}

export interface SocialLink {
  id: string;
  profileId: string;
  platform: "GITHUB" | "LINKEDIN" | "TWITTER" | "PORTFOLIO" | "WEBSITE" | "OTHER";
  url: string;
}

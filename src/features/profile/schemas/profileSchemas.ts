import { z } from "zod";
import { SkillLevel, SocialPlatform, Visibility } from "@prisma/client";

/**
 * Zod validation schema for core profile editing/updates.
 */
export const profileUpdateSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50),
  headline: z.string().max(100).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  website: z.string().url("Invalid website URL").or(z.literal("")).optional().nullable(),
  visibility: z.nativeEnum(Visibility).default(Visibility.PUBLIC),
});

/**
 * Zod validation schema for adding/updating skills.
 */
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(50),
  level: z.nativeEnum(SkillLevel).default(SkillLevel.BEGINNER),
});

/**
 * Zod validation schema for adding/updating education records.
 */
export const educationSchema = z
  .object({
    institution: z.string().min(2, "Institution name must be at least 2 characters").max(100),
    degree: z.string().min(2, "Degree name is required").max(100),
    fieldOfStudy: z.string().min(2, "Field of study is required").max(100),
    startYear: z.number().int().min(1900).max(new Date().getFullYear()),
    endYear: z.number().int().min(1900).max(2100).optional().nullable(),
  })
  .refine((data) => !data.endYear || data.endYear >= data.startYear, {
    message: "End year must be after or equal to start year",
    path: ["endYear"],
  });

/**
 * Zod validation schema for adding/updating professional experience records.
 */
export const experienceSchema = z
  .object({
    company: z.string().min(2, "Company name must be at least 2 characters").max(100),
    role: z.string().min(2, "Role is required").max(100),
    description: z.string().max(1000).optional().nullable(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional().nullable(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  });

/**
 * Zod validation schema for social link updates.
 */
export const socialLinkSchema = z.object({
  platform: z.nativeEnum(SocialPlatform),
  url: z.string().url("Invalid social platform URL"),
});

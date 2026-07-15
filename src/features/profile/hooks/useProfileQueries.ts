"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getProfileByAddressAction,
  upsertProfileAction,
} from "@/features/profile/actions/profileActions";
import { addSkillAction, deleteSkillAction } from "@/features/profile/actions/skillActions";
import {
  addExperienceAction,
  deleteExperienceAction,
} from "@/features/profile/actions/experienceActions";
import {
  addEducationAction,
  deleteEducationAction,
} from "@/features/profile/actions/educationActions";
import {
  addSocialLinkAction,
  deleteSocialLinkAction,
} from "@/features/profile/actions/socialActions";

// Unique query keys for caching profile domains
export const profileKeys = {
  all: ["profile"] as const,
  byAddress: (address: string) => [...profileKeys.all, address] as const,
};

/**
 * Hook to retrieve user profile details by wallet address.
 */
export function useProfile(walletAddress: string | undefined) {
  return useQuery({
    queryKey: profileKeys.byAddress(walletAddress ?? ""),
    queryFn: async () => {
      if (!walletAddress) return null;
      const res = await getProfileByAddressAction(walletAddress);
      if (!res.success) {
        throw new Error(res.error?.message || "Failed to fetch profile");
      }
      return res.data;
    },
    enabled: !!walletAddress,
  });
}

/**
 * Hook to handle profile upserts (creation/updates).
 */
export function useUpdateProfile(walletAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await upsertProfileAction(data);
      if (!res.success) {
        throw new Error(res.error?.message || "Failed to update profile");
      }
      return res.data;
    },
    onSuccess: () => {
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byAddress(walletAddress) });
      }
      toast.success("Profile details updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

/**
 * Hook to add a skill.
 */
export function useAddSkill(walletAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await addSkillAction(data);
      if (!res.success) throw new Error(res.error?.message || "Failed to add skill");
      return res.data;
    },
    onSuccess: () => {
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byAddress(walletAddress) });
      }
      toast.success("Skill added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to delete a skill.
 */
export function useDeleteSkill(walletAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: string) => {
      const res = await deleteSkillAction(skillId);
      if (!res.success) throw new Error(res.error?.message || "Failed to delete skill");
      return res;
    },
    onSuccess: () => {
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byAddress(walletAddress) });
      }
      toast.success("Skill removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to add experience.
 */
export function useAddExperience(walletAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await addExperienceAction(data);
      if (!res.success) throw new Error(res.error?.message || "Failed to add experience");
      return res.data;
    },
    onSuccess: () => {
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byAddress(walletAddress) });
      }
      toast.success("Experience record added");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to delete experience.
 */
export function useDeleteExperience(walletAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expId: string) => {
      const res = await deleteExperienceAction(expId);
      if (!res.success) throw new Error(res.error?.message || "Failed to delete experience");
      return res;
    },
    onSuccess: () => {
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byAddress(walletAddress) });
      }
      toast.success("Experience record removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to add education.
 */
export function useAddEducation(walletAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await addEducationAction(data);
      if (!res.success) throw new Error(res.error?.message || "Failed to add education");
      return res.data;
    },
    onSuccess: () => {
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byAddress(walletAddress) });
      }
      toast.success("Education record added");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to delete education.
 */
export function useDeleteEducation(walletAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eduId: string) => {
      const res = await deleteEducationAction(eduId);
      if (!res.success) throw new Error(res.error?.message || "Failed to delete education");
      return res;
    },
    onSuccess: () => {
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byAddress(walletAddress) });
      }
      toast.success("Education record removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to add social link.
 */
export function useAddSocialLink(walletAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await addSocialLinkAction(data);
      if (!res.success) throw new Error(res.error?.message || "Failed to add social link");
      return res.data;
    },
    onSuccess: () => {
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byAddress(walletAddress) });
      }
      toast.success("Social link added");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to delete social link.
 */
export function useDeleteSocialLink(walletAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      const res = await deleteSocialLinkAction(linkId);
      if (!res.success) throw new Error(res.error?.message || "Failed to delete social link");
      return res;
    },
    onSuccess: () => {
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: profileKeys.byAddress(walletAddress) });
      }
      toast.success("Social link removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

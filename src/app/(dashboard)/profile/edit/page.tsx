"use client";

import { useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Link as LinkIcon,
  Loader2,
  Brain,
} from "lucide-react";
import {
  useProfile,
  useUpdateProfile,
  useAddSkill,
  useDeleteSkill,
  useAddExperience,
  useDeleteExperience,
  useAddEducation,
  useDeleteEducation,
  useAddSocialLink,
  useDeleteSocialLink,
} from "@/features/profile/hooks/useProfileQueries";
import type { ProfileWithRelations } from "@/features/profile/repositories/profileRepository";

// Feature Tab Components
import { BasicInfoTab } from "@/features/profile/components/BasicInfoTab";
import { SkillsTab } from "@/features/profile/components/SkillsTab";
import { ExperienceTab } from "@/features/profile/components/ExperienceTab";
import { EducationTab } from "@/features/profile/components/EducationTab";
import { SocialsTab } from "@/features/profile/components/SocialsTab";
import { AiGuidanceTab } from "@/features/profile/components/AiGuidanceTab";

type ProfileTab = "info" | "skills" | "experience" | "education" | "socials" | "ai";

function ProfileEditContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const walletAddress = session?.user?.walletAddress;
  const { data: rawProfile, isLoading } = useProfile(walletAddress);
  const profile = rawProfile as ProfileWithRelations | null | undefined;

  // Mutation hooks
  const updateProfileMutation = useUpdateProfile(walletAddress);
  const addSkillMutation = useAddSkill(walletAddress);
  const deleteSkillMutation = useDeleteSkill(walletAddress);
  const addExperienceMutation = useAddExperience(walletAddress);
  const deleteExperienceMutation = useDeleteExperience(walletAddress);
  const addEducationMutation = useAddEducation(walletAddress);
  const deleteEducationMutation = useDeleteEducation(walletAddress);
  const addSocialLinkMutation = useAddSocialLink(walletAddress);
  const deleteSocialLinkMutation = useDeleteSocialLink(walletAddress);

  // Active section tab state
  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    tabParam && ["info", "skills", "experience", "education", "socials", "ai"].includes(tabParam)
      ? (tabParam as ProfileTab)
      : "info"
  );

  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (
      tabParam &&
      ["info", "skills", "experience", "education", "socials", "ai"].includes(tabParam)
    ) {
      setActiveTab(tabParam as ProfileTab);
    }
  }

  if (isLoading || status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleAddRecommendedSkill = (skillName: string) => {
    addSkillMutation.mutate({ name: skillName, level: "INTERMEDIATE" });
  };

  const tabs = [
    { id: "info" as const, label: "Basic Info", icon: User },
    { id: "skills" as const, label: "Skills", icon: Wrench },
    { id: "experience" as const, label: "Work Experience", icon: Briefcase },
    { id: "education" as const, label: "Education", icon: GraduationCap },
    { id: "socials" as const, label: "Social Links", icon: LinkIcon },
    { id: "ai" as const, label: "AI Guidance", icon: Brain },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Keep your on-chain CV updated. All changes are stored securely.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Tab navigation */}
        <nav
          aria-label="Profile section navigation"
          className="flex flex-row gap-2 overflow-x-auto pb-2 lg:col-span-3 lg:flex-col lg:pb-0"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "text-primary border border-[#2563EB]/25 bg-[#2563EB]/10"
                    : "text-muted-foreground hover:bg-surface-elevated/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Content Panels */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "info" && (
                <BasicInfoTab
                  profile={profile}
                  walletAddress={walletAddress}
                  updateProfileMutation={updateProfileMutation}
                />
              )}

              {activeTab === "skills" && (
                <SkillsTab
                  profile={profile}
                  addSkillMutation={addSkillMutation}
                  deleteSkillMutation={deleteSkillMutation}
                />
              )}

              {activeTab === "experience" && (
                <ExperienceTab
                  profile={profile}
                  addExperienceMutation={addExperienceMutation}
                  deleteExperienceMutation={deleteExperienceMutation}
                />
              )}

              {activeTab === "education" && (
                <EducationTab
                  profile={profile}
                  addEducationMutation={addEducationMutation}
                  deleteEducationMutation={deleteEducationMutation}
                />
              )}

              {activeTab === "socials" && (
                <SocialsTab
                  profile={profile}
                  addSocialLinkMutation={addSocialLinkMutation}
                  deleteSocialLinkMutation={deleteSocialLinkMutation}
                />
              )}

              {activeTab === "ai" && (
                <AiGuidanceTab
                  profile={profile}
                  onAddRecommendedSkill={handleAddRecommendedSkill}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** Provides structured edit views and AI guidance for user decentralized identities. */
export default function ProfileEditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ProfileEditContent />
    </Suspense>
  );
}

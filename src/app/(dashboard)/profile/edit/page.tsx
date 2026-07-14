"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Link as LinkIcon,
  Plus,
  Trash2,
  Loader2,
  Save,
  MapPin,
  Globe,
  PlusCircle,
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
  profileKeys,
} from "@/features/profile/hooks/useProfileQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProfileWithRelations } from "@/features/profile/repositories/profileRepository";
import { FileUpload } from "@/features/upload/components/FileUpload";

// Let's design premium forms directly with standard Tailwind inputs to prevent any missing component errors.
export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

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

  // Tabs / Active section
  const [activeTab, setActiveTab] = useState<
    "info" | "skills" | "experience" | "education" | "socials"
  >("info");

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    displayName: "",
    headline: "",
    bio: "",
    location: "",
    website: "",
  });

  const [skillInput, setSkillInput] = useState({ name: "", level: "BEGINNER" });
  const [educationInput, setEducationInput] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: new Date().getFullYear(),
    endYear: "",
  });
  const [experienceInput, setExperienceInput] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [socialInput, setSocialInput] = useState({ platform: "GITHUB", url: "" });

  // Sync basic info state once profile is loaded
  const hasSyncedRef = useState(false);
  if (profile && !hasSyncedRef[0]) {
    setBasicInfo({
      displayName: profile.displayName || "",
      headline: profile.headline || "",
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
    });
    hasSyncedRef[1](true);
  }

  if (isLoading || status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(basicInfo);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.name.trim()) return;
    addSkillMutation.mutate(skillInput, {
      onSuccess: () => setSkillInput({ name: "", level: "BEGINNER" }),
    });
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...educationInput,
      startYear: Number(educationInput.startYear),
      endYear: educationInput.endYear ? Number(educationInput.endYear) : null,
    };
    addEducationMutation.mutate(payload, {
      onSuccess: () =>
        setEducationInput({
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startYear: new Date().getFullYear(),
          endYear: "",
        }),
    });
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...experienceInput,
      endDate: experienceInput.endDate || null,
    };
    addExperienceMutation.mutate(payload, {
      onSuccess: () =>
        setExperienceInput({
          company: "",
          role: "",
          description: "",
          startDate: "",
          endDate: "",
        }),
    });
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialInput.url.trim()) return;
    addSocialLinkMutation.mutate(socialInput, {
      onSuccess: () => setSocialInput({ platform: "GITHUB", url: "" }),
    });
  };

  const tabs = [
    { id: "info" as const, label: "Basic Info", icon: User },
    { id: "skills" as const, label: "Skills", icon: Wrench },
    { id: "experience" as const, label: "Work Experience", icon: Briefcase },
    { id: "education" as const, label: "Education", icon: GraduationCap },
    { id: "socials" as const, label: "Social Links", icon: LinkIcon },
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
              {/* ──────────────── 1. Basic Info Section ──────────────── */}
              {activeTab === "info" && (
                <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      {/* Banner and Avatar Previews */}
                      <div className="relative mb-6">
                        {/* Banner preview */}
                        <div className="border-border/30 relative h-32 w-full overflow-hidden rounded-lg border bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]">
                          {profile?.bannerCID && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`https://gateway.pinata.cloud/ipfs/${profile.bannerCID}`}
                              alt="Profile Banner"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        {/* Avatar preview overlap */}
                        <div className="border-card bg-surface absolute -bottom-8 left-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-lg">
                          {profile?.avatarCID ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`https://gateway.pinata.cloud/ipfs/${profile.avatarCID}`}
                              alt="Profile Avatar"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="text-muted-foreground h-8 w-8" />
                          )}
                        </div>
                      </div>

                      {/* Upload widgets grid */}
                      <div className="grid gap-6 pt-6 pb-2 sm:grid-cols-2">
                        <FileUpload
                          type="avatar"
                          label="Upload Profile Avatar"
                          acceptLabel="PNG, JPG, WEBP up to 2MB"
                          onUploadSuccess={() => {
                            if (walletAddress) {
                              queryClient.invalidateQueries({
                                queryKey: profileKeys.byAddress(walletAddress),
                              });
                            }
                          }}
                        />
                        <FileUpload
                          type="banner"
                          label="Upload Profile Banner"
                          acceptLabel="PNG, JPG, WEBP up to 5MB"
                          onUploadSuccess={() => {
                            if (walletAddress) {
                              queryClient.invalidateQueries({
                                queryKey: profileKeys.byAddress(walletAddress),
                              });
                            }
                          }}
                        />
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
                            Display Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={basicInfo.displayName}
                            onChange={(e) =>
                              setBasicInfo({ ...basicInfo, displayName: e.target.value })
                            }
                            className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary focus:ring-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none focus:ring-1"
                            placeholder="e.g. Alice Vance"
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
                            Professional Headline
                          </label>
                          <input
                            type="text"
                            value={basicInfo.headline}
                            onChange={(e) =>
                              setBasicInfo({ ...basicInfo, headline: e.target.value })
                            }
                            className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary focus:ring-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none focus:ring-1"
                            placeholder="e.g. Senior Web3 Engineer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
                          Biography
                        </label>
                        <textarea
                          rows={4}
                          value={basicInfo.bio}
                          onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
                          className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary focus:ring-primary w-full resize-none rounded-lg border px-3.5 py-2 text-sm outline-none focus:ring-1"
                          placeholder="Tell us about your background, projects, and passions..."
                        />
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
                            Location
                          </label>
                          <div className="relative">
                            <MapPin className="text-muted absolute top-2.5 left-3 h-4 w-4" />
                            <input
                              type="text"
                              value={basicInfo.location}
                              onChange={(e) =>
                                setBasicInfo({ ...basicInfo, location: e.target.value })
                              }
                              className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary focus:ring-primary w-full rounded-lg border py-2 pr-3.5 pl-10 text-sm outline-none focus:ring-1"
                              placeholder="e.g. San Francisco, CA"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
                            Website Link
                          </label>
                          <div className="relative">
                            <Globe className="text-muted absolute top-2.5 left-3 h-4 w-4" />
                            <input
                              type="url"
                              value={basicInfo.website}
                              onChange={(e) =>
                                setBasicInfo({ ...basicInfo, website: e.target.value })
                              }
                              className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary focus:ring-primary w-full rounded-lg border py-2 pr-3.5 pl-10 text-sm outline-none focus:ring-1"
                              placeholder="e.g. https://alicevance.dev"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 text-sm font-medium text-white transition-all hover:bg-[#2563EB]/90 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                        >
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* ──────────────── 2. Skills Section ──────────────── */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  {/* Add skill card */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Add Skill</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddSkill} className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Solidity, Next.js, Rust"
                            value={skillInput.name}
                            onChange={(e) => setSkillInput({ ...skillInput, name: e.target.value })}
                            className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                          />
                        </div>
                        <div className="w-full sm:w-48">
                          <select
                            value={skillInput.level}
                            onChange={(e) =>
                              setSkillInput({ ...skillInput, level: e.target.value })
                            }
                            className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                          >
                            <option value="BEGINNER">Beginner</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="ADVANCED">Advanced</option>
                            <option value="EXPERT">Expert</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          disabled={addSkillMutation.isPending}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white hover:bg-[#2563EB]/90 disabled:opacity-50"
                        >
                          {addSkillMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          <span>Add</span>
                        </button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Skills List */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Current Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {profile?.skills && profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {profile.skills.map((skill) => (
                            <div
                              key={skill.id}
                              className="border-border/80 bg-surface/80 inline-flex items-center gap-2 rounded-lg border py-1 pr-1 pl-3 text-sm font-medium"
                            >
                              <span>{skill.name}</span>
                              <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                                {skill.level}
                              </Badge>
                              <button
                                onClick={() => deleteSkillMutation.mutate(skill.id)}
                                disabled={deleteSkillMutation.isPending}
                                className="hover:bg-destructive/10 flex h-5 w-5 items-center justify-center rounded-md transition-colors hover:text-[#EF4444]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No skills added yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ──────────────── 3. Experience Section ──────────────── */}
              {activeTab === "experience" && (
                <div className="space-y-6">
                  {/* Add experience */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Add Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddExperience} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                              Company Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={experienceInput.company}
                              onChange={(e) =>
                                setExperienceInput({ ...experienceInput, company: e.target.value })
                              }
                              className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                              placeholder="e.g. Decentralized Labs"
                            />
                          </div>
                          <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                              Professional Role *
                            </label>
                            <input
                              type="text"
                              required
                              value={experienceInput.role}
                              onChange={(e) =>
                                setExperienceInput({ ...experienceInput, role: e.target.value })
                              }
                              className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                              placeholder="e.g. Senior Smart Contract Auditor"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={experienceInput.startDate}
                              onChange={(e) =>
                                setExperienceInput({
                                  ...experienceInput,
                                  startDate: e.target.value,
                                })
                              }
                              className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                              End Date (Leave blank if current job)
                            </label>
                            <input
                              type="date"
                              value={experienceInput.endDate}
                              onChange={(e) =>
                                setExperienceInput({ ...experienceInput, endDate: e.target.value })
                              }
                              className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                            Role Description
                          </label>
                          <textarea
                            rows={3}
                            value={experienceInput.description}
                            onChange={(e) =>
                              setExperienceInput({
                                ...experienceInput,
                                description: e.target.value,
                              })
                            }
                            className="border-border bg-background text-foreground focus:border-primary w-full resize-none rounded-lg border px-3.5 py-2 text-sm outline-none"
                            placeholder="Summarize accomplishments, projects worked on, and stack used..."
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={addExperienceMutation.isPending}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white hover:bg-[#2563EB]/90 disabled:opacity-50"
                          >
                            {addExperienceMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <PlusCircle className="h-4 w-4" />
                            )}
                            Add Experience
                          </button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Experience List */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Experience History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profile?.experience &&
                      profile.experience.filter((e) => !e.deletedAt).length > 0 ? (
                        profile.experience
                          .filter((e) => !e.deletedAt)
                          .map((exp) => (
                            <div
                              key={exp.id}
                              className="border-border/40 flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                            >
                              <div>
                                <h4 className="text-foreground font-semibold">{exp.role}</h4>
                                <p className="text-muted-foreground text-sm">{exp.company}</p>
                                {exp.description && (
                                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => deleteExperienceMutation.mutate(exp.id)}
                                disabled={deleteExperienceMutation.isPending}
                                className="hover:bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-lg hover:text-[#EF4444]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No experience history added yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ──────────────── 4. Education Section ──────────────── */}
              {activeTab === "education" && (
                <div className="space-y-6">
                  {/* Add education */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Add Education</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddEducation} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                              Institution Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={educationInput.institution}
                              onChange={(e) =>
                                setEducationInput({
                                  ...educationInput,
                                  institution: e.target.value,
                                })
                              }
                              className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                              placeholder="e.g. UC Berkeley"
                            />
                          </div>
                          <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                              Degree / Credentials *
                            </label>
                            <input
                              type="text"
                              required
                              value={educationInput.degree}
                              onChange={(e) =>
                                setEducationInput({ ...educationInput, degree: e.target.value })
                              }
                              className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                              placeholder="e.g. Bachelor of Science"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="sm:col-span-1">
                            <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                              Field of Study *
                            </label>
                            <input
                              type="text"
                              required
                              value={educationInput.fieldOfStudy}
                              onChange={(e) =>
                                setEducationInput({
                                  ...educationInput,
                                  fieldOfStudy: e.target.value,
                                })
                              }
                              className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                              placeholder="e.g. Computer Science"
                            />
                          </div>
                          <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                              Start Year *
                            </label>
                            <input
                              type="number"
                              required
                              value={educationInput.startYear}
                              onChange={(e) =>
                                setEducationInput({
                                  ...educationInput,
                                  startYear: Number(e.target.value),
                                })
                              }
                              className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-semibold uppercase">
                              End Year
                            </label>
                            <input
                              type="number"
                              value={educationInput.endYear}
                              onChange={(e) =>
                                setEducationInput({ ...educationInput, endYear: e.target.value })
                              }
                              className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                              placeholder="e.g. 2022"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={addEducationMutation.isPending}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white hover:bg-[#2563EB]/90 disabled:opacity-50"
                          >
                            {addEducationMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <PlusCircle className="h-4 w-4" />
                            )}
                            Add Education
                          </button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Education List */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Education History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profile?.education &&
                      profile.education.filter((e) => !e.deletedAt).length > 0 ? (
                        profile.education
                          .filter((e) => !e.deletedAt)
                          .map((edu) => (
                            <div
                              key={edu.id}
                              className="border-border/40 flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                            >
                              <div>
                                <h4 className="text-foreground font-semibold">
                                  {edu.degree} in {edu.fieldOfStudy}
                                </h4>
                                <p className="text-muted-foreground text-sm">{edu.institution}</p>
                                <p className="text-muted-foreground mt-1 text-xs">
                                  Class of {edu.startYear} – {edu.endYear || "Present"}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteEducationMutation.mutate(edu.id)}
                                disabled={deleteEducationMutation.isPending}
                                className="hover:bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-lg hover:text-[#EF4444]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No education history added yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ──────────────── 5. Social Links Section ──────────────── */}
              {activeTab === "socials" && (
                <div className="space-y-6">
                  {/* Add socials card */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Add Social Link</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddSocial} className="flex flex-col gap-4 sm:flex-row">
                        <div className="w-full sm:w-48">
                          <select
                            value={socialInput.platform}
                            onChange={(e) =>
                              setSocialInput({ ...socialInput, platform: e.target.value })
                            }
                            className="border-border bg-background text-foreground focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                          >
                            <option value="GITHUB">GitHub</option>
                            <option value="LINKEDIN">LinkedIn</option>
                            <option value="TWITTER">Twitter (X)</option>
                            <option value="PORTFOLIO">Portfolio</option>
                            <option value="WEBSITE">Website</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <input
                            type="url"
                            required
                            placeholder="e.g. https://github.com/username"
                            value={socialInput.url}
                            onChange={(e) =>
                              setSocialInput({ ...socialInput, url: e.target.value })
                            }
                            className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary w-full rounded-lg border px-3.5 py-2 text-sm outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={addSocialLinkMutation.isPending}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white hover:bg-[#2563EB]/90 disabled:opacity-50"
                        >
                          {addSocialLinkMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          <span>Add</span>
                        </button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Socials List */}
                  <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Current Social Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profile?.socialLinks && profile.socialLinks.length > 0 ? (
                        profile.socialLinks.map((social) => (
                          <div
                            key={social.id}
                            className="border-border/40 flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                                {social.platform}
                              </Badge>
                              <a
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary max-w-md truncate text-sm font-medium hover:underline"
                              >
                                {social.url}
                              </a>
                            </div>
                            <button
                              onClick={() => deleteSocialLinkMutation.mutate(social.id)}
                              disabled={deleteSocialLinkMutation.isPending}
                              className="hover:bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-lg hover:text-[#EF4444]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No social links added yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

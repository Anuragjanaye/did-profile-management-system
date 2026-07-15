"use client";

import { useState } from "react";
import { User, MapPin, Globe, Loader2, Save, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/features/upload/components/FileUpload";
import { BioImprovementDialog } from "@/features/ai/components/BioImprovementDialog";
import { profileKeys } from "@/features/profile/hooks/useProfileQueries";
import type { ProfileWithRelations } from "@/features/profile/repositories/profileRepository";

interface BasicInfoTabProps {
  profile: ProfileWithRelations | null | undefined;
  walletAddress: string | undefined;
  updateProfileMutation: {
    mutate: (data: {
      displayName: string;
      headline: string;
      bio: string;
      location: string;
      website: string;
    }) => void;
    isPending: boolean;
  };
}

/** Renders the Basic Information tab view, including avatar, banner uploads, and biography edit tools. */
export function BasicInfoTab({ profile, walletAddress, updateProfileMutation }: BasicInfoTabProps) {
  const queryClient = useQueryClient();
  const [showBioImprovement, setShowBioImprovement] = useState(false);
  const [prevProfileId, setPrevProfileId] = useState(profile?.id);
  const [basicInfo, setBasicInfo] = useState({
    displayName: profile?.displayName || "",
    headline: profile?.headline || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    website: profile?.website || "",
  });

  if (profile?.id !== prevProfileId) {
    setPrevProfileId(profile?.id);
    setBasicInfo({
      displayName: profile?.displayName || "",
      headline: profile?.headline || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      website: profile?.website || "",
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(basicInfo);
  };

  const handleUploadSuccess = () => {
    if (walletAddress) {
      queryClient.invalidateQueries({
        queryKey: profileKeys.byAddress(walletAddress),
      });
    }
  };

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              onUploadSuccess={handleUploadSuccess}
            />
            <FileUpload
              type="banner"
              label="Upload Profile Banner"
              acceptLabel="PNG, JPG, WEBP up to 5MB"
              onUploadSuccess={handleUploadSuccess}
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
                onChange={(e) => setBasicInfo({ ...basicInfo, displayName: e.target.value })}
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
                onChange={(e) => setBasicInfo({ ...basicInfo, headline: e.target.value })}
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
            {basicInfo.bio.trim() && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowBioImprovement(true)}
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  Improve with AI
                </button>
              </div>
            )}
            {showBioImprovement && (
              <BioImprovementDialog
                currentBio={basicInfo.bio}
                onAccept={(improvedBio) => {
                  setBasicInfo({ ...basicInfo, bio: improvedBio });
                  setShowBioImprovement(false);
                }}
                onClose={() => setShowBioImprovement(false)}
                className="mt-4"
              />
            )}
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
                  onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
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
                  onChange={(e) => setBasicInfo({ ...basicInfo, website: e.target.value })}
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
  );
}

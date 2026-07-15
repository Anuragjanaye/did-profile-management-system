"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProfileWithRelations } from "@/features/profile/repositories/profileRepository";

interface SocialsTabProps {
  profile: ProfileWithRelations | null | undefined;
  addSocialLinkMutation: {
    mutate: (data: { platform: string; url: string }, options?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
  deleteSocialLinkMutation: {
    mutate: (id: string) => void;
    isPending: boolean;
  };
}

/** Renders the Social Links tab view, managing Platforms, URLs, and current social entries. */
export function SocialsTab({
  profile,
  addSocialLinkMutation,
  deleteSocialLinkMutation,
}: SocialsTabProps) {
  const [socialInput, setSocialInput] = useState({ platform: "GITHUB", url: "" });

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialInput.url.trim()) return;
    addSocialLinkMutation.mutate(socialInput, {
      onSuccess: () => setSocialInput({ platform: "GITHUB", url: "" }),
    });
  };

  return (
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
                onChange={(e) => setSocialInput({ ...socialInput, platform: e.target.value })}
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
                onChange={(e) => setSocialInput({ ...socialInput, url: e.target.value })}
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
  );
}

"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ProfileWithRelations } from "@/features/profile/repositories/profileRepository";

interface ExperienceTabProps {
  profile: ProfileWithRelations | null | undefined;
  addExperienceMutation: {
    mutate: (
      data: {
        company: string;
        role: string;
        description: string;
        startDate: string;
        endDate: string | null;
      },
      options?: { onSuccess?: () => void }
    ) => void;
    isPending: boolean;
  };
  deleteExperienceMutation: {
    mutate: (id: string) => void;
    isPending: boolean;
  };
}

/** Renders the Experience history tab view, managing addition and listing of experiences. */
export function ExperienceTab({
  profile,
  addExperienceMutation,
  deleteExperienceMutation,
}: ExperienceTabProps) {
  const [experienceInput, setExperienceInput] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
  });

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

  return (
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
                  onChange={(e) => setExperienceInput({ ...experienceInput, role: e.target.value })}
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
          {profile?.experience && profile.experience.filter((e) => !e.deletedAt).length > 0 ? (
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
            <p className="text-muted-foreground text-sm">No experience history added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

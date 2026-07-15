"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ProfileWithRelations } from "@/features/profile/repositories/profileRepository";

interface EducationTabProps {
  profile: ProfileWithRelations | null | undefined;
  addEducationMutation: {
    mutate: (
      data: {
        institution: string;
        degree: string;
        fieldOfStudy: string;
        startYear: number;
        endYear: number | null;
      },
      options?: { onSuccess?: () => void }
    ) => void;
    isPending: boolean;
  };
  deleteEducationMutation: {
    mutate: (id: string) => void;
    isPending: boolean;
  };
}

/** Renders the Education history tab view, managing addition and listing of educations. */
export function EducationTab({
  profile,
  addEducationMutation,
  deleteEducationMutation,
}: EducationTabProps) {
  const [educationInput, setEducationInput] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: new Date().getFullYear(),
    endYear: "",
  });

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

  return (
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
                  onChange={(e) => setEducationInput({ ...educationInput, degree: e.target.value })}
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
          {profile?.education && profile.education.filter((e) => !e.deletedAt).length > 0 ? (
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
            <p className="text-muted-foreground text-sm">No education history added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

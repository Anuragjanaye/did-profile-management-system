"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProfileWithRelations } from "@/features/profile/repositories/profileRepository";

interface SkillsTabProps {
  profile: ProfileWithRelations | null | undefined;
  addSkillMutation: {
    mutate: (data: { name: string; level: string }, options?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
  deleteSkillMutation: {
    mutate: (id: string) => void;
    isPending: boolean;
  };
}

/** Renders the Skills management view, allowing skill entry, level specification, and deletion. */
export function SkillsTab({ profile, addSkillMutation, deleteSkillMutation }: SkillsTabProps) {
  const [skillInput, setSkillInput] = useState({ name: "", level: "BEGINNER" });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.name.trim()) return;
    addSkillMutation.mutate(skillInput, {
      onSuccess: () => setSkillInput({ name: "", level: "BEGINNER" }),
    });
  };

  return (
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
                onChange={(e) => setSkillInput({ ...skillInput, level: e.target.value })}
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
  );
}

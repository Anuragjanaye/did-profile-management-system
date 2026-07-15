"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProfileScoreCard } from "@/features/ai/components/ProfileScoreCard";
import { AnalysisResultPanel } from "@/features/ai/components/AnalysisResultPanel";
import { SkillRecommendationList } from "@/features/ai/components/SkillRecommendationList";
import { ResumeReviewPanel } from "@/features/ai/components/ResumeReviewPanel";
import { useAnalysisHistory } from "@/features/ai/hooks/useAiAnalysis";
import type { ProfileWithRelations } from "@/features/profile/repositories/profileRepository";
import type { ProfileAnalysis } from "@/features/ai/types/Ai";

interface AiGuidanceTabProps {
  profile: ProfileWithRelations | null | undefined;
  onAddRecommendedSkill: (skillName: string) => void;
}

/** Renders the AI Guidance tab view, housing score cards, analysis history, skill advice, and resume reviews. */
export function AiGuidanceTab({ profile, onAddRecommendedSkill }: AiGuidanceTabProps) {
  const [activeAnalysis, setActiveAnalysis] = useState<ProfileAnalysis | null>(null);

  // Fetch the latest saved analysis to initialize the panel if never run in the current session
  const { data: analysisHistory } = useAnalysisHistory(1);
  const latestSavedAnalysis = analysisHistory?.[0];

  const currentAnalysis =
    activeAnalysis ??
    (latestSavedAnalysis
      ? {
          score: latestSavedAnalysis.score,
          summary: latestSavedAnalysis.summary,
          strengths: latestSavedAnalysis.strengths,
          weaknesses: latestSavedAnalysis.weaknesses,
          recommendations: latestSavedAnalysis.recommendations,
          missingInformation: [],
          grammarSuggestions: [],
        }
      : null);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <ProfileScoreCard
          initialScore={profile?.profileScore ?? null}
          onAnalysisComplete={(res) => setActiveAnalysis(res)}
          className="border-border/50 bg-card/60 backdrop-blur-sm"
        />
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm md:col-span-2">
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalysisResultPanel analysis={currentAnalysis} isLoading={false} />
          </CardContent>
        </Card>
      </div>

      <SkillRecommendationList
        onAddSkill={onAddRecommendedSkill}
        className="border-border/50 bg-card/60 backdrop-blur-sm"
      />

      <ResumeReviewPanel className="border-border/50 bg-card/60 backdrop-blur-sm" />
    </div>
  );
}

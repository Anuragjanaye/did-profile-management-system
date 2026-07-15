/** AI analysis data returned to clients. */
export interface ProfileAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  missingInformation: string[];
  grammarSuggestions: string[];
}

/** A single recommended skill. */
export interface SkillRecommendation {
  name: string;
  rationale: string;
  priority: "high" | "medium" | "low";
}

/** AI review of submitted resume text. */
export interface ResumeReview {
  overallAssessment: string;
  strengths: string[];
  improvements: string[];
  keywordSuggestions: string[];
  rewrittenHighlights: string[];
}

/** Result of improving a professional biography. */
export interface BioImprovement {
  improvedBio: string;
  changes: string[];
}

/** Result of generating a professional profile summary. */
export interface ProfessionalSummary {
  summary: string;
}

/** OpenAI request categories recorded for auditing and usage reporting. */
export type AiRequestType = "analysis" | "bio-improvement" | "summary" | "resume-review" | "skills";

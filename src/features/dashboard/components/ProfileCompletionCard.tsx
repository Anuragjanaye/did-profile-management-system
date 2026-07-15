"use client";

import Link from "next/link";
import { BadgeCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileCompletionCardProps {
  completion: number;
}

/** Renders a circular gauge indicating the overall profile completion checklist status. */
export function ProfileCompletionCard({ completion }: ProfileCompletionCardProps) {
  const isComplete = completion === 100;
  
  // Radial SVG offsets
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (completion / 100) * circumference;

  // Static list of completion sections
  const checklist = [
    { label: "Basic Personal Details", key: 1 },
    { label: "Headline & Biography", key: 2 },
    { label: "Skills Catalog", key: 3 },
    { label: "Work & Education Records", key: 4 },
    { label: "Connected Web3/Social Profiles", key: 5 },
  ];

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BadgeCheck className="size-5 text-primary" />
          Profile Completion Status
        </CardTitle>
        <CardDescription>
          Maintain comprehensive details to maximize opportunities and verify your credentials on-chain.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        
        {/* SVG Progress Circle and Details */}
        <div className="flex items-center gap-5">
          <div className="relative size-20 shrink-0">
            <svg className="-rotate-90 size-20" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-border/40"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="url(#completionGrad)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="completionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold tracking-tight">{completion}%</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">
              {isComplete ? "Identity fully customized" : "Profile incomplete"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs max-w-sm leading-relaxed">
              {isComplete
                ? "Your identity is ready for validation registry. Update whenever details change."
                : "Fill out missing skills, certifications, and experience to hit 100% completion."}
            </p>
          </div>
        </div>

        {/* Completion Checklist (Visual helper) */}
        <div className="hidden sm:grid grid-cols-2 gap-2 text-xs border-l border-border/40 pl-6 max-w-md">
          {checklist.map((item, idx) => (
            <div key={item.key} className="flex items-center gap-1.5">
              <span className={`size-1.5 rounded-full ${idx / checklist.length < completion / 100 ? "bg-emerald-500" : "bg-muted"}`} />
              <span className={idx / checklist.length < completion / 100 ? "text-foreground" : "text-muted-foreground"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="shrink-0 pt-4 md:pt-0 border-t border-border/40 md:border-0">
          <Button
            variant="outline"
            render={<Link href="/profile/edit" />}
            className="w-full sm:w-auto hover:bg-muted hover:text-foreground text-xs"
          >
            Review Profile
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

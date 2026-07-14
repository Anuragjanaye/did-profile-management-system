"use client";

import { motion } from "framer-motion";
import { Wallet, Globe, Brain, Link2, Search, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Wallet,
    title: "Wallet Authentication",
    description:
      "Sign in with your Ethereum wallet using SIWE. No email. No password. You control your account.",
    color: "text-[#2563EB]",
    bg: "bg-[#2563EB]/10",
  },
  {
    icon: Globe,
    title: "Decentralized Storage",
    description:
      "Your avatar, resume, and certificates live on IPFS via Pinata — censorship-resistant and permanent.",
    color: "text-[#06B6D4]",
    bg: "bg-[#06B6D4]/10",
  },
  {
    icon: Link2,
    title: "On-Chain Verification",
    description:
      "Register your profile CID on Ethereum Sepolia. Anyone can verify your identity without trusting a server.",
    color: "text-[#7C3AED]",
    bg: "bg-[#7C3AED]/10",
  },
  {
    icon: Brain,
    title: "AI Profile Analysis",
    description:
      "Get an AI-powered profile score and actionable suggestions to improve your professional presence.",
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
  },
  {
    icon: Search,
    title: "Public Discovery",
    description:
      "Search public profiles by name, skills, wallet, or organization. Connect with the right people.",
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Controls",
    description:
      "Set your profile to Public, Private, or Organization-only. You decide who sees your data.",
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
  },
] as const;

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Feature grid showcasing the six core capabilities of the platform.
 */
export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-24" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <motion.p
            className="mb-3 text-sm font-semibold tracking-widest text-[#2563EB] uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Everything you need
          </motion.p>
          <motion.h2
            id="features-heading"
            className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Built for the decentralized web
          </motion.h2>
          <motion.p
            className="text-muted-foreground mx-auto max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            A complete identity platform combining Web3 authentication, decentralized storage,
            blockchain verification, and AI intelligence.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={CARD_VARIANTS}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="group border-border/50 bg-card/50 hover:border-border h-full backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/10">
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
                      aria-hidden="true"
                    >
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-foreground mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

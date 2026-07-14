"use client";

import { motion } from "framer-motion";
import { Wallet, UserCircle, Globe, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Wallet,
    title: "Connect Your Wallet",
    description:
      "Use MetaMask, WalletConnect, or Coinbase Wallet. Sign a SIWE message to authenticate — no registration required.",
    color: "text-[#2563EB]",
    border: "border-[#2563EB]/30",
  },
  {
    step: "02",
    icon: UserCircle,
    title: "Build Your Profile",
    description:
      "Add your bio, skills, education, experience, and upload your resume and certificates directly to IPFS.",
    color: "text-[#7C3AED]",
    border: "border-[#7C3AED]/30",
  },
  {
    step: "03",
    icon: ShieldCheck,
    title: "Verify On-Chain",
    description:
      "Register your profile CID on the Ethereum Sepolia network. Your ownership is now immutably recorded.",
    color: "text-[#06B6D4]",
    border: "border-[#06B6D4]/30",
  },
  {
    step: "04",
    icon: Globe,
    title: "Share &amp; Discover",
    description:
      "Publish your public profile and let recruiters, collaborators, and the community find you.",
    color: "text-[#22C55E]",
    border: "border-[#22C55E]/30",
  },
] as const;

/**
 * "How it works" step-by-step section.
 */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-surface/50 px-4 py-24" aria-labelledby="how-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <motion.p
            className="mb-3 text-sm font-semibold tracking-widest text-[#7C3AED] uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Simple process
          </motion.p>
          <motion.h2
            id="how-heading"
            className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            From wallet to verified profile
          </motion.h2>
          <motion.p
            className="text-muted-foreground mx-auto max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Get started in four steps and own a verifiable, censorship-resistant professional
            identity.
          </motion.p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                className="relative"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                {/* Connector line (hidden on last item) */}
                {i < STEPS.length - 1 && (
                  <div
                    className="from-border absolute top-7 left-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] bg-gradient-to-r to-transparent lg:block"
                    aria-hidden="true"
                  />
                )}

                <div
                  className={`rounded-2xl border ${step.border} bg-card/60 p-6 backdrop-blur-sm`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-muted-foreground font-mono text-xs font-bold">
                      {step.step}
                    </span>
                    <div
                      className="bg-background flex h-10 w-10 items-center justify-center rounded-xl"
                      aria-hidden="true"
                    >
                      <Icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                  </div>
                  <h3 className="text-foreground mb-2 font-semibold">{step.title}</h3>
                  <p
                    className="text-muted-foreground text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Do I need an Ethereum wallet to use this?",
    a: "Yes. Authentication is wallet-based using SIWE (Sign-In With Ethereum). MetaMask, WalletConnect, and Coinbase Wallet are all supported. No email or password is required.",
  },
  {
    q: "Who owns my data?",
    a: "You do. Your profile assets are stored on IPFS (via Pinata) and your ownership is registered on the Ethereum Sepolia blockchain. No central server controls your identity.",
  },
  {
    q: "Is this platform free?",
    a: "Creating and managing your profile is free. Blockchain registration requires a small gas fee on Ethereum Sepolia (testnet for now). Mainnet support is planned for a future release.",
  },
  {
    q: "What happens if I lose my wallet?",
    a: "Your profile data is always on IPFS and the blockchain. If you recover your wallet, you can reconnect it and access your profile. We recommend keeping your seed phrase safe.",
  },
  {
    q: "How does the AI profile score work?",
    a: "The AI analyzes your profile completeness, writing quality, skills, and verification status to generate a score from 0–100. It also provides specific suggestions to improve your score.",
  },
  {
    q: "Can I make my profile private?",
    a: "Yes. You can set your profile to Public, Private, or Organization-only at any time from your settings.",
  },
] as const;

/**
 * FAQ accordion section addressing common user questions.
 */
export function FAQSection() {
  return (
    <section id="faq" className="px-4 py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <motion.p
            className="mb-3 text-sm font-semibold tracking-widest text-[#06B6D4] uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Got questions?
          </motion.p>
          <motion.h2
            id="faq-heading"
            className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Frequently asked questions
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion multiple={false} className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={i}
                className="border-border/50 bg-card/50 rounded-xl border px-6 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-foreground py-5 text-left font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

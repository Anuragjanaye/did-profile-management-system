/**
 * Site-wide metadata and configuration constants.
 * Single source of truth for brand identity and SEO defaults.
 */

export const SITE_CONFIG = {
  name: "DID Profile",
  tagline: "Own Your Identity",
  description:
    "A decentralized identity platform where you authenticate with your wallet, own your professional profile, and verify your credentials on-chain.",
  url: process.env.AUTH_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  twitterHandle: "@didprofile",
  githubUrl: "https://github.com/your-org/did-profile-system",
} as const;

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
] as const;

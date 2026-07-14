import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG, NAV_LINKS } from "@/config/site";

/**
 * Landing page footer with brand, navigation links, and social icons.
 * Server component — no interactivity needed.
 */
export function LandingFooter() {
  return (
    <footer className="border-border bg-surface/50 border-t px-4 py-12" aria-label="Site footer">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Brand */}
          <div>
            <p className="text-foreground font-bold">{SITE_CONFIG.name}</p>
            <p className="text-muted-foreground mt-1 text-sm">{SITE_CONFIG.tagline}</p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository (opens in new tab)"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href={`https://twitter.com/${SITE_CONFIG.twitterHandle.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter profile (opens in new tab)"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <Separator className="bg-border/50 my-8" />

        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Open source. Built with Next.js
          &amp; Ethereum.
        </p>
      </div>
    </footer>
  );
}

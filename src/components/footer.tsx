"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, X, Linkedin } from "lucide-react";

import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { BrandWordmark } from "@/components/brand-wordmark";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border/50 bg-ctp-mantle/70">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(1200px 400px at 50% -20%, color-mix(in oklab, var(--ctp-mauve) 16%, transparent), transparent)",
        }}
      />

      <div className="container relative mx-auto px-4 py-12 md:px-6 md:py-14">
        <div className="rounded-3xl border border-border/60 bg-background/55 p-6 backdrop-blur-xl md:p-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr]">
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div className="relative h-6 w-6">
                  <Image
                    src="/logo.svg"
                    alt="BlogsdotG logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <BrandWordmark size="md" />
              </Link>

              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {SITE_CONFIG.tagline}
              </p>

              <a
                href={`mailto:${SITE_CONFIG.author.email}`}
                className="inline-flex text-sm text-ctp-sapphire hover:text-ctp-blue transition-colors"
              >
                {SITE_CONFIG.author.email}
              </a>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Navigate
              </h3>
              <ul className="flex flex-wrap gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex rounded-full border border-border/70 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-ctp-mauve/40 hover:text-ctp-mauve"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Connect
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                {SITE_CONFIG.author.github && (
                  <a
                    href={SITE_CONFIG.author.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-ctp-mauve/45 hover:text-ctp-mauve"
                    aria-label="GitHub"
                  >
                    <Github className="h-4.5 w-4.5" />
                  </a>
                )}

                {SITE_CONFIG.author.twitter && (
                  <a
                    href={SITE_CONFIG.author.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-ctp-mauve/45 hover:text-ctp-mauve"
                    aria-label="X (Twitter)"
                  >
                    <X className="h-4.5 w-4.5" />
                  </a>
                )}

                {SITE_CONFIG.author.linkedin && (
                  <a
                    href={SITE_CONFIG.author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-ctp-mauve/45 hover:text-ctp-mauve"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4.5 w-4.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-7 bg-border/60" />

          <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:text-left">
            <p suppressHydrationWarning>
              &copy; {new Date().getFullYear()} {SITE_CONFIG.author.name}.{" "}
              {SITE_CONFIG.copyrightText}
            </p>
            <p className="text-xs text-muted-foreground/85">
              Crafted with Next.js, Convex, and Catppuccin.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

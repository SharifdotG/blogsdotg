"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, X, Linkedin } from "lucide-react";

import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { BrandWordmark } from "@/components/brand-wordmark";

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-ctp-mantle">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center gap-2.5">
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
                        <p className="text-sm text-muted-foreground max-w-xs">
                            {SITE_CONFIG.tagline}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h3 className="font-heading font-semibold text-sm text-foreground">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-ctp-mauve transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-3">
                        <h3 className="font-heading font-semibold text-sm text-foreground">
                            Connect
                        </h3>
                        <div className="flex items-center gap-3">
                            {SITE_CONFIG.author.github && (
                                <a
                                    href={SITE_CONFIG.author.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-ctp-mauve transition-colors"
                                    aria-label="GitHub"
                                >
                                    <Github className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {SITE_CONFIG.author.twitter && (
                                <a
                                    href={SITE_CONFIG.author.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-ctp-mauve transition-colors"
                                    aria-label="X (Twitter)"
                                >
                                    <X className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {SITE_CONFIG.author.linkedin && (
                                <a
                                    href={SITE_CONFIG.author.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-ctp-mauve transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <Separator className="my-8 bg-border/50" />

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                    <p suppressHydrationWarning>
                        &copy; {new Date().getFullYear()}{" "}
                        {SITE_CONFIG.author.name}. {SITE_CONFIG.copyrightText}
                    </p>
                </div>
            </div>
        </footer>
    );
}

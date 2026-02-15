"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
    Github,
    Mail,
    MapPin,
    ExternalLink,
    Twitter,
    Linkedin,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { BackToTop } from "@/components/animations/back-to-top";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@/lib/constants";

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Header */}
                <section className="relative overflow-hidden border-b border-border/40">
                    <div className="absolute inset-0 bg-linear-to-br from-ctp-mauve/10 via-background to-ctp-blue/10" />
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,var(--ctp-surface0)_1px,transparent_1px),linear-gradient(to_bottom,var(--ctp-surface0)_1px,transparent_1px)] bg-size-[30px_30px]" />
                    <div className="absolute -top-28 -left-12 h-80 w-80 rounded-full bg-ctp-mauve/15 blur-3xl" />
                    <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-ctp-blue/15 blur-3xl" />

                    <div className="container relative mx-auto px-4 md:px-6 pt-30 pb-22 md:pt-36 md:pb-28">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mx-auto w-full max-w-3xl text-center space-y-5"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ctp-surface0/75 backdrop-blur-md text-sm text-ctp-subtext0 border border-ctp-surface1/50">
                                <MapPin className="h-3.5 w-3.5 text-ctp-mauve" />
                                From the land of rivers and greenery
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
                                About Me
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl leading-relaxed">
                                Know about me :&apos;)
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="max-w-3xl mx-auto">
                        {/* Profile Section */}
                        <ScrollReveal>
                            <div className="flex flex-col md:flex-row items-start gap-8 mb-12 rounded-3xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 md:p-8">
                                {/* Avatar */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="relative shrink-0"
                                >
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-linear-to-br from-ctp-mauve to-ctp-blue p-0.5">
                                        <div className="relative w-full h-full rounded-2xl bg-ctp-mantle overflow-hidden">
                                            <Image
                                                src="/profile.png"
                                                alt={`${SITE_CONFIG.author.name} profile photo`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 128px, 160px"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-heading font-bold">
                                            {SITE_CONFIG.author.name}
                                        </h2>
                                        <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                                            <svg
                                                viewBox="0 0 48 32"
                                                aria-hidden="true"
                                                className="h-3.5 w-5 rounded-[2px] border border-border/40"
                                            >
                                                <rect
                                                    width="48"
                                                    height="32"
                                                    fill="#006A4E"
                                                />
                                                <circle
                                                    cx="21"
                                                    cy="16"
                                                    r="9"
                                                    fill="#F42A41"
                                                />
                                            </svg>
                                            Dhaka, Bangladesh
                                        </p>
                                    </div>
                                    <p className="text-foreground/90 leading-relaxed">
                                        {SITE_CONFIG.author.bio}
                                    </p>

                                    {/* Social links */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {SITE_CONFIG.author.github && (
                                            <a
                                                href={SITE_CONFIG.author.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 border-ctp-surface2 hover:bg-ctp-surface0"
                                                >
                                                    <Github className="h-4 w-4" />
                                                    GitHub
                                                </Button>
                                            </a>
                                        )}
                                        {SITE_CONFIG.author.email && (
                                            <a
                                                href={`mailto:${SITE_CONFIG.author.email}`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 border-ctp-surface2 hover:bg-ctp-surface0"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    Email
                                                </Button>
                                            </a>
                                        )}
                                        {SITE_CONFIG.author.linkedin && (
                                            <a
                                                href={
                                                    SITE_CONFIG.author.linkedin
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 border-ctp-surface2 hover:bg-ctp-surface0"
                                                >
                                                    <Linkedin className="h-4 w-4" />
                                                    LinkedIn
                                                </Button>
                                            </a>
                                        )}
                                        {SITE_CONFIG.author.twitter && (
                                            <a
                                                href={
                                                    SITE_CONFIG.author.twitter
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 border-ctp-surface2 hover:bg-ctp-surface0"
                                                >
                                                    <Twitter className="h-4 w-4" />
                                                    Twitter
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <Separator className="mb-12 bg-border/50" />

                        {/* Portfolio */}
                        <ScrollReveal>
                            <h2 className="text-xl font-heading font-bold mb-6">
                                Check out my portfolio ᓚᘏᗢ
                            </h2>
                            <p className="text-muted-foreground mb-5 leading-relaxed">
                                Explore my latest work, experiences, and
                                projects at{" "}
                                <a
                                    href="https://sharifdotg.me"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-ctp-blue font-medium"
                                >
                                    sharifdotg.me
                                </a>
                                .
                            </p>
                            <motion.a
                                href="https://sharifdotg.me"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="group block mb-12"
                            >
                                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg shadow-black/5">
                                    <Image
                                        src="/portfolio-light.png"
                                        alt="SharifdotG portfolio light theme preview"
                                        width={1600}
                                        height={900}
                                        className="w-full h-auto object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01] dark:hidden"
                                    />
                                    <Image
                                        src="/portfolio-dark.png"
                                        alt="SharifdotG portfolio dark theme preview"
                                        width={1600}
                                        height={900}
                                        className="hidden w-full h-auto object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01] dark:block"
                                    />
                                </div>
                                <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-ctp-blue group-hover:text-ctp-sapphire transition-colors">
                                    Visit sharifdotg.me
                                    <ExternalLink className="h-4 w-4" />
                                </span>
                            </motion.a>
                        </ScrollReveal>

                        <Separator className="mb-12 bg-border/50" />

                        {/* About this blog */}
                        <ScrollReveal>
                            <h2 className="text-xl font-heading font-bold mb-4">
                                About BlogsdotG
                            </h2>
                            <div className="space-y-4 text-foreground/90 leading-relaxed rounded-2xl border border-border/50 bg-card/70 p-5 md:p-6">
                                <p>
                                    BlogsdotG is built with{" "}
                                    <span className="text-ctp-blue font-medium">
                                        Next.js
                                    </span>
                                    ,{" "}
                                    <span className="text-ctp-peach font-medium">
                                        Convex
                                    </span>
                                    , and styled with the beautiful{" "}
                                    <span className="text-ctp-mauve font-medium">
                                        Catppuccin
                                    </span>{" "}
                                    color palette. It&apos;s designed to be
                                    minimal, fast, and enjoyable to read.
                                </p>
                                <p>
                                    The source code is open and available on{" "}
                                    <a
                                        href={SITE_CONFIG.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-ctp-blue underline underline-offset-2 hover:text-ctp-sapphire transition-colors"
                                    >
                                        GitHub
                                    </a>
                                    . Feel free to explore, fork, or contribute!
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </main>
            <Footer />
            <BackToTop />
        </>
    );
}

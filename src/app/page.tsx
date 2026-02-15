"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Pen } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { TagBadge } from "@/components/tag-badge";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { BackToTop } from "@/components/animations/back-to-top";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";
import { SITE_CONFIG } from "@/lib/constants";

export default function HomePage() {
    const recentPosts = useQuery(api.blogs.listPublished, { limit: 3 });
    const allTags = useQuery(api.blogs.getAllTags);

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="relative overflow-hidden border-b border-border/40">
                    <div className="absolute inset-0 bg-linear-to-br from-ctp-mauve/10 via-background to-ctp-blue/10" />
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,var(--ctp-surface0)_1px,transparent_1px),linear-gradient(to_bottom,var(--ctp-surface0)_1px,transparent_1px)] bg-size-[30px_30px]" />
                    <div className="absolute -top-28 -left-12 h-80 w-80 rounded-full bg-ctp-mauve/15 blur-3xl" />
                    <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-ctp-blue/15 blur-3xl" />

                    <div className="container relative mx-auto px-4 md:px-6 pt-30 pb-22 md:pt-36 md:pb-28 lg:pt-40 lg:pb-34">
                        <div className="grid place-items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6 w-full max-w-3xl text-center"
                            >
                                <motion.h1
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, delay: 0.1 }}
                                    className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.05] relative"
                                    aria-label="BlogsdotG"
                                >
                                    <span className="flex flex-wrap items-baseline leading-tight justify-center gap-1">
                                        {/* "Blogs" - Bricolage Grotesque with shimmering gradient */}
                                        <motion.span
                                            initial={{
                                                opacity: 0,
                                                y: 12,
                                                skewY: 6,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                skewY: 0,
                                                rotate: [-2, 2, 0],
                                            }}
                                            transition={{
                                                duration: 0.7,
                                                delay: 0.12,
                                                ease: "easeOut",
                                            }}
                                            className="inline-block bg-clip-text text-transparent"
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(90deg,var(--ctp-mauve),var(--ctp-blue),var(--ctp-sapphire))",
                                                backgroundSize: "200% 200%",
                                                fontFamily:
                                                    '"DM Sans", "DM Sans Black", "DM Sans ExtraBold", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                                                fontWeight: 800,
                                                textShadow:
                                                    "0 6px 20px rgba(99,102,241,0.06)",
                                            }}
                                        >
                                            Blogs
                                        </motion.span>

                                        {/* "dot" - Cascadia Code monospace with subtle typey/flicker feel, now gradient */}
                                        <motion.span
                                            initial={{
                                                scale: 0.94,
                                                opacity: 0,
                                                rotate: -3,
                                            }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                rotate: 0,
                                            }}
                                            transition={{
                                                duration: 0.55,
                                                delay: 0.18,
                                                type: "spring",
                                                stiffness: 220,
                                                damping: 18,
                                            }}
                                            className="inline-block px-1 py-0.5 rounded-md ml-1 bg-clip-text text-transparent"
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(90deg,var(--ctp-sapphire),var(--ctp-blue),var(--ctp-mauve))",
                                                backgroundSize: "180% 180%",
                                                fontFamily:
                                                    '"Cascadia Code", ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace',
                                                fontWeight: 700,
                                                fontStyle: "italic",
                                                fontFeatureSettings: "'ss01' 1",
                                                letterSpacing: "0.6px",
                                                transformOrigin: "center",
                                                textShadow:
                                                    "0 4px 18px rgba(59,130,246,0.06)",
                                            }}
                                        >
                                            dotG
                                        </motion.span>
                                    </span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, delay: 0.16 }}
                                    className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl leading-relaxed"
                                >
                                    {SITE_CONFIG.description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, delay: 0.22 }}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                                >
                                    <Link href="/blogs">
                                        <Button
                                            size="lg"
                                            className="rounded-full bg-ctp-mauve text-ctp-base hover:bg-ctp-mauve/90 gap-2 shadow-lg shadow-ctp-mauve/25"
                                        >
                                            <BookOpen className="h-4 w-4" />
                                            Explore Posts
                                        </Button>
                                    </Link>
                                    <Link href="/about">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="rounded-full border-ctp-surface2 hover:bg-ctp-surface0 gap-2"
                                        >
                                            <Pen className="h-4 w-4" />
                                            About the Author
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Recent Posts */}
                <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
                    <ScrollReveal>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold">
                                    Recent Posts
                                </h2>
                                <p className="text-muted-foreground mt-1">
                                    Latest thoughts and writings
                                </p>
                            </div>
                            <Link href="/blogs">
                                <Button
                                    variant="ghost"
                                    className="text-ctp-mauve hover:text-ctp-mauve/80 gap-1"
                                >
                                    View all
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </ScrollReveal>

                    {recentPosts === undefined ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="h-48 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : recentPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground text-lg">
                                No posts yet. Stay tuned!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentPosts.map((post, i) => (
                                <BlogCard
                                    key={post._id}
                                    slug={post.slug}
                                    title={post.title}
                                    excerpt={post.excerpt}
                                    coverImage={post.coverImage}
                                    tags={post.tags}
                                    publishedAt={
                                        post.publishedAt
                                            ? formatDate(post.publishedAt)
                                            : "Draft"
                                    }
                                    readingTime={post.readingTime}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Tags Section */}
                <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
                    <ScrollReveal>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-heading font-bold">
                                Explore Topics
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                Browse posts by topic
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                            {allTags === undefined ? (
                                <>
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-8 w-20 rounded-full"
                                        />
                                    ))}
                                </>
                            ) : allTags.length === 0 ? (
                                <p className="text-muted-foreground">
                                    No tags yet.
                                </p>
                            ) : (
                                allTags.map(({ tag, count }) => (
                                    <TagBadge
                                        key={tag}
                                        tag={tag}
                                        count={count}
                                        size="md"
                                    />
                                ))
                            )}
                        </div>
                    </ScrollReveal>
                </section>
            </main>
            <Footer />
            <BackToTop />
        </>
    );
}

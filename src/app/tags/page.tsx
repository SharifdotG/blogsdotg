"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Hash, BookOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { TagBadge } from "@/components/tag-badge";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { BackToTop } from "@/components/animations/back-to-top";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";

function TagsContent() {
    const searchParams = useSearchParams();
    const initialTag = searchParams.get("tag");
    const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);

    const allTags = useQuery(api.blogs.getAllTags);
    const tagPosts = useQuery(
        api.blogs.getByTag,
        selectedTag ? { tag: selectedTag } : "skip",
    );

    const isLoadingTags = allTags === undefined;

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
                                <Tag className="h-3.5 w-3.5 text-ctp-mauve" />
                                Discover by topic
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
                                Tags
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl leading-relaxed">
                                Browse posts organized by topic. Click a tag to
                                see related posts.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                    {/* Tags Cloud */}
                    <ScrollReveal>
                        <div className="flex flex-wrap gap-3 mb-10">
                            {isLoadingTags ? (
                                [0, 1, 2, 3, 4, 5, 6].map((i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-9 w-24 rounded-full"
                                    />
                                ))
                            ) : allTags.length === 0 ? (
                                <p className="text-muted-foreground">
                                    No tags yet.
                                </p>
                            ) : (
                                allTags.map(({ tag, count }) => (
                                    <button
                                        key={tag}
                                        onClick={() =>
                                            setSelectedTag(
                                                selectedTag === tag
                                                    ? null
                                                    : tag,
                                            )
                                        }
                                    >
                                        <TagBadge
                                            tag={tag}
                                            count={count}
                                            size="lg"
                                            interactive={false}
                                        />
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollReveal>

                    {/* Selected tag posts */}
                    {selectedTag && (
                        <motion.div
                            key={selectedTag}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Hash className="h-5 w-5 text-ctp-mauve" />
                                <h2 className="text-xl font-heading font-semibold">
                                    Posts tagged &ldquo;{selectedTag}&rdquo;
                                </h2>
                                {tagPosts && (
                                    <span className="text-sm text-muted-foreground">
                                        ({tagPosts.length})
                                    </span>
                                )}
                            </div>

                            {tagPosts === undefined ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="space-y-3">
                                            <Skeleton className="h-48 w-full rounded-lg" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : tagPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tagPosts.map((post, i) => (
                                        <BlogCard
                                            key={post._id}
                                            slug={post.slug}
                                            title={post.title}
                                            excerpt={post.excerpt}
                                            coverImage={post.coverImage}
                                            tags={post.tags}
                                            publishedAt={
                                                post.publishedAt
                                                    ? formatDate(
                                                          post.publishedAt,
                                                      )
                                                    : "Draft"
                                            }
                                            readingTime={post.readingTime}
                                            index={i}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                                    <p className="text-muted-foreground">
                                        No posts found for this tag.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {!selectedTag && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-muted-foreground py-10"
                        >
                            Select a tag above to view related posts.
                        </motion.p>
                    )}
                </div>
            </main>
            <Footer />
            <BackToTop />
        </>
    );
}

export default function TagsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">
                        Loading...
                    </div>
                </div>
            }
        >
            <TagsContent />
        </Suspense>
    );
}

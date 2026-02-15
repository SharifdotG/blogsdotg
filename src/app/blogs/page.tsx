"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { SearchBar } from "@/components/search-bar";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { BackToTop } from "@/components/animations/back-to-top";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";

export default function BlogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const allPosts = useQuery(api.blogs.listPublished, {});
    const allTags = useQuery(api.blogs.getAllTags);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setSelectedTag(null);
    }, []);

    const filteredPosts = useMemo(() => {
        if (!allPosts) return [];
        return allPosts.filter((post) => {
            const matchesSearch =
                !searchQuery ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                post.tags.some((tag) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase()),
                );

            const matchesTag =
                !selectedTag ||
                post.tags.some(
                    (tag) => tag.toLowerCase() === selectedTag.toLowerCase(),
                );

            return matchesSearch && matchesTag;
        });
    }, [allPosts, searchQuery, selectedTag]);

    const isLoading = allPosts === undefined || allTags === undefined;

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
                                <BookOpen className="h-3.5 w-3.5 text-ctp-mauve" />
                                Browse the archive
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
                                All Blogs
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl leading-relaxed">
                                Thoughts, tutorials, and deep dives into code
                                and technology.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                    {/* Search & Filter */}
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <SearchBar
                                onSearch={handleSearch}
                                className="md:max-w-md"
                                placeholder="Search blogs by title, content, or tag..."
                            />
                        </div>
                    </ScrollReveal>

                    {/* Tags filter */}
                    <ScrollReveal delay={0.1}>
                        <div className="flex flex-wrap gap-2 mb-8">
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                    !selectedTag
                                        ? "bg-ctp-mauve text-ctp-base shadow-md shadow-ctp-mauve/20"
                                        : "bg-ctp-surface0 text-muted-foreground hover:bg-ctp-surface1"
                                }`}
                            >
                                All
                            </button>
                            {isLoading
                                ? [0, 1, 2, 3, 4].map((i) => (
                                      <Skeleton
                                          key={i}
                                          className="h-7 w-16 rounded-full"
                                      />
                                  ))
                                : allTags?.map(({ tag }) => (
                                      <button
                                          key={tag}
                                          onClick={() =>
                                              setSelectedTag(
                                                  selectedTag === tag
                                                      ? null
                                                      : tag,
                                              )
                                          }
                                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                              selectedTag === tag
                                                  ? "bg-ctp-mauve text-ctp-base shadow-md shadow-ctp-mauve/20"
                                                  : "bg-ctp-surface0 text-muted-foreground hover:bg-ctp-surface1"
                                          }`}
                                      >
                                          {tag}
                                      </button>
                                  ))}
                        </div>
                    </ScrollReveal>

                    {/* Posts Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="h-48 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post, i) => (
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
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground text-lg">
                                No posts found matching your criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedTag(null);
                                }}
                                className="text-ctp-mauve hover:underline mt-2"
                            >
                                Clear filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
            <BackToTop />
        </>
    );
}

"use client";

import { use, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Eye, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import hljs from "highlight.js/lib/common";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TagBadge } from "@/components/tag-badge";
import { BackToTop } from "@/components/animations/back-to-top";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";
import { toast } from "sonner";

const LANGUAGE_LABELS: Record<string, string> = {
    js: "JavaScript",
    jsx: "JSX",
    ts: "TypeScript",
    tsx: "TSX",
    py: "Python",
    ruby: "Ruby",
    rb: "Ruby",
    rs: "Rust",
    go: "Go",
    c: "C",
    cpp: "C++",
    cs: "C#",
    csharp: "C#",
    java: "Java",
    php: "PHP",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    sql: "SQL",
    bash: "Bash",
    shell: "Shell",
    sh: "Shell",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    md: "Markdown",
    plaintext: "Plain text",
    text: "Plain text",
};

function normalizeLanguage(language?: string) {
    return language?.toLowerCase().replace(/[^a-z0-9+#-]/g, "") ?? "";
}

function extractLanguageFromClassList(classList: DOMTokenList) {
    const languageClass = Array.from(classList).find(
        (cls) => cls.startsWith("language-") || cls.startsWith("lang-"),
    );

    if (!languageClass) return "";
    return normalizeLanguage(languageClass.replace(/^language-|^lang-/, ""));
}

function resolveLanguageAlias(language: string) {
    const aliases: Record<string, string> = {
        rb: "ruby",
        csharp: "cs",
        shell: "bash",
        yml: "yaml",
    };

    if (!language) return "";
    return aliases[language] ?? language;
}

function formatLanguageLabel(language?: string) {
    const normalized = normalizeLanguage(language);
    if (!normalized) return "Plain text";
    if (LANGUAGE_LABELS[normalized]) return LANGUAGE_LABELS[normalized];
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export default function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const blog = useQuery(api.blogs.getBySlug, { slug });
    const incrementViews = useMutation(api.blogs.incrementViews);
    const contentRef = useRef<HTMLDivElement>(null);

    // Increment view count once when the page loads
    useEffect(() => {
        if (blog && blog._id) {
            incrementViews({ id: blog._id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blog?._id]);

    useEffect(() => {
        if (!blog?.content || !contentRef.current) return;

        const cleanupFns: Array<() => void> = [];
        const timeoutIds: number[] = [];

        contentRef.current.querySelectorAll("pre code").forEach((block) => {
            const element = block as HTMLElement;
            const pre = element.closest("pre");

            if (!pre || pre.dataset.enhanced === "true") return;

            const source = element.textContent ?? "";
            const explicitLanguage =
                extractLanguageFromClassList(element.classList) ||
                extractLanguageFromClassList(pre.classList) ||
                normalizeLanguage(element.dataset.language) ||
                normalizeLanguage(pre.dataset.language);

            const resolvedLanguage = resolveLanguageAlias(explicitLanguage);

            const highlighted =
                resolvedLanguage && hljs.getLanguage(resolvedLanguage)
                    ? hljs.highlight(source, {
                          language: resolvedLanguage,
                          ignoreIllegals: true,
                      })
                    : hljs.highlightAuto(source, [
                          "ruby",
                          "javascript",
                          "typescript",
                          "python",
                          "java",
                          "go",
                          "rust",
                          "php",
                          "json",
                          "yaml",
                          "bash",
                          "sql",
                          "html",
                          "css",
                      ]);

            const detectedLanguage =
                explicitLanguage || normalizeLanguage(highlighted.language);

            element.innerHTML = highlighted.value;
            element.classList.add("hljs");

            const parentNode = pre.parentNode;
            if (!parentNode) return;

            const wrapper = document.createElement("div");
            wrapper.className = "code-block-shell";

            const toolbar = document.createElement("div");
            toolbar.className = "code-block-toolbar";

            const languageLabel = document.createElement("span");
            languageLabel.className = "code-block-language";
            languageLabel.textContent = formatLanguageLabel(detectedLanguage);

            const copyButton = document.createElement("button");
            copyButton.type = "button";
            copyButton.className = "code-block-copy";
            copyButton.textContent = "Copy";

            const handleCopy = async () => {
                try {
                    await navigator.clipboard.writeText(source);
                    copyButton.textContent = "Copied!";
                    const timeoutId = window.setTimeout(() => {
                        copyButton.textContent = "Copy";
                    }, 1400);
                    timeoutIds.push(timeoutId);
                } catch {
                    toast.error("Could not copy code.");
                }
            };

            copyButton.addEventListener("click", handleCopy);
            cleanupFns.push(() =>
                copyButton.removeEventListener("click", handleCopy),
            );

            toolbar.append(languageLabel, copyButton);

            parentNode.insertBefore(wrapper, pre);
            wrapper.append(toolbar, pre);

            pre.dataset.enhanced = "true";
        });

        return () => {
            cleanupFns.forEach((cleanup) => cleanup());
            timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
        };
    }, [blog?._id, blog?.content, blog?.views]);

    // Loading state
    if (blog === undefined) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen">
                    <article className="container mx-auto px-4 md:px-6 pt-28 pb-8 md:pt-32 md:pb-12">
                        <Skeleton className="h-8 w-32 mb-6" />
                        <div className="max-w-3xl mx-auto space-y-4">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Separator className="my-8" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    </article>
                </main>
                <Footer />
            </>
        );
    }

    // Not found
    if (blog === null) {
        notFound();
    }

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: blog.title,
                    text: blog.excerpt,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch {
            // User cancelled share dialog
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <article className="container mx-auto px-4 md:px-6 pt-28 pb-8 md:pt-32 md:pb-12">
                    {/* Back button */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link href="/blogs">
                            <Button
                                variant="ghost"
                                className="gap-2 text-muted-foreground hover:text-foreground mb-6"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to posts
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Article header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto mb-8"
                    >
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.map((tag) => (
                                <TagBadge key={tag} tag={tag} size="md" />
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-4">
                            {blog.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-lg text-muted-foreground mb-6">
                            {blog.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    {blog.publishedAt
                                        ? formatDate(blog.publishedAt)
                                        : "Draft"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {blog.readingTime}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4" />
                                    {blog.views} views
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleShare}
                                className="gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </motion.header>

                    {/* Cover image */}
                    {blog.coverImage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="max-w-4xl mx-auto mb-10"
                        >
                            <div className="relative w-full rounded-xl overflow-hidden aspect-2/1">
                                <Image
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 1200px"
                                    priority
                                />
                            </div>
                        </motion.div>
                    )}

                    <Separator className="max-w-3xl mx-auto mb-10 bg-border/50" />

                    {/* Article content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="max-w-3xl mx-auto blog-content prose-lg"
                        ref={contentRef}
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    <Separator className="max-w-3xl mx-auto my-10 bg-border/50" />

                    {/* Post footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <TagBadge key={tag} tag={tag} size="sm" />
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleShare}
                                className="gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </motion.div>
                </article>
            </main>
            <Footer />
            <BackToTop />
        </>
    );
}

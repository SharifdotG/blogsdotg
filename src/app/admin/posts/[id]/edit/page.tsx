"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, ArrowLeft, X, Plus, Loader2, Link2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { slugify, estimateReadingTime } from "@/lib/helpers";

interface EditablePost {
    _id: Id<"blogs">;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
    featured: boolean;
    status: "draft" | "published";
    coverImage?: string;
    views: number;
}

export default function EditPostPage() {
    const params = useParams();
    const id = params.id as string;
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const shouldFetchAdminData = !isAuthLoading && isAuthenticated;

    const blogs = useQuery(
        api.blogs.listAll,
        shouldFetchAdminData ? undefined : "skip",
    );
    const post = blogs?.find((blog) => blog._id === id) as
        | EditablePost
        | undefined;

    const isLoading = isAuthLoading || !isAuthenticated || blogs === undefined;

    if (isLoading) {
        return (
            <div className="space-y-6 w-full max-w-none">
                <div className="rounded-2xl border border-border/50 bg-card/70 p-4 md:p-5">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    <div className="lg:col-span-3 space-y-5">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-100 w-full" />
                    </div>
                    <div className="space-y-5">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="rounded-2xl border border-border/50 bg-card/70 py-16 px-4 text-center">
                <h2 className="text-xl font-heading font-bold mb-2">
                    Post not found
                </h2>
                <p className="text-muted-foreground mb-4">
                    This post may have been deleted.
                </p>
                <Link href="/admin/posts">
                    <Button variant="outline" className="rounded-xl">
                        Back to Posts
                    </Button>
                </Link>
            </div>
        );
    }

    return <EditPostForm id={id as Id<"blogs">} post={post} />;
}

function EditPostForm({ id, post }: { id: Id<"blogs">; post: EditablePost }) {
    const router = useRouter();
    const updateMutation = useMutation(api.blogs.update);

    const [form, setForm] = useState({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags,
        featured: post.featured,
        status: post.status,
    });
    const [tagInput, setTagInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [coverImageUrl, setCoverImageUrl] = useState(post.coverImage ?? "");
    const [coverImageInput, setCoverImageInput] = useState("");

    const handleTitleChange = (title: string) => {
        setForm((prev) => ({
            ...prev,
            title,
            slug: slugify(title),
        }));
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !form.tags.includes(tag)) {
            setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    const addCoverImage = () => {
        const url = coverImageInput.trim();
        if (!url) {
            toast.error("Please enter an image URL");
            return;
        }
        try {
            new URL(url);
        } catch {
            toast.error("Please enter a valid URL");
            return;
        }
        setCoverImageUrl(url);
        setCoverImageInput("");
        toast.success("Cover image updated!");
    };

    const removeCoverImage = () => {
        setCoverImageUrl("");
        setCoverImageInput("");
    };

    const handleSave = async (status: "draft" | "published") => {
        if (!form.title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (!form.content.trim()) {
            toast.error("Content is required");
            return;
        }

        setSaving(true);
        setForm((prev) => ({ ...prev, status }));

        try {
            const readingTime = estimateReadingTime(form.content);

            const args: {
                id: Id<"blogs">;
                title: string;
                slug: string;
                excerpt: string;
                content: string;
                tags: string[];
                status: "draft" | "published";
                readingTime: string;
                featured: boolean;
                coverImage?: string;
            } = {
                id,
                title: form.title,
                slug: form.slug || slugify(form.title),
                excerpt: form.excerpt,
                content: form.content,
                tags: form.tags,
                status,
                readingTime,
                featured: form.featured,
            };

            if (coverImageUrl) {
                args.coverImage = coverImageUrl;
            }

            await updateMutation(args);

            toast.success(
                status === "published"
                    ? "Post updated & published!"
                    : "Draft saved!",
            );
            router.push("/admin/posts");
        } catch (err) {
            console.error("Failed to update post:", err);
            toast.error("Failed to update post. Please try again.");
            setForm((prev) => ({ ...prev, status: post.status }));
        }

        setSaving(false);
    };

    return (
        <div className="space-y-6 w-full max-w-none">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-2xl border border-border/50 bg-card/70 p-4 md:p-5 shadow-lg shadow-black/5"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/posts">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-xl md:text-2xl font-heading font-bold">
                                Edit Post
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base">
                                Editing: {post.title}
                            </p>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleSave("draft")}
                                disabled={saving}
                                className="h-10 rounded-xl gap-2 border-ctp-surface2"
                            >
                                {saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Save Draft
                            </Button>
                            <Button
                                onClick={() => handleSave("published")}
                                disabled={saving}
                                className="h-10 rounded-xl gap-2 bg-ctp-green text-ctp-base hover:bg-ctp-green/90"
                            >
                                {saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                {post.status === "published"
                                    ? "Update"
                                    : "Publish"}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
                    className="lg:col-span-3 space-y-5"
                >
                    <Card className="border-border/50 bg-card/70">
                        <CardContent className="pt-6 space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={form.title}
                                onChange={(e) =>
                                    handleTitleChange(e.target.value)
                                }
                                placeholder="Enter post title..."
                                className="h-11 rounded-xl text-base bg-ctp-surface0/70 border-border/50"
                            />
                            <p className="text-xs text-muted-foreground">
                                Slug: {form.slug || "auto-generated-from-title"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/70">
                        <CardContent className="pt-6 space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                value={form.excerpt}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        excerpt: e.target.value,
                                    }))
                                }
                                placeholder="Brief description of your post..."
                                className="bg-ctp-surface0/70 border-border/50 resize-none"
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/70">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-heading">
                                Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-6">
                            <TiptapEditor
                                content={form.content}
                                onChange={(html) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        content: html,
                                    }))
                                }
                                placeholder="Start writing your blog post..."
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.14, ease: "easeOut" }}
                    className="space-y-5"
                >
                    <Card className="border-border/50 bg-card/70">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-heading">
                                Tags
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) =>
                                        setTagInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTag();
                                        }
                                    }}
                                    placeholder="Add tag..."
                                    className="bg-ctp-surface0/70 border-border/50 text-sm"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={addTag}
                                    className="border-ctp-surface2 shrink-0 rounded-xl"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {form.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="bg-ctp-surface0/70 text-ctp-subtext0 gap-1 cursor-pointer hover:bg-ctp-red/10 hover:text-ctp-red"
                                        onClick={() => removeTag(tag)}
                                    >
                                        {tag}
                                        <X className="h-3 w-3" />
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/70">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-heading">
                                Options
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="featured"
                                    className="text-sm cursor-pointer"
                                >
                                    Featured Post
                                </Label>
                                <Switch
                                    id="featured"
                                    checked={form.featured}
                                    onCheckedChange={(checked) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            featured: checked,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Status</span>
                                <Badge
                                    variant="secondary"
                                    className={
                                        form.status === "published"
                                            ? "bg-ctp-green/10 text-ctp-green"
                                            : "bg-ctp-yellow/10 text-ctp-yellow"
                                    }
                                >
                                    {form.status}
                                </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Reading time:{" "}
                                {form.content
                                    ? estimateReadingTime(form.content)
                                    : "—"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Views: {post.views}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/70">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-heading">
                                Cover Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {coverImageUrl ? (
                                <div className="relative group">
                                    <div className="w-full rounded-lg overflow-hidden aspect-video">
                                        <Image
                                            src={coverImageUrl}
                                            alt="Cover"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <button
                                        onClick={removeCoverImage}
                                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-ctp-red/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1.5 truncate">
                                        {coverImageUrl}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            value={coverImageInput}
                                            onChange={(e) =>
                                                setCoverImageInput(
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addCoverImage();
                                                }
                                            }}
                                            placeholder="Paste image URL..."
                                            className="bg-ctp-surface0/70 border-border/50 text-sm"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={addCoverImage}
                                            className="border-ctp-surface2 shrink-0 rounded-xl"
                                        >
                                            <Link2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/60">
                                        Use an external image URL (e.g.,
                                        Unsplash, Imgur)
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

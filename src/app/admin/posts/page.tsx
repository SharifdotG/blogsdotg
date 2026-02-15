"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    PlusCircle,
    FileText,
    Search,
    Eye,
    Clock,
    Pencil,
    Trash2,
    MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeDate } from "@/lib/helpers";

export default function AdminPostsPage() {
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const shouldFetchAdminData = !isAuthLoading && isAuthenticated;

    const [searchQuery, setSearchQuery] = useState("");
    const [deleteId, setDeleteId] = useState<Id<"blogs"> | null>(null);
    const [deleting, setDeleting] = useState(false);

    const allPosts = useQuery(
        api.blogs.listAll,
        shouldFetchAdminData ? undefined : "skip",
    );
    const removeMutation = useMutation(api.blogs.remove);
    const updateMutation = useMutation(api.blogs.update);

    const isLoading =
        isAuthLoading || !isAuthenticated || allPosts === undefined;

    const filteredPosts = allPosts?.filter(
        (post) =>
            !searchQuery ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
    );

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            await removeMutation({ id: deleteId });
            toast.success("Post deleted successfully");
        } catch {
            toast.error("Failed to delete post");
        }

        setDeleting(false);
        setDeleteId(null);
    };

    const toggleStatus = async (
        id: Id<"blogs">,
        currentStatus: "draft" | "published",
    ) => {
        const newStatus = currentStatus === "published" ? "draft" : "published";

        try {
            await updateMutation({ id, status: newStatus });
            toast.success(
                newStatus === "published"
                    ? "Post published!"
                    : "Post moved to drafts",
            );
        } catch {
            toast.error("Failed to update post status");
        }
    };

    return (
        <div className="space-y-6">
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-2xl border border-border/50 bg-card/70 p-5 md:p-6 shadow-lg shadow-black/5"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-xl md:text-2xl font-heading font-bold">
                            All Posts
                        </h2>
                        <p className="mt-1 text-sm md:text-base text-muted-foreground">
                            Manage drafts and published posts
                            {!isLoading ? ` (${allPosts.length} total)` : ""}
                        </p>
                    </div>
                    <Link href="/admin/posts/new">
                        <Button className="gap-2 bg-ctp-mauve text-ctp-base hover:bg-ctp-mauve/90">
                            <PlusCircle className="h-4 w-4" />
                            New Post
                        </Button>
                    </Link>
                </div>

                <div className="mt-5 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search posts by title or tag..."
                        className="h-11 rounded-xl pl-10 bg-ctp-surface0/70 border-border/50"
                    />
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
            >
                {isLoading ? (
                    <div className="space-y-3">
                        {[0, 1, 2, 3].map((item) => (
                            <Card
                                key={item}
                                className="border-border/50 bg-card/70 py-5"
                            >
                                <CardContent className="px-5">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-12 w-12 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredPosts && filteredPosts.length > 0 ? (
                    <div className="space-y-2">
                        {filteredPosts.map((post) => (
                            <Card
                                key={post._id}
                                className="border-border/50 bg-card/70 py-4 hover:border-ctp-mauve/35 transition-colors"
                            >
                                <CardContent className="px-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                                <h3 className="truncate text-sm md:text-base font-heading font-semibold">
                                                    {post.title}
                                                </h3>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        post.status ===
                                                        "published"
                                                            ? "bg-ctp-green/12 text-ctp-green"
                                                            : "bg-ctp-yellow/12 text-ctp-yellow"
                                                    }
                                                >
                                                    {post.status}
                                                </Badge>
                                                {post.featured && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-ctp-mauve/12 text-ctp-mauve"
                                                    >
                                                        featured
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatRelativeDate(
                                                        post._creationTime,
                                                    )}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {post.views}
                                                </span>
                                                {post.tags.length > 0 && (
                                                    <span className="truncate">
                                                        {post.tags.join(", ")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 rounded-xl"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-44"
                                            >
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/admin/posts/${post._id}/edit`}
                                                        className="gap-2"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        toggleStatus(
                                                            post._id,
                                                            post.status,
                                                        )
                                                    }
                                                    className="gap-2"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    {post.status === "published"
                                                        ? "Unpublish"
                                                        : "Publish"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeleteId(post._id)
                                                    }
                                                    className="gap-2 text-ctp-red focus:text-ctp-red"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-border/50 bg-card/70">
                        <CardContent className="py-16">
                            <div className="text-center">
                                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <h3 className="font-heading font-semibold text-lg mb-2">
                                    {searchQuery
                                        ? "No matching posts"
                                        : "No posts yet"}
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                    {searchQuery
                                        ? "Try a different search term."
                                        : "Get started by creating your first blog post."}
                                </p>
                                {!searchQuery && (
                                    <Link href="/admin/posts/new">
                                        <Button className="gap-2 bg-ctp-mauve text-ctp-base hover:bg-ctp-mauve/90">
                                            <PlusCircle className="h-4 w-4" />
                                            Create First Post
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </motion.section>

            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="bg-card border-border/50">
                    <DialogHeader>
                        <DialogTitle className="font-heading">
                            Delete Post
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                            className="border-ctp-surface2"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-ctp-red text-white hover:bg-ctp-red/90"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

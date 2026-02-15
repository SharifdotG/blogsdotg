"use client";

import { motion } from "framer-motion";
import { FileText, Eye, Tag, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/helpers";

export default function AdminDashboardPage() {
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const shouldFetchAdminData = !isAuthLoading && isAuthenticated;

    const allPosts = useQuery(
        api.blogs.listAll,
        shouldFetchAdminData ? undefined : "skip",
    );
    const allTags = useQuery(api.blogs.getAllTags);

    const isLoading =
        isAuthLoading ||
        !isAuthenticated ||
        allPosts === undefined ||
        allTags === undefined;

    const totalPosts = allPosts?.length ?? 0;
    const publishedPosts =
        allPosts?.filter((post) => post.status === "published").length ?? 0;
    const totalViews =
        allPosts?.reduce((sum, post) => sum + post.views, 0) ?? 0;
    const totalTags = allTags?.length ?? 0;

    const stats = [
        {
            label: "Total Posts",
            value: totalPosts.toString(),
            icon: FileText,
            textClass: "text-ctp-blue",
            bgClass: "bg-ctp-blue/12",
        },
        {
            label: "Published",
            value: publishedPosts.toString(),
            icon: TrendingUp,
            textClass: "text-ctp-green",
            bgClass: "bg-ctp-green/12",
        },
        {
            label: "Total Views",
            value: totalViews.toLocaleString(),
            icon: Eye,
            textClass: "text-ctp-peach",
            bgClass: "bg-ctp-peach/12",
        },
        {
            label: "Tags",
            value: totalTags.toString(),
            icon: Tag,
            textClass: "text-ctp-mauve",
            bgClass: "bg-ctp-mauve/12",
        },
    ];

    const recentPosts = allPosts?.slice(0, 5) ?? [];

    return (
        <div className="space-y-6">
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-2xl border border-border/50 bg-card/70 p-5 md:p-6 shadow-lg shadow-black/5"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl md:text-2xl font-heading font-bold">
                            Overview
                        </h2>
                        <p className="mt-1 text-sm md:text-base text-muted-foreground">
                            Track your publishing activity and recent content
                            updates.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/posts">
                            <Button
                                variant="outline"
                                className="border-border/60"
                            >
                                Manage Posts
                            </Button>
                        </Link>
                        <Link href="/admin/posts/new">
                            <Button className="bg-ctp-mauve text-ctp-base hover:bg-ctp-mauve/90">
                                New Post
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.section>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.06,
                            ease: "easeOut",
                        }}
                    >
                        <Card className="border-border/50 bg-card/70 py-5 hover:border-ctp-mauve/35 transition-colors">
                            <CardContent className="px-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {stat.label}
                                        </p>
                                        {isLoading ? (
                                            <Skeleton className="h-8 w-20 mt-1" />
                                        ) : (
                                            <p className="mt-1 text-2xl font-heading font-bold">
                                                {stat.value}
                                            </p>
                                        )}
                                    </div>
                                    <div
                                        className={`h-11 w-11 rounded-xl ${stat.bgClass} flex items-center justify-center`}
                                    >
                                        <stat.icon
                                            className={`h-5 w-5 ${stat.textClass}`}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            >
                <Card className="border-border/50 bg-card/70">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-lg font-heading">
                            Recent Posts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[0, 1, 2].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 rounded-xl border border-border/40 px-3 py-3"
                                    >
                                        <Skeleton className="h-10 w-10 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentPosts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                <p>No posts yet. Create your first post.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentPosts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-border/50 hover:bg-ctp-surface0/45"
                                    >
                                        <div className="min-w-0 flex items-center gap-3">
                                            <div
                                                className={`h-2 w-2 shrink-0 rounded-full ${
                                                    post.status === "published"
                                                        ? "bg-ctp-green"
                                                        : "bg-ctp-yellow"
                                                }`}
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {post.title}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
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
                                                    <span className="inline-flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {post.views}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {post._creationTime
                                                            ? formatRelativeDate(
                                                                  post._creationTime,
                                                              )
                                                            : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.section>
        </div>
    );
}

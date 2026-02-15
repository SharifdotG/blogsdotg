import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";

// ─── Public Queries ───

/** List all published blogs, newest first */
export const listPublished = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_status_publishedAt", (q) =>
                q.eq("status", "published"),
            )
            .order("desc")
            .take(limit);
        return blogs;
    },
});

/** Get featured published blogs */
export const listFeatured = query({
    handler: async (ctx) => {
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_featured", (q) => q.eq("featured", true))
            .collect();
        // Filter to only published
        return blogs
            .filter((b) => b.status === "published")
            .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
            .slice(0, 3);
    },
});

/** Get a single blog by slug */
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const blog = await ctx.db
            .query("blogs")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
        return blog;
    },
});

/** Get all unique tags with counts */
export const getAllTags = query({
    handler: async (ctx) => {
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_status", (q) => q.eq("status", "published"))
            .collect();

        const tagMap = new Map<string, number>();
        for (const blog of blogs) {
            for (const tag of blog.tags) {
                tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
            }
        }

        return Array.from(tagMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);
    },
});

/** Search published blogs by title/tags */
export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_status", (q) => q.eq("status", "published"))
            .collect();

        const q = args.query.toLowerCase();
        return blogs.filter(
            (blog) =>
                blog.title.toLowerCase().includes(q) ||
                blog.excerpt.toLowerCase().includes(q) ||
                blog.tags.some((tag) => tag.toLowerCase().includes(q)),
        );
    },
});

/** Get blogs by tag */
export const getByTag = query({
    args: { tag: v.string() },
    handler: async (ctx, args) => {
        const blogs = await ctx.db
            .query("blogs")
            .withIndex("by_status_publishedAt", (q) =>
                q.eq("status", "published"),
            )
            .order("desc")
            .collect();

        return blogs.filter((blog) =>
            blog.tags.some((t) => t.toLowerCase() === args.tag.toLowerCase()),
        );
    },
});

// ─── Admin Mutations ───

/** List ALL blogs (admin) */
export const listAll = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        return await ctx.db.query("blogs").order("desc").collect();
    },
});

/** Create a new blog post */
export const create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        excerpt: v.string(),
        content: v.string(),
        coverImage: v.optional(v.string()),
        coverImageId: v.optional(v.id("_storage")),
        tags: v.array(v.string()),
        status: v.union(v.literal("draft"), v.literal("published")),
        readingTime: v.string(),
        featured: v.boolean(),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const publishedAt =
            args.status === "published" ? Date.now() : undefined;
        return await ctx.db.insert("blogs", {
            ...args,
            publishedAt,
            views: 0,
        });
    },
});

/** Update an existing blog post */
export const update = mutation({
    args: {
        id: v.id("blogs"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        coverImageId: v.optional(v.id("_storage")),
        tags: v.optional(v.array(v.string())),
        status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
        readingTime: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const { id, ...fields } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Blog post not found");

        // Set publishedAt when first published
        const updates: Record<string, unknown> = { ...fields };
        if (
            fields.status === "published" &&
            existing.status === "draft" &&
            !existing.publishedAt
        ) {
            updates.publishedAt = Date.now();
        }

        await ctx.db.patch(id, updates);
    },
});

/** Delete a blog post */
export const remove = mutation({
    args: { id: v.id("blogs") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const blog = await ctx.db.get(args.id);
        if (blog?.coverImageId) {
            await ctx.storage.delete(blog.coverImageId);
        }
        await ctx.db.delete(args.id);
    },
});

/** Increment view count */
export const incrementViews = mutation({
    args: { id: v.id("blogs") },
    handler: async (ctx, args) => {
        const blog = await ctx.db.get(args.id);
        if (blog) {
            await ctx.db.patch(args.id, { views: blog.views + 1 });
        }
    },
});

/** Generate upload URL for cover images */
export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        return await ctx.storage.generateUploadUrl();
    },
});

/** Get storage URL */
export const getStorageUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

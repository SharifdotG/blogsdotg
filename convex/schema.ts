import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,

    blogs: defineTable({
        title: v.string(),
        slug: v.string(),
        excerpt: v.string(),
        content: v.string(), // HTML from Tiptap
        coverImage: v.optional(v.string()), // Convex storage URL
        coverImageId: v.optional(v.id("_storage")),
        tags: v.array(v.string()),
        status: v.union(v.literal("draft"), v.literal("published")),
        publishedAt: v.optional(v.number()), // timestamp
        readingTime: v.string(),
        featured: v.boolean(),
        views: v.number(),
    })
        .index("by_slug", ["slug"])
        .index("by_status", ["status"])
        .index("by_status_publishedAt", ["status", "publishedAt"])
        .index("by_featured", ["featured"]),

    siteConfig: defineTable({
        key: v.string(),
        value: v.string(),
    }).index("by_key", ["key"]),
});

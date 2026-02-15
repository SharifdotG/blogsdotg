import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";

/** Get a site config value by key */
export const get = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        const config = await ctx.db
            .query("siteConfig")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();
        return config?.value ?? null;
    },
});

/** Get all site config entries */
export const getAll = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const configs = await ctx.db.query("siteConfig").collect();
        return Object.fromEntries(configs.map((c) => [c.key, c.value]));
    },
});

/** Set a site config value */
export const set = mutation({
    args: { key: v.string(), value: v.string() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const existing = await ctx.db
            .query("siteConfig")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value });
        } else {
            await ctx.db.insert("siteConfig", {
                key: args.key,
                value: args.value,
            });
        }
    },
});

import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";

const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

type AdminCtx =
    | Pick<QueryCtx, "auth" | "db">
    | Pick<MutationCtx, "auth" | "db">;

export async function requireAdmin(ctx: AdminCtx) {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
        throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    const userEmail =
        typeof user?.email === "string" ? user.email.trim().toLowerCase() : "";

    if (configuredAdminEmail && userEmail && userEmail === configuredAdminEmail) {
        return;
    }

    const users = await ctx.db.query("users").take(2);
    if (users.length === 1 && users[0]?._id === userId) {
        return;
    }

    throw new ConvexError("Not authorized");
}

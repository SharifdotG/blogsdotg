import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminBootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET?.trim();
const isAdminBootstrapEnabled =
    process.env.ADMIN_BOOTSTRAP_ENABLED?.trim().toLowerCase() === "true";

function getStringParam(
    params: Record<string, unknown>,
    key: string,
): string | undefined {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        Password({
            profile(params) {
                const configuredAdminEmail = adminEmail;
                if (!configuredAdminEmail) {
                    throw new ConvexError("Admin email is not configured.");
                }

                const emailValue = getStringParam(params, "email");
                if (!emailValue) {
                    throw new ConvexError("Email is required.");
                }

                const normalizedEmail = emailValue.toLowerCase().trim();
                if (!normalizedEmail) {
                    throw new ConvexError("Email is required.");
                }

                if (normalizedEmail !== configuredAdminEmail) {
                    throw new ConvexError("Unauthorized account.");
                }

                const flow = getStringParam(params, "flow");
                if (flow === "signUp") {
                    if (!isAdminBootstrapEnabled) {
                        throw new ConvexError("Admin bootstrap is disabled.");
                    }

                    if (!adminBootstrapSecret) {
                        throw new ConvexError("Admin bootstrap is disabled.");
                    }

                    const providedBootstrapSecret = getStringParam(
                        params,
                        "bootstrapSecret",
                    );
                    if (
                        !providedBootstrapSecret ||
                        providedBootstrapSecret.trim() !== adminBootstrapSecret
                    ) {
                        throw new ConvexError(
                            "Admin bootstrap is not allowed.",
                        );
                    }
                }

                return {
                    email: normalizedEmail,
                    name: "Admin",
                };
            },
        }),
    ],
});

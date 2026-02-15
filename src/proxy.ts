import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAdminBootstrapEnabled =
    process.env.ADMIN_BOOTSTRAP_ENABLED?.trim().toLowerCase() === "true";
const publicAdminRoutes = isAdminBootstrapEnabled
    ? ["/admin/login", "/admin/bootstrap"]
    : ["/admin/login"];
const isPublicAdminRoute = createRouteMatcher(publicAdminRoutes);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    const isAuthenticated = await convexAuth.isAuthenticated();

    if (isPublicAdminRoute(request) && isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/admin/dashboard");
    }

    if (
        isAdminRoute(request) &&
        !isPublicAdminRoute(request) &&
        !isAuthenticated
    ) {
        return nextjsMiddlewareRedirect(request, "/404");
    }
});

export const config = {
    matcher: [
        "/",
        "/admin/:path*",
        "/api/auth",
        "/api/auth/:path*",
        "/((?!.*\\..*|_next).*)",
    ],
};

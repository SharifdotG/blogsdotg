"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthActions } from "@convex-dev/auth/react";
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    Settings,
    LogOut,
    ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandWordmark } from "@/components/brand-wordmark";
import { cn } from "@/lib/utils";

const ADMIN_SIDEBAR_LINKS = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    { label: "All Posts", href: "/admin/posts", icon: FileText },
    { label: "New Post", href: "/admin/posts/new", icon: PlusCircle },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

function isLinkActive(pathname: string, href: string) {
    if (href === "/admin/dashboard") {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveSection(pathname: string) {
    const match = ADMIN_SIDEBAR_LINKS.find((link) =>
        isLinkActive(pathname, link.href),
    );
    return match?.label ?? "Admin";
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { signOut } = useAuthActions();
    const isAuthPage =
        pathname === "/admin/login" || pathname === "/admin/bootstrap";
    const activeSection = getActiveSection(pathname);

    const handleLogout = async () => {
        await signOut();
        router.push("/admin/login");
    };

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="absolute inset-0 bg-linear-to-br from-ctp-mauve/8 via-background to-ctp-blue/8" />
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,var(--ctp-surface0)_1px,transparent_1px),linear-gradient(to_bottom,var(--ctp-surface0)_1px,transparent_1px)] bg-size-[30px_30px]" />
            <div className="absolute -top-28 -left-12 h-80 w-80 rounded-full bg-ctp-mauve/15 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-ctp-blue/15 blur-3xl" />

            <div className="relative z-10 mx-auto w-full max-w-400 px-4 py-4 md:px-6 md:py-6">
                <div className="grid gap-4 lg:grid-cols-[17rem_1fr]">
                    <motion.aside
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="rounded-3xl border border-border/50 bg-card/70 backdrop-blur-xl shadow-xl shadow-black/5 flex flex-col lg:sticky lg:top-4 lg:h-[calc(100vh-3rem)]"
                    >
                        <div className="px-4 py-5 md:px-5">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2.5"
                            >
                                <BrandWordmark size="md" />
                            </Link>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Content management panel
                            </p>
                        </div>

                        <Separator className="bg-border/50" />

                        <nav className="flex-1 px-3 py-3 space-y-1.5">
                            {ADMIN_SIDEBAR_LINKS.map((link) => {
                                const isActive = isLinkActive(
                                    pathname,
                                    link.href,
                                );
                                return (
                                    <Link key={link.href} href={link.href}>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "relative w-full justify-start gap-3 rounded-xl px-3 py-2.5 h-auto text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-ctp-mauve/12 text-ctp-mauve"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-ctp-surface0/70",
                                            )}
                                        >
                                            <link.icon className="h-4 w-4" />
                                            {link.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>

                        <Separator className="bg-border/50" />

                        <div className="px-3 py-3 space-y-1.5">
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 rounded-xl px-3 py-2.5 h-auto text-sm text-muted-foreground hover:text-foreground hover:bg-ctp-surface0/70"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to Site
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start gap-3 rounded-xl px-3 py-2.5 h-auto text-sm text-ctp-red hover:text-ctp-red hover:bg-ctp-red/10"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </motion.aside>

                    <div className="min-w-0 space-y-4">
                        <motion.header
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="rounded-2xl border border-border/50 bg-card/65 backdrop-blur-xl px-4 py-3 md:px-5 md:py-4 shadow-lg shadow-black/5"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                                        Admin Panel
                                    </p>
                                    <h1 className="mt-1 text-lg md:text-xl font-heading font-semibold">
                                        {activeSection}
                                    </h1>
                                </div>
                                <ThemeToggle />
                            </div>
                        </motion.header>

                        <motion.main
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeOut",
                                delay: 0.05,
                            }}
                            className="rounded-3xl border border-border/50 bg-card/45 backdrop-blur-xl px-4 py-5 md:p-8 shadow-xl shadow-black/5"
                        >
                            {children}
                        </motion.main>
                    </div>
                </div>
            </div>
        </div>
    );
}

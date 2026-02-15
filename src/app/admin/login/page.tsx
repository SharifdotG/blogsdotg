"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, BookOpen, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BrandWordmark } from "@/components/brand-wordmark";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { signIn } = useAuthActions();
    const { isAuthenticated, isLoading } = useConvexAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/admin/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !password) {
            toast.error("Email and password are required");
            return;
        }

        setLoading(true);
        try {
            await signIn("password", {
                email: normalizedEmail,
                password,
                flow: "signIn",
            });
            toast.success("Welcome back!");
            router.push("/admin/dashboard");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Invalid credentials";
            toast.error(message);
        }
        setLoading(false);
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-linear-to-br from-ctp-mauve/10 via-background to-ctp-blue/10" />
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,var(--ctp-surface0)_1px,transparent_1px),linear-gradient(to_bottom,var(--ctp-surface0)_1px,transparent_1px)] bg-size-[30px_30px]" />
            <div className="absolute -top-28 -left-12 h-80 w-80 rounded-full bg-ctp-mauve/15 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-ctp-blue/15 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="rounded-3xl border-border/50 bg-card/78 backdrop-blur-xl shadow-xl shadow-black/10 py-0 overflow-hidden">
                    <div className="h-1.5 w-full bg-linear-to-r from-ctp-mauve via-ctp-blue to-ctp-sapphire" />
                    <CardHeader className="text-center space-y-3 pb-2 pt-7">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                delay: 0.16,
                            }}
                            className="mx-auto w-12 h-12 rounded-2xl bg-ctp-mauve/12 border border-ctp-mauve/20 flex items-center justify-center"
                        >
                            <BookOpen className="h-6 w-6 text-ctp-mauve" />
                        </motion.div>
                        <BrandWordmark size="lg" className="justify-center" />
                        <p className="text-sm text-muted-foreground">
                            Admin Panel
                        </p>
                    </CardHeader>

                    <CardContent className="pb-7">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="admin@example.com"
                                        className="h-11 rounded-xl pl-10 bg-ctp-surface0/70 border-border/50"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter admin password"
                                        className="h-11 rounded-xl pl-10 pr-10 bg-ctp-surface0/70 border-border/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 rounded-xl bg-ctp-mauve text-ctp-base hover:bg-ctp-mauve/90"
                                disabled={
                                    loading || isLoading || !email || !password
                                }
                            >
                                {loading || isLoading
                                    ? "Signing in..."
                                    : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-4">
                    This is a private admin area.
                </p>
            </motion.div>
        </main>
    );
}

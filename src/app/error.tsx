"use client";

import { motion } from "framer-motion";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-6 px-4"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 0.2,
                    }}
                    className="text-6xl md:text-7xl font-heading font-bold text-ctp-red"
                >
                    Oops!
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold">
                    Something went wrong
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    An unexpected error occurred. Please try again or go back to
                    the homepage.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={reset}
                        className="bg-ctp-mauve text-ctp-base hover:bg-ctp-mauve/90 gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="border-ctp-surface2 hover:bg-ctp-surface0 gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}

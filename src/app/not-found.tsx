"use client";

import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main className="min-h-[70vh] pt-28 pb-8 flex items-center justify-center">
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
                        className="text-8xl md:text-9xl font-heading font-bold bg-linear-to-r from-ctp-mauve to-ctp-blue bg-clip-text text-transparent"
                    >
                        404
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold">
                        Page Not Found
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        The page you&apos;re looking for doesn&apos;t exist or
                        has been moved.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/">
                            <Button className="bg-ctp-mauve text-ctp-base hover:bg-ctp-mauve/90 gap-2">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Button>
                        </Link>
                        <Link href="/blogs">
                            <Button
                                variant="outline"
                                className="border-ctp-surface2 hover:bg-ctp-surface0 gap-2"
                            >
                                <Search className="h-4 w-4" />
                                Browse Posts
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </>
    );
}

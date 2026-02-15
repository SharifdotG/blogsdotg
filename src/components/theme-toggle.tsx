"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function subscribe() {
    return () => {};
}

function getSnapshot() {
    return true;
}

function getServerSnapshot() {
    return false;
}

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );

    const isDark = mounted && resolvedTheme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative h-9 w-9 rounded-full hover:bg-ctp-surface0 transition-colors"
            aria-label="Toggle theme"
            disabled={!mounted}
        >
            {mounted ? (
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon className="h-4 w-4 text-ctp-blue" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ scale: 0, rotate: 90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun className="h-4 w-4 text-ctp-yellow" />
                        </motion.div>
                    )}
                </AnimatePresence>
            ) : (
                <span className="sr-only">Toggle theme</span>
            )}
        </Button>
    );
}

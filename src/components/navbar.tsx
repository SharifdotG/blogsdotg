"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

import { NAV_LINKS } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrandWordmark } from "@/components/brand-wordmark";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed top-4 inset-x-3 z-50 mx-auto box-border w-auto max-w-[calc(100dvw-1.5rem)] md:inset-x-4 md:max-w-3xl",
        mobileOpen ? "rounded-3xl" : "rounded-full",
        "border border-white/8 bg-background/60 backdrop-blur-2xl backdrop-saturate-150",
        "shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300",
        scrolled && "shadow-[0_8px_40px_rgba(0,0,0,0.2)]",
      )}
    >
      <nav className="flex h-14 w-full min-w-0 items-center justify-between px-3 sm:px-4 md:px-5">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative h-6 w-6 shrink-0"
          >
            <Image
              src="/logo.svg"
              alt="BlogsdotG logo"
              fill
              className="object-contain"
            />
          </motion.div>
          <BrandWordmark size="sm" className="hidden min-[360px]:inline-flex" />
        </Link>

        <div className="hidden md:flex items-center gap-0.5 mx-4">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link key={link.href} href={link.href}>
                <button
                  className={cn(
                    "relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                    isActive
                      ? "text-ctp-mauve"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-ctp-mauve/10 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="md:hidden overflow-hidden border-t border-white/6"
          >
            <div className="flex flex-col gap-1 p-3">
              {NAV_LINKS.map((link, i) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <motion.div
                    key={link.href}
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-ctp-mauve/10 text-ctp-mauve"
                          : "text-muted-foreground hover:bg-ctp-surface0/50 hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

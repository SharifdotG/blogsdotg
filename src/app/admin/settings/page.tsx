"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, Settings2 } from "lucide-react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_CONFIG } from "@/lib/constants";

export default function AdminSettingsPage() {
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const shouldFetchAdminData = !isAuthLoading && isAuthenticated;

    const configs = useQuery(
        api.siteConfig.getAll,
        shouldFetchAdminData ? undefined : "skip",
    );
    const setSiteConfig = useMutation(api.siteConfig.set);

    const [saving, setSaving] = useState(false);
    const [siteNameInput, setSiteNameInput] = useState<string | null>(null);
    const [taglineInput, setTaglineInput] = useState<string | null>(null);
    const [descriptionInput, setDescriptionInput] = useState<string | null>(
        null,
    );

    const siteName = siteNameInput ?? configs?.siteName ?? SITE_CONFIG.name;
    const tagline = taglineInput ?? configs?.tagline ?? SITE_CONFIG.tagline;
    const description =
        descriptionInput ?? configs?.description ?? SITE_CONFIG.description;

    const handleSave = async () => {
        if (!siteName.trim()) {
            toast.error("Site name is required");
            return;
        }

        setSaving(true);
        try {
            await Promise.all([
                setSiteConfig({ key: "siteName", value: siteName.trim() }),
                setSiteConfig({ key: "tagline", value: tagline.trim() }),
                setSiteConfig({
                    key: "description",
                    value: description.trim(),
                }),
            ]);
            toast.success("Settings saved");
        } catch {
            toast.error("Failed to save settings");
        }
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-2xl border border-border/50 bg-card/70 p-5 md:p-6 shadow-lg shadow-black/5"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-xl bg-ctp-mauve/12 p-2 text-ctp-mauve">
                            <Settings2 className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-heading font-bold">
                                Site Settings
                            </h2>
                            <p className="mt-1 text-sm md:text-base text-muted-foreground">
                                Configure metadata used by the blog.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={saving || configs === undefined}
                        className="h-10 rounded-xl gap-2 bg-ctp-mauve text-ctp-base hover:bg-ctp-mauve/90"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
            >
                <Card className="border-border/50 bg-card/70">
                    <CardHeader className="pb-2">
                        <CardTitle className="font-heading">General</CardTitle>
                        <CardDescription>
                            These values are stored in Convex and can be used
                            throughout the site.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-6">
                        {configs === undefined ? (
                            <div className="space-y-3">
                                <Skeleton className="h-11 w-full rounded-xl" />
                                <Skeleton className="h-11 w-full rounded-xl" />
                                <Skeleton className="h-28 w-full rounded-xl" />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="site-name">Site Name</Label>
                                    <Input
                                        id="site-name"
                                        value={siteName}
                                        onChange={(event) =>
                                            setSiteNameInput(event.target.value)
                                        }
                                        placeholder="BlogsdotG"
                                        className="h-11 rounded-xl bg-ctp-surface0/70 border-border/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="site-tagline">
                                        Tagline
                                    </Label>
                                    <Input
                                        id="site-tagline"
                                        value={tagline}
                                        onChange={(event) =>
                                            setTaglineInput(event.target.value)
                                        }
                                        placeholder="A minimal, beautiful and informative personal blog"
                                        className="h-11 rounded-xl bg-ctp-surface0/70 border-border/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="site-description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="site-description"
                                        value={description}
                                        onChange={(event) =>
                                            setDescriptionInput(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Thoughts on Programming, Technology, and Life"
                                        className="min-h-28 rounded-xl bg-ctp-surface0/70 border-border/50"
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.section>
        </div>
    );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
    slug: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
    publishedAt: string;
    readingTime: string;
    index?: number;
}

export function BlogCard({
    slug,
    title,
    excerpt,
    coverImage,
    tags,
    publishedAt,
    readingTime,
    index = 0,
}: BlogCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
        >
            <Link href={`/blogs/${slug}`} className="group block">
                <Card className="overflow-hidden border-border/50 bg-card hover:border-ctp-mauve/50 transition-all duration-300 hover:shadow-lg hover:shadow-ctp-mauve/5">
                    {/* Cover Image */}
                    {coverImage && (
                        <div className="relative overflow-hidden aspect-video">
                            <Image
                                src={coverImage}
                                alt={title}
                                fill
                                sizes="(max-width: 640px) 100vw, 50vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    )}

                    <CardContent className="p-5 space-y-3">
                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {tags.slice(0, 3).map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-xs bg-ctp-surface0 text-ctp-subtext0 hover:bg-ctp-surface1 border-0"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                                {tags.length > 3 && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs bg-ctp-surface0 text-ctp-subtext0 border-0"
                                    >
                                        +{tags.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Title */}
                        <h3 className="text-lg font-heading font-bold leading-tight group-hover:text-ctp-mauve transition-colors line-clamp-2">
                            {title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {publishedAt}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {readingTime}
                                </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-ctp-mauve group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

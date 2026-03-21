import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

const TAG_COLORS = [
  "bg-ctp-mauve/10 text-ctp-mauve hover:bg-ctp-mauve/20",
  "bg-ctp-blue/10 text-ctp-blue hover:bg-ctp-blue/20",
  "bg-ctp-green/10 text-ctp-green hover:bg-ctp-green/20",
  "bg-ctp-peach/10 text-ctp-peach hover:bg-ctp-peach/20",
  "bg-ctp-pink/10 text-ctp-pink hover:bg-ctp-pink/20",
  "bg-ctp-teal/10 text-ctp-teal hover:bg-ctp-teal/20",
  "bg-ctp-yellow/10 text-ctp-yellow hover:bg-ctp-yellow/20",
  "bg-ctp-red/10 text-ctp-red hover:bg-ctp-red/20",
  "bg-ctp-lavender/10 text-ctp-lavender hover:bg-ctp-lavender/20",
  "bg-ctp-sapphire/10 text-ctp-sapphire hover:bg-ctp-sapphire/20",
];

function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

export function TagBadge({
  tag,
  count,
  size = "sm",
  interactive = true,
}: TagBadgeProps) {
  const colorClass = getTagColor(tag);

  const content = (
    <Badge
      variant="secondary"
      className={cn(
        "max-w-full border-0 font-medium transition-colors cursor-pointer whitespace-normal wrap-break-word",
        colorClass,
        sizeClasses[size],
      )}
    >
      {tag}
      {count !== undefined && (
        <span className="ml-1.5 opacity-60">({count})</span>
      )}
    </Badge>
  );

  if (!interactive) return content;

  return <Link href={`/tags?tag=${encodeURIComponent(tag)}`}>{content}</Link>;
}

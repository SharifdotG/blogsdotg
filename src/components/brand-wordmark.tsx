import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
    className?: string;
    size?: "sm" | "md" | "lg";
};

const sizeClasses = {
    sm: { root: "text-base" },
    md: { root: "text-lg" },
    lg: { root: "text-2xl" },
} as const;

export function BrandWordmark({ className, size = "lg" }: BrandWordmarkProps) {
    return (
        <span
            aria-label="BlogsdotG"
            className={cn(
                "inline-flex items-baseline gap-1 leading-none",
                sizeClasses[size].root,
                className,
            )}
        >
            {/* "Blogs" - DM Sans heavy with shimmering gradient */}
            <span
                className="inline-block bg-clip-text text-transparent tracking-tight"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg,var(--ctp-mauve),var(--ctp-blue),var(--ctp-sapphire))",
                    backgroundSize: "200% 200%",
                    fontFamily:
                        '"DM Sans", "DM Sans Black", "DM Sans ExtraBold", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                    fontWeight: 800,
                    textShadow: "0 6px 20px rgba(99,102,241,0.06)",
                }}
            >
                Blogs
            </span>

            {/* "dotG" - combined and matches Blogs size */}
            <span
                className="inline-block rounded-md bg-clip-text text-transparent"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg,var(--ctp-sapphire),var(--ctp-blue),var(--ctp-mauve))",
                    backgroundSize: "180% 180%",
                    fontFamily:
                        '"Cascadia Code", ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace',
                    fontWeight: 700,
                    fontStyle: "italic",
                    fontFeatureSettings: "'ss01' 1",
                    letterSpacing: "0.6px",
                    transformOrigin: "center",
                    textShadow: "0 4px 18px rgba(59,130,246,0.06)",
                }}
            >
                dotG
            </span>
        </span>
    );
}

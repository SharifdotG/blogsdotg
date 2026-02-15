import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
    variable: "--font-bricolage",
    subsets: ["latin"],
    display: "swap",
});

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    display: "swap",
});

const cascadiaCode = localFont({
    src: "./fonts/CascadiaCode.woff2",
    variable: "--font-cascadia",
    display: "swap",
});

function getSafeMetadataBase(siteUrl: string) {
    try {
        return new URL(siteUrl);
    } catch {
        return undefined;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const defaultTitle = `${SITE_CONFIG.name} — ${SITE_CONFIG.author.name}'s Blog`;
    const template = SITE_CONFIG.seoTitleSuffix.includes("%s")
        ? SITE_CONFIG.seoTitleSuffix
        : `%s ${SITE_CONFIG.seoTitleSuffix}`.trim();

    return {
        metadataBase: getSafeMetadataBase(SITE_CONFIG.url),
        title: {
            default: defaultTitle,
            template,
        },
        description: SITE_CONFIG.description,
        keywords: [
            "blog",
            "programming",
            "technology",
            SITE_CONFIG.author.name,
            SITE_CONFIG.name,
            "personal blog",
        ],
        authors: [{ name: SITE_CONFIG.author.name }],
        creator: SITE_CONFIG.author.name,
        openGraph: {
            type: "website",
            locale: "en_US",
            siteName: SITE_CONFIG.name,
            title: defaultTitle,
            description: SITE_CONFIG.description,
        },
        twitter: {
            card: "summary_large_image",
            title: defaultTitle,
            description: SITE_CONFIG.description,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${bricolage.variable} ${dmSans.variable} ${cascadiaCode.variable} antialiased`}
            >
                <ConvexAuthNextjsServerProvider>
                    <ConvexClientProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                            <Toaster
                                position="bottom-right"
                                toastOptions={{
                                    style: {
                                        background: "var(--ctp-mantle)",
                                        border: "1px solid var(--ctp-surface0)",
                                        color: "var(--ctp-text)",
                                    },
                                }}
                            />
                        </ThemeProvider>
                    </ConvexClientProvider>
                </ConvexAuthNextjsServerProvider>
            </body>
        </html>
    );
}

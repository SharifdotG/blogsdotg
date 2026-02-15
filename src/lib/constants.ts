export const SITE_CONFIG = {
    name: "BlogsdotG",
    tagline: "A minimal, beautiful and informative personal blog",
    description: "Thoughts on Programming, Technology, and Life ig :3",
    seoTitleSuffix: "| BlogsdotG",
    copyrightText: "All rights reserved.",
    author: {
        name: "Sharif Md. Yousuf",
        bio: "Trainee Software Engineer Intern at Bangladesh Software Solution (BSS). A passionate developer who loves building things and sharing knowledge.",
        avatar: "/profile.png",
        github: "https://github.com/SharifdotG",
        twitter: "https://x.com/SharifdotG",
        linkedin: "https://www.linkedin.com/in/sharifdotg/",
        email: "sharifmdyousuf007@gmail.com",
    },
    url: "https://blogsdotg.vercel.app",
    repoUrl: "https://github.com/SharifdotG/blogsdotg",
} as const;

export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Blogs", href: "/blogs" },
    { label: "Tags", href: "/tags" },
    { label: "About", href: "/about" },
] as const;

export const POSTS_PER_PAGE = 9;

export const ADMIN_SECRET_PATH = "/admin/login";

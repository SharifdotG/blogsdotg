import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";

import { api } from "../../../../convex/_generated/api";
import { SITE_CONFIG } from "@/lib/constants";
import BlogDetailClient from "./blog-detail-client";

type BlogSlugPageProps = {
  params: Promise<{ slug: string }>;
};

const FALLBACK_PREVIEW_IMAGE = "/profile.png";

function toAbsoluteUrl(pathOrUrl: string) {
  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(pathOrUrl, SITE_CONFIG.url).toString();
  }
}

async function getBlogBySlug(slug: string) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return null;

  try {
    const client = new ConvexHttpClient(convexUrl);
    return await client.query(api.blogs.getBySlug, { slug });
  } catch {
    return null;
  }
}

async function getPreviewImageUrl(
  blog: NonNullable<Awaited<ReturnType<typeof getBlogBySlug>>>,
) {
  const fallbackImage = toAbsoluteUrl(FALLBACK_PREVIEW_IMAGE);

  if (blog.coverImageId) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

    if (convexUrl) {
      try {
        const client = new ConvexHttpClient(convexUrl);
        const storageImage = await client.query(api.blogs.getStorageUrl, {
          storageId: blog.coverImageId,
        });

        if (storageImage) {
          return toAbsoluteUrl(storageImage);
        }
      } catch {
        // Fall back to any existing image URL.
      }
    }
  }

  if (blog.coverImage) {
    return toAbsoluteUrl(blog.coverImage);
  }

  return fallbackImage;
}

export async function generateMetadata({
  params,
}: BlogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = toAbsoluteUrl(`/blogs/${slug}`);
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog not found",
      description: SITE_CONFIG.description,
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = blog.excerpt || SITE_CONFIG.description;
  const previewImage = await getPreviewImageUrl(blog);

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: blog.title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: previewImage,
          alt: blog.title,
        },
      ],
      publishedTime: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString()
        : undefined,
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [previewImage],
    },
  };
}

export default function BlogDetailPage({ params }: BlogSlugPageProps) {
  return <BlogDetailClient params={params} />;
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types";

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return (data as Post) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Article not found | Luzon Prime Realtors" };
  }
  const description =
    post.content?.replace(/\s+/g, " ").slice(0, 155) ??
    "Insights from Luzon Prime Realtors.";
  return {
    title: `${post.title} | Luzon Prime Realtors`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      type: "article",
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const paragraphs = (post.content ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="bg-[var(--color-bg)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-[1.125rem] lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
        >
          <ArrowLeft size={15} /> All insights
        </Link>

        <h1 className="font-heading mt-6 text-3xl font-bold leading-tight text-[var(--color-text)] sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
          <CalendarDays size={14} /> {formatDate(post.created_at)}
        </p>

        {post.cover_image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--color-bg-muted)]">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8 flex flex-col gap-5">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-[var(--color-text-muted)]"
              >
                {para}
              </p>
            ))
          ) : (
            <p className="text-base leading-relaxed text-[var(--color-text-muted)]">
              This article has no content yet.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

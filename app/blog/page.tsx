import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Insights & Blog | Luzon Prime Realtors",
  description:
    "Market insights, neighbourhood guides, and property advice from the Luzon Prime Realtors team.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Insights & Blog | Luzon Prime Realtors",
    description:
      "Market insights, neighbourhood guides, and property advice from Luzon Prime Realtors.",
    url: "/blog",
    type: "website",
  },
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as Post[];

  return (
    <div className="bg-[var(--color-bg)]">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
          <h1 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            Stay updated with our latest insights
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
            Neighbourhood guides, market trends, and practical advice to help
            you buy, sell, and invest smarter.
          </p>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-[1.125rem] lg:px-8">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <Newspaper size={28} className="text-[var(--color-text-muted)]" />
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              No articles published yet — our first insights are on the way.
              Check back soon.
            </p>
          </div>
        ) : (
          <AnimatedStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <AnimatedStaggerItem key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-muted)]">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                        <Newspaper size={28} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                      <CalendarDays size={13} /> {formatDate(post.created_at)}
                    </span>
                    <h2 className="mt-2 line-clamp-2 text-base font-semibold text-[var(--color-text)]">
                      {post.title}
                    </h2>
                    <span className="mt-auto pt-3 text-sm font-semibold text-[var(--color-heading)]">
                      Read article →
                    </span>
                  </div>
                </Link>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </section>
    </div>
  );
}

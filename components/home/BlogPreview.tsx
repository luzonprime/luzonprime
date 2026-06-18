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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function BlogPreview() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const posts = (data ?? []) as Post[];
  if (posts.length === 0) return null;

  return (
    <section className="bg-[var(--color-bg-muted)] px-4 py-16 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <AnimatedSection>
            <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)]" />
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Stay updated with our latest insights
            </h2>
          </AnimatedSection>
          <Link
            href="/blog"
            className="hidden shrink-0 text-sm font-semibold text-[var(--color-heading)] sm:inline-block"
          >
            See all →
          </Link>
        </div>

        <AnimatedStagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                      <Newspaper size={26} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                    <CalendarDays size={13} /> {formatDate(post.created_at)}
                  </span>
                  <h3 className="mt-2 line-clamp-2 text-base font-semibold text-[var(--color-text)]">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-block rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white"
          >
            See all blogs
          </Link>
        </div>
      </div>
    </section>
  );
}

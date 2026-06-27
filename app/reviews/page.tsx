import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ReviewsBoard } from "@/components/reviews/ReviewsBoard";
import { GoogleReviewsCta } from "@/components/shared/GoogleReviews";
import type { Review } from "@/types";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Read what clients say about Luzon Prime Realtors, and share your own experience.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const supabase = await createClient();

  const [
    {
      data: { user },
    },
    { data },
    { data: settingsData },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("reviews").select("*").order("created_at", { ascending: true }),
    supabase
      .from("site_settings")
      .select("google_reviews_url, google_rating, google_review_count")
      .eq("id", 1)
      .single(),
  ]);

  const reviews = (data ?? []) as Review[];

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-[1.125rem] lg:px-8">
      <header>
        <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
        <h1 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
          Client reviews
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">
          Hear from people who found their prime property with us — and share
          your own story. Join the conversation by replying to any review.
        </p>

        <div className="mt-5">
          <GoogleReviewsCta
            url={settingsData?.google_reviews_url ?? null}
            rating={settingsData?.google_rating ?? null}
            count={settingsData?.google_review_count ?? null}
          />
        </div>
      </header>

      <div className="mt-10">
        <ReviewsBoard
          reviews={reviews}
          currentUserId={user?.id ?? null}
          isLoggedIn={Boolean(user)}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}

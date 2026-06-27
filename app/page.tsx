import { createClient } from "@/lib/supabase/server";
import type { Award } from "@/types";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { StatsBar } from "@/components/home/StatsBar";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { CategoryCurations } from "@/components/home/CategoryCurations";
import { BuyAbilityBanner } from "@/components/home/BuyAbilityBanner";
import { PropertyMarquee } from "@/components/home/PropertyMarquee";
import { Neighborhoods } from "@/components/home/Neighborhoods";
import { BlueprintStatement } from "@/components/home/BlueprintStatement";
import { WhyUs } from "@/components/home/WhyUs";
import { AgentsPreview } from "@/components/home/AgentsPreview";
import { ClientReviews, type HomeReview } from "@/components/home/ClientReviews";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

export default async function Home() {
  const supabase = await createClient();
  const [{ data: awardData }, { data: reviewData }, { count: reviewTotal }, { data: settingsData }] =
    await Promise.all([
      supabase
        .from("awards")
        .select("year, title, image_url")
        .eq("is_active", true)
        .order("sort_order")
        .limit(4),
      supabase
        .from("reviews")
        .select("id, author_name, author_role, rating, body, source")
        .eq("is_featured", true)
        .is("parent_id", null)
        .order("created_at", { ascending: false })
        .limit(2),
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .is("parent_id", null),
      supabase
        .from("site_settings")
        .select("google_reviews_url, google_rating, google_review_count")
        .eq("id", 1)
        .single(),
    ]);
  const awards = (awardData ?? []) as Pick<Award, "year" | "title" | "image_url">[];
  const reviews = (reviewData ?? []) as HomeReview[];
  const google = {
    url: settingsData?.google_reviews_url ?? null,
    rating: settingsData?.google_rating ?? null,
    count: settingsData?.google_review_count ?? null,
  };

  return (
    <>
      <HeroSection awards={awards} />
      <TrustMarquee />
      <StatsBar />
      <FeaturedListings />
      <CategoryCurations />
      <BuyAbilityBanner />
      <PropertyMarquee />
      <Neighborhoods />
      <BlueprintStatement />
      <WhyUs />
      <AgentsPreview />
      <ClientReviews
        reviews={reviews}
        totalCount={reviewTotal ?? reviews.length}
        google={google}
      />
      <BlogPreview />
      <NewsletterBanner />
    </>
  );
}

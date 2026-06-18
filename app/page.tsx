import { createClient } from "@/lib/supabase/server";
import type { Award } from "@/types";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { StatsBar } from "@/components/home/StatsBar";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { CategoryCurations } from "@/components/home/CategoryCurations";
import { PropertyMarquee } from "@/components/home/PropertyMarquee";
import { Neighborhoods } from "@/components/home/Neighborhoods";
import { BlueprintStatement } from "@/components/home/BlueprintStatement";
import { WhyUs } from "@/components/home/WhyUs";
import { AgentsPreview } from "@/components/home/AgentsPreview";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

export default async function Home() {
  const supabase = await createClient();
  const { data: awardData } = await supabase
    .from("awards")
    .select("year, title, image_url")
    .eq("is_active", true)
    .order("sort_order")
    .limit(4);
  const awards = (awardData ?? []) as Pick<Award, "year" | "title" | "image_url">[];

  return (
    <>
      <HeroSection awards={awards} />
      <TrustMarquee />
      <StatsBar />
      <FeaturedListings />
      <CategoryCurations />
      <PropertyMarquee />
      <Neighborhoods />
      <BlueprintStatement />
      <WhyUs />
      <AgentsPreview />
      <TestimonialsCarousel />
      <BlogPreview />
      <NewsletterBanner />
    </>
  );
}

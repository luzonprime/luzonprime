import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { CategoryCurations } from "@/components/home/CategoryCurations";
import { WhyUs } from "@/components/home/WhyUs";
import { AgentsPreview } from "@/components/home/AgentsPreview";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedListings />
      <CategoryCurations />
      <WhyUs />
      <AgentsPreview />
      <TestimonialsCarousel />
      <NewsletterBanner />
    </>
  );
}

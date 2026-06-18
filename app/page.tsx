import { HeroSection } from "@/components/home/HeroSection";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { StatsBar } from "@/components/home/StatsBar";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { CategoryCurations } from "@/components/home/CategoryCurations";
import { Neighborhoods } from "@/components/home/Neighborhoods";
import { WhyUs } from "@/components/home/WhyUs";
import { AgentsPreview } from "@/components/home/AgentsPreview";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustMarquee />
      <StatsBar />
      <FeaturedListings />
      <CategoryCurations />
      <Neighborhoods />
      <WhyUs />
      <AgentsPreview />
      <TestimonialsCarousel />
      <BlogPreview />
      <NewsletterBanner />
    </>
  );
}

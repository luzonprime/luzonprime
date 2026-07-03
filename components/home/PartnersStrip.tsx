import { SectionHeader } from "@/components/home/SectionHeader";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";
import { PartnerTile } from "@/components/partners/PartnerTile";
import type { Partner } from "@/types";

export type HomePartner = Pick<
  Partner,
  "id" | "name" | "logo_url" | "website_url" | "bg_color"
>;

export function PartnersStrip({
  partners,
  totalCount,
}: {
  partners: HomePartner[];
  totalCount: number;
}) {
  if (partners.length === 0) return null;

  return (
    <section className="bg-[var(--color-bg)] px-4 py-16 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <SectionHeader
            eyebrow="Our partners"
            title="Trusted by leading brands"
            description="We collaborate with developers, consultants, and industry partners to deliver exceptional real estate outcomes."
            seeAllHref={totalCount > partners.length ? "/partners" : undefined}
            seeAllLabel="View all partners"
          />
        </AnimatedSection>

        <AnimatedStagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <AnimatedStaggerItem key={partner.id}>
              <PartnerTile partner={partner} />
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}

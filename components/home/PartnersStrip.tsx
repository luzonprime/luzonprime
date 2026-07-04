import { SectionHeader } from "@/components/home/SectionHeader";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";
import { Marquee } from "@/components/shared/Marquee";
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
            description="We collaborate with developers, consultants, clients, and industry partners to deliver exceptional real estate outcomes."
            seeAllHref={totalCount > partners.length ? "/partners" : undefined}
            seeAllLabel="View all partners"
          />
        </AnimatedSection>

        {/* Mobile: auto-scrolling marquee, ~2 logos in view, sliding batch after batch */}
        <div className="mt-8 sm:hidden">
          <Marquee speedSeconds={24}>
            {partners.map((partner) => (
              <div key={partner.id} className="w-[44vw] max-w-[240px] shrink-0 px-1.5">
                <PartnerTile partner={partner} />
              </div>
            ))}
          </Marquee>
        </div>

        {/* Tablet & up: static grid */}
        <AnimatedStagger className="mt-8 hidden gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-6">
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

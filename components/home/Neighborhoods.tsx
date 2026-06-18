import Image from "next/image";
import Link from "next/link";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";

// Global destinations — reinforces the multi-city / multi-currency positioning.
const PLACES = [
  { name: "Lagos", country: "Nigeria", image: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?auto=format&fit=crop&w=900&q=70" },
  { name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=70" },
  { name: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=70" },
  { name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=70" },
  { name: "Accra", country: "Ghana", image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=900&q=70" },
  { name: "Singapore", country: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=70" },
];

export function Neighborhoods() {
  return (
    <section className="bg-[var(--color-bg)] px-4 py-16 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)]" />
          <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Find your ideal location
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">
            From Lagos to London — explore prime property in the cities our
            clients call home.
          </p>
        </AnimatedSection>

        <AnimatedStagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {PLACES.map((place) => (
            <AnimatedStaggerItem key={place.name}>
              <Link
                href={`/listings?location=${encodeURIComponent(place.name)}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={place.image}
                  alt={`Property in ${place.name}, ${place.country}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-base font-semibold text-white">{place.name}</p>
                  <p className="text-xs text-white/75">{place.country}</p>
                </div>
              </Link>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}

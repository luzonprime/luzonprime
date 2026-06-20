"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, CalendarCheck, Mail, Info, Wallet, X } from "lucide-react";
import { Price } from "@/components/shared/Price";
import { Button } from "@/components/ui/Button";
import { InquiryModal } from "@/components/listings/InquiryForm";
import type { Property } from "@/types";

export function PropertyEnquiryCTA({ property }: { property: Property }) {
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [buyAbilityMode, setBuyAbilityMode] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in "${property.title}" on Luzon Prime Realtors.`);
  const buyHref = `/buy-ability?property=${property.id}`;

  const buyAbilityButton = (
    <Link
      href={buyHref}
      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white"
    >
      <Wallet size={16} /> Get Buy-Ability
    </Link>
  );

  const whatsappButton = whatsappNumber ? (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white"
    >
      <MessageCircle size={16} /> WhatsApp
    </a>
  ) : null;

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="hidden lg:sticky lg:top-24 lg:block lg:w-80 lg:shrink-0">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <Price amount={property.price} fallback={property.price_label} className="text-2xl font-bold text-[var(--color-heading)]" />

          {property.buy_ability && (
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="mt-2 flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-500"
            >
              <Wallet size={15} /> Within Buy-Ability <Info size={13} />
            </button>
          )}

          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={() => setOpen(true)} className="w-full">
              <Mail size={16} className="mr-1.5" /> Enquire
            </Button>
            <Button onClick={() => setOpen(true)} variant="outline" className="w-full">
              <CalendarCheck size={16} className="mr-1.5" /> Book a visit
            </Button>
            {buyAbilityMode ? buyAbilityButton : whatsappButton}
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-3 lg:hidden">
        <div className="flex-1">
          <Price amount={property.price} fallback={property.price_label} className="text-sm font-bold text-[var(--color-heading)]" />
          {property.buy_ability && (
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-500"
            >
              <Wallet size={12} /> Buy-Ability <Info size={11} />
            </button>
          )}
        </div>
        {buyAbilityMode ? (
          <Link href={buyHref} className="flex h-10 items-center gap-1.5 rounded-full bg-green-600 px-4 text-sm font-semibold text-white">
            <Wallet size={16} /> Buy-Ability
          </Link>
        ) : (
          whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"
            >
              <MessageCircle size={18} />
            </a>
          )
        )}
        <Button onClick={() => setOpen(true)}>Enquire</Button>
      </div>

      {/* Buy-Ability info dialog */}
      {infoOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-heading flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
                <Wallet size={18} className="text-green-600" /> About Buy-Ability
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setInfoOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
              This home offers <strong>Buy-Ability</strong> — flexible financing so you
              can see, in real time, what you can afford and move forward with
              confidence. Tell us your numbers and we&apos;ll match you and follow up.
            </p>
            {property.buy_ability_percent != null && (
              <p className="mt-2 text-sm font-semibold text-green-700 dark:text-green-500">
                Up to {property.buy_ability_percent}% of the price is eligible for Buy-Ability.
              </p>
            )}
            <label className="mt-4 flex items-start gap-2 text-sm text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={buyAbilityMode}
                onChange={(e) => setBuyAbilityMode(e.target.checked)}
                className="mt-0.5"
              />
              I&apos;m inquiring to get Buy-Ability for this property.
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setInfoOpen(false)}>
                Close
              </Button>
              {buyAbilityMode && (
                <Link
                  href={buyHref}
                  className="flex items-center gap-1.5 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <Wallet size={16} /> Get Buy-Ability
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <InquiryModal
        propertyId={property.id}
        propertyTitle={property.title}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

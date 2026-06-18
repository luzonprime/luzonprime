"use client";

import { useState } from "react";
import { MessageCircle, CalendarCheck, Mail } from "lucide-react";
import { Price } from "@/components/shared/Price";
import { Button } from "@/components/ui/Button";
import { InquiryModal } from "@/components/listings/InquiryForm";
import type { Property } from "@/types";

export function PropertyEnquiryCTA({ property }: { property: Property }) {
  const [open, setOpen] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in "${property.title}" on Luzon Prime Realtors.`);

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="hidden lg:sticky lg:top-24 lg:block lg:w-80 lg:shrink-0">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <Price
            amount={property.price}
            fallback={property.price_label}
            className="text-2xl font-bold text-[var(--color-heading)]"
          />
          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={() => setOpen(true)} className="w-full">
              <Mail size={16} className="mr-1.5" /> Enquire
            </Button>
            <Button onClick={() => setOpen(true)} variant="outline" className="w-full">
              <CalendarCheck size={16} className="mr-1.5" /> Book a visit
            </Button>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-3 lg:hidden">
        <div className="flex-1">
          <Price
            amount={property.price}
            fallback={property.price_label}
            className="text-sm font-bold text-[var(--color-heading)]"
          />
        </div>
        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"
          >
            <MessageCircle size={18} />
          </a>
        )}
        <Button onClick={() => setOpen(true)}>Enquire</Button>
      </div>

      <InquiryModal
        propertyId={property.id}
        propertyTitle={property.title}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

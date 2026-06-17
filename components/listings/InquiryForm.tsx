"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  message: z.string().optional(),
});
type InquiryInput = z.infer<typeof inquirySchema>;

export function InquiryModal({
  propertyId,
  propertyTitle,
  open,
  onClose,
}: {
  propertyId: string;
  propertyTitle: string;
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({ resolver: zodResolver(inquirySchema) });

  async function onSubmit(values: InquiryInput) {
    setStatus("loading");
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, property_id: propertyId, inquiry_type: "general" }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="fixed inset-x-4 top-1/2 z-[90] max-w-md -translate-y-1/2 rounded-2xl bg-[var(--color-surface)] p-6 sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Enquire about this property</h2>
              <button type="button" onClick={onClose} aria-label="Close">
                <X size={20} className="text-[var(--color-text-muted)]" />
              </button>
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{propertyTitle}</p>

            {status === "done" ? (
              <p className="mt-6 text-sm text-[var(--color-text)]">
                Thanks for reaching out — we&apos;ll be in touch shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-3">
                <Input label="Name" {...register("name")} error={errors.name?.message} />
                <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
                <Input label="Phone (optional)" {...register("phone")} />
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-sm font-medium text-[var(--color-text)]">Message (optional)</label>
                  <textarea
                    rows={3}
                    {...register("message")}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-500">Something went wrong, please try again.</p>
                )}
                <Button type="submit" disabled={status === "loading"} className="mt-1 w-full">
                  {status === "loading" ? "Sending…" : "Send enquiry"}
                </Button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

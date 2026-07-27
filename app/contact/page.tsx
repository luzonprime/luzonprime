"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  inquiry_type: z.enum(["purchase", "rent", "valuation", "general"]),
});
type ContactInput = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiry_type: "general" },
  });

  async function onSubmit(values: ContactInput) {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-[1.125rem] lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-[var(--color-text)]">Contact us</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">
        Whether you&apos;re buying, selling, or just exploring options, our
        team is here to help. Reach out today and let&apos;s start the
        conversation.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 text-[var(--color-primary)] dark:text-[var(--color-accent)]" />
            <div>
              <p className="font-semibold text-[var(--color-text)]">Office</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                1 Kudang Street
                <br />
                Wuse 2
                <br />
                Abuja, Nigeria
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 text-[var(--color-primary)] dark:text-[var(--color-accent)]" />
            <div>
              <p className="font-semibold text-[var(--color-text)]">Legal</p>
              <a
                href="mailto:legal.team@luzonprime.com"
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              >
                legal.team@luzonprime.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 text-[var(--color-primary)] dark:text-[var(--color-accent)]" />
            <div>
              <p className="font-semibold text-[var(--color-text)]">Email</p>
              <a
                href="mailto:support@luzonprime.com"
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              >
                support@luzonprime.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 text-[var(--color-primary)] dark:text-[var(--color-accent)]" />
            <div>
              <p className="font-semibold text-[var(--color-text)]">Phone</p>
              <a
                href="tel:+2349066792730"
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              >
                0906 679 2730
              </a>
            </div>
          </div>

          {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && (
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Name" {...register("name")} error={errors.name?.message} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="Phone (optional)" {...register("phone")} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text)]">I&apos;m interested in</label>
            <select
              {...register("inquiry_type")}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            >
              <option value="general">General inquiry</option>
              <option value="purchase">Buying a property</option>
              <option value="rent">Renting a property</option>
              <option value="valuation">Property valuation</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text)]">Message</label>
            <textarea
              rows={4}
              {...register("message")}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            />
            {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
          </div>

          {status === "done" && (
            <p className="text-sm text-green-600">Thanks for reaching out — we&apos;ll be in touch shortly.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-500">Something went wrong, please try again.</p>
          )}

          <Button type="submit" disabled={status === "loading"} className="mt-1 w-full sm:w-auto">
            {status === "loading" ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
}

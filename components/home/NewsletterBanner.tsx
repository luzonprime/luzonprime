"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-[1.125rem]">
      <Image
        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=70"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#091f46]/88" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Get exclusive listings in your inbox
        </h2>
        <p className="mt-2 max-w-md text-sm text-white/70">
          New properties, market insights, and off-market opportunities —
          delivered before they hit the listings page.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 bg-[var(--color-accent)] text-[var(--color-primary)] hover:brightness-105"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>

        {status === "done" && (
          <p className="mt-3 text-sm text-white/80">Thanks for subscribing!</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-300">Something went wrong, please try again.</p>
        )}
      </div>
    </section>
  );
}

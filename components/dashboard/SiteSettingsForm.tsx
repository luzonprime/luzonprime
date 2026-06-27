"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateSiteSettings } from "@/app/actions/settings";
import type { SiteSettings } from "@/types";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      await updateSiteSettings(new FormData(e.currentTarget));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Contact email"
          name="contact_email"
          type="email"
          defaultValue={settings.contact_email ?? ""}
          placeholder="support@luzonprime.com"
        />
        <Input
          label="Contact phone"
          name="contact_phone"
          defaultValue={settings.contact_phone ?? ""}
          placeholder="+234..."
        />
      </div>

      <Input
        label="Office address"
        name="office_address"
        defaultValue={settings.office_address ?? ""}
        placeholder="123 Marina Road, Lagos Island, Lagos"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Facebook URL" name="facebook_url" defaultValue={settings.facebook_url ?? ""} />
        <Input label="Instagram URL" name="instagram_url" defaultValue={settings.instagram_url ?? ""} />
        <Input label="Twitter / X URL" name="twitter_url" defaultValue={settings.twitter_url ?? ""} />
        <Input label="LinkedIn URL" name="linkedin_url" defaultValue={settings.linkedin_url ?? ""} />
      </div>

      <Input
        label="Featured areas (comma separated)"
        name="featured_areas"
        defaultValue={(settings.featured_areas ?? []).join(", ")}
        placeholder="Ikoyi, Victoria Island, Lekki, Banana Island"
      />

      <div className="rounded-xl border border-[var(--color-border)] p-4">
        <p className="text-sm font-semibold text-[var(--color-text)]">Google reviews</p>
        <p className="mb-3 mt-1 text-xs text-[var(--color-text-muted)]">
          Shown as a “Find us on Google” badge on the home page and reviews page.
        </p>
        <Input
          label="Google profile / reviews URL"
          name="google_reviews_url"
          defaultValue={settings.google_reviews_url ?? ""}
          placeholder="https://share.google/…"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Google rating (1–5)"
            name="google_rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={settings.google_rating ?? ""}
            placeholder="4.9"
          />
          <Input
            label="Google review count"
            name="google_review_count"
            type="number"
            min="0"
            defaultValue={settings.google_review_count ?? ""}
            placeholder="128"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Settings saved.</p>}

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { updateOwnProfile } from "@/app/actions/profile";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CurrencySwitcher } from "@/components/shared/CurrencySwitcher";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";

export function AccountSettings({
  profile,
}: {
  profile: {
    id: string;
    full_name: string | null;
    phone: string | null;
    bio: string | null;
    avatar_url: string | null;
    role: string;
  };
}) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateOwnProfile({
          full_name: fullName,
          phone: phone || null,
          bio: bio || null,
        });
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Profile</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Update how your name and details appear across Luzon Prime Realtors.
        </p>

        <div className="mt-4">
          <AvatarUpload
            userId={profile.id}
            currentUrl={profile.avatar_url}
            name={profile.full_name}
          />
        </div>

        <form onSubmit={onSubmit} className="mt-5 flex max-w-xl flex-col gap-4">
          <Input
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0906 679 2730"
          />
          {profile.role === "agent" && (
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-medium text-[var(--color-text)]">Bio</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell clients about your expertise…"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && <p className="text-sm text-green-600">Profile updated.</p>}

          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </section>

      {/* Preferences */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Preferences</h2>
        <div className="mt-4 flex flex-col divide-y divide-[var(--color-border)]">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Theme</p>
              <p className="text-xs text-[var(--color-text-muted)]">Switch between light and dark.</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Currency</p>
              <p className="text-xs text-[var(--color-text-muted)]">Currency used to display prices.</p>
            </div>
            <CurrencySwitcher />
          </div>
        </div>
      </section>
    </div>
  );
}

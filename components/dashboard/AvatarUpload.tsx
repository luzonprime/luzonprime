"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Trash2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateAvatar } from "@/app/actions/profile";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export function AvatarUpload({
  userId,
  currentUrl,
  name,
}: {
  userId: string;
  currentUrl: string | null;
  name: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [busy, setBusy] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 5MB.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      await updateAvatar(pub.publicUrl);
      setUrl(pub.publicUrl);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function remove() {
    setError(null);
    startTransition(async () => {
      try {
        await updateAvatar(null);
        setUrl(null);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not remove.");
      }
    });
  }

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
        {url ? (
          <Image src={url} alt={name ?? "Avatar"} fill sizes="80px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
            <User size={28} />
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Camera size={15} /> {busy ? "Uploading…" : "Upload photo"}
          </button>
          {url && (
            <button
              type="button"
              onClick={remove}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
            >
              <Trash2 size={15} /> Remove
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          JPG, PNG or WebP, up to 5MB.
        </p>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}

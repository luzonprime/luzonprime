"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CalendarCheck, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Notif = { id: string; type: "inquiry" | "booking"; title: string; time: string };

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      // RLS scopes these to the current role (admin: all; agent/client: own).
      const [{ data: inq }, { data: bk }] = await Promise.all([
        supabase
          .from("inquiries")
          .select("id, name, created_at")
          .eq("status", "new")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("bookings")
          .select("id, created_at")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);
      if (!active) return;

      const inquiries = (inq ?? []) as { id: string; name: string | null; created_at: string }[];
      const bookings = (bk ?? []) as { id: string; created_at: string }[];

      const items: Notif[] = [
        ...inquiries.map((i) => ({
          id: `i-${i.id}`,
          type: "inquiry" as const,
          title: `New inquiry${i.name ? ` from ${i.name}` : ""}`,
          time: i.created_at,
        })),
        ...bookings.map((b) => ({
          id: `b-${b.id}`,
          type: "booking" as const,
          title: "Pending consultation",
          time: b.created_at,
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      setNotifs(items);
    }

    load();
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => {
      active = false;
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const count = notifs.length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${count ? ` (${count} unread)` : ""}`}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
      >
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
            Notifications
          </div>
          {count === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
              You&apos;re all caught up.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifs.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-0"
                >
                  <span className="mt-0.5 text-[var(--color-heading)]">
                    {n.type === "inquiry" ? <Inbox size={16} /> : <CalendarCheck size={16} />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--color-text)]">{n.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{timeAgo(n.time)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

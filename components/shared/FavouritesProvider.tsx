"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FavouritesContextValue = {
  ready: boolean;
  isFavourite: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
};

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadFor(uid: string | null) {
      if (!uid) {
        setIds(new Set());
        return;
      }
      const { data } = await supabase
        .from("favourites")
        .select("property_id")
        .eq("user_id", uid);
      if (!active) return;
      setIds(new Set((data ?? []).map((r) => (r as { property_id: string }).property_id)));
    }

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      setUserId(user?.id ?? null);
      await loadFor(user?.id ?? null);
      if (active) setReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      void loadFor(uid);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isFavourite = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback(
    async (id: string) => {
      if (!userId) {
        router.push("/login");
        return;
      }
      const supabase = createClient();
      const has = ids.has(id);
      setIds((prev) => {
        const next = new Set(prev);
        if (has) next.delete(id);
        else next.add(id);
        return next;
      });
      if (has) {
        await supabase
          .from("favourites")
          .delete()
          .eq("user_id", userId)
          .eq("property_id", id);
      } else {
        await supabase.from("favourites").insert({ user_id: userId, property_id: id });
      }
    },
    [ids, userId, router]
  );

  return (
    <FavouritesContext.Provider value={{ ready, isFavourite, toggle }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}

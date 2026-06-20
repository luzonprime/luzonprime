import { createBrowserClient } from "@supabase/ssr";

function makeClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton: calling createBrowserClient repeatedly spawns multiple GoTrue
// instances that race over the same session (breaking auth state / sign-out).
let browserClient: ReturnType<typeof makeClient> | undefined;

export function createClient() {
  if (!browserClient) browserClient = makeClient();
  return browserClient;
}

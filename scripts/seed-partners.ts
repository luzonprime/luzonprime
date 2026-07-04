/**
 * Seeds the `partners` table from the local ./partners folder.
 *
 * Uploads each logo to the `property-images` storage bucket under site/partners/
 * and inserts a row with a matching tile background colour (bg_color) chosen to
 * blend each logo's baked-in background.
 *
 * Run: npm run seed-partners
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.
 * Re-running replaces the seeded rows (matched by name) — safe to run again.
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import path from "path";

type Seed = {
  file: string;
  name: string;
  website_url: string | null;
  bg_color: string; // matches the logo's own background so the tile blends
};

const PARTNERS: Seed[] = [
  { file: "1.jpg", name: "Levitikal Realties & Construction", website_url: null, bg_color: "#FFFFFF" },
  { file: "2.jpg", name: "Ramec Group", website_url: null, bg_color: "#FFFFFF" },
  { file: "3.jpg", name: "The Akristal Group Limited", website_url: null, bg_color: "#000000" },
  { file: "4.jpg", name: "HugeDream Properties", website_url: null, bg_color: "#1B2A4E" },
  { file: "5.jpg", name: "Pearllike Consulting & Management Services", website_url: null, bg_color: "#FFFFFF" },
  { file: "6.jpg", name: "VoltWhales", website_url: null, bg_color: "#000000" },
  { file: "7.jpg", name: "7 Fifteen", website_url: null, bg_color: "#FFFFFF" },
];

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Clear previously seeded rows so re-runs don't duplicate.
  const names = PARTNERS.map((p) => p.name);
  const { error: delErr } = await supabase.from("partners").delete().in("name", names);
  if (delErr) console.warn(`Warning clearing existing partners: ${delErr.message}`);

  let sort = 0;
  for (const p of PARTNERS) {
    const localPath = path.join(process.cwd(), "partners", p.file);
    let buffer: Buffer;
    try {
      buffer = await readFile(localPath);
    } catch {
      console.error(`✗ Could not read ${localPath} — skipping ${p.name}.`);
      continue;
    }

    const storagePath = `site/partners/${Date.now()}-${p.file}`;
    const { error: upErr } = await supabase.storage
      .from("property-images")
      .upload(storagePath, buffer, { upsert: true, contentType: "image/jpeg" });
    if (upErr) {
      console.error(`✗ Upload failed for ${p.name}: ${upErr.message}`);
      continue;
    }

    const logo_url = supabase.storage.from("property-images").getPublicUrl(storagePath)
      .data.publicUrl;

    const { error: insErr } = await supabase.from("partners").insert({
      name: p.name,
      logo_url,
      website_url: p.website_url,
      bg_color: p.bg_color,
      sort_order: sort,
      is_active: true,
    });
    if (insErr) {
      console.error(`✗ Insert failed for ${p.name}: ${insErr.message}`);
      continue;
    }

    console.log(`✓ ${p.name}`);
    sort += 1;
  }

  console.log("Done seeding partners.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

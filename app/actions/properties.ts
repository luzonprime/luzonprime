"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

const BUCKET = "property-images";
const MAX_MEDIA_BYTES = 50 * 1024 * 1024; // 50MB
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"];
const TOUR_TYPES = [...VIDEO_TYPES, "image/jpeg", "image/png", "image/webp"];

async function getActor() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to do this.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "client";
  if (role !== "agent" && role !== "admin") {
    throw new Error("Only agents and admins can manage properties.");
  }

  return { userId: user.id, role: role as "agent" | "admin", sessionClient: supabase };
}

function dbClientFor(actor: Awaited<ReturnType<typeof getActor>>) {
  return actor.role === "admin" ? createAdminClient() : actor.sessionClient;
}

async function uniqueSlug(title: string, excludeId?: string) {
  const admin = createAdminClient();
  const base = slugify(title) || "property";
  let slug = base;
  let attempt = 1;

  while (true) {
    let query = admin.from("properties").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    attempt += 1;
    slug = `${base}-${attempt}`;
  }
}

function num(formData: FormData, key: string): number | null {
  const raw = formData.get(key);
  if (raw == null || raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function str(formData: FormData, key: string): string | null {
  const raw = formData.get(key);
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  return trimmed === "" ? null : trimmed;
}

function features(formData: FormData): string[] {
  const raw = str(formData, "features");
  if (!raw) return [];
  return raw
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
}

async function uploadImages(
  client: ReturnType<typeof createAdminClient>,
  agentId: string,
  propertyId: string,
  files: File[]
): Promise<string[]> {
  const urls: string[] = [];

  for (const [index, file] of files.entries()) {
    if (!(file instanceof File) || file.size === 0) continue;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${agentId}/${propertyId}/${Date.now()}-${index}.${ext}`;

    const { error } = await client.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

async function uploadMedia(
  client: ReturnType<typeof createAdminClient>,
  agentId: string,
  propertyId: string,
  files: File[],
  subdir: string,
  allowedTypes: string[]
): Promise<string[]> {
  const urls: string[] = [];

  for (const [index, file] of files.entries()) {
    if (!(file instanceof File) || file.size === 0) continue;
    if (file.size > MAX_MEDIA_BYTES) {
      throw new Error(`"${file.name}" exceeds the 50MB limit.`);
    }
    if (file.type && !allowedTypes.includes(file.type)) {
      throw new Error(`"${file.name}" has an unsupported file type.`);
    }
    const ext = file.name.split(".").pop() ?? "mp4";
    const path = `${agentId}/${propertyId}/${subdir}/${Date.now()}-${index}.${ext}`;

    const { error } = await client.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

function fileList(formData: FormData, key: string): File[] {
  return formData.getAll(key).filter((f): f is File => f instanceof File);
}

export async function createProperty(formData: FormData) {
  const actor = await getActor();
  const db = dbClientFor(actor);

  const title = str(formData, "title");
  if (!title) throw new Error("Title is required.");

  const agentId =
    actor.role === "admin" ? str(formData, "agent_id") ?? actor.userId : actor.userId;

  const id = randomUUID();
  const slug = await uniqueSlug(title);

  const uploadClient = actor.role === "admin" ? createAdminClient() : actor.sessionClient;
  const images = await uploadImages(uploadClient, agentId, id, fileList(formData, "images"));
  const videos = await uploadMedia(uploadClient, agentId, id, fileList(formData, "videos"), "videos", VIDEO_TYPES);
  const virtual_tours = await uploadMedia(uploadClient, agentId, id, fileList(formData, "tours"), "tours", TOUR_TYPES);

  const payload = {
    id,
    agent_id: agentId,
    title,
    slug,
    description: str(formData, "description"),
    property_type: str(formData, "property_type"),
    listing_type: str(formData, "listing_type"),
    status: str(formData, "status") ?? "available",
    price: num(formData, "price"),
    price_label: str(formData, "price_label"),
    bedrooms: num(formData, "bedrooms"),
    bathrooms: num(formData, "bathrooms"),
    size_sqm: num(formData, "size_sqm"),
    location: str(formData, "location"),
    area: str(formData, "area"),
    city: str(formData, "city"),
    latitude: num(formData, "latitude"),
    longitude: num(formData, "longitude"),
    features: features(formData),
    images,
    videos,
    virtual_tours,
    is_published: actor.role === "admin" ? formData.get("is_published") === "on" : false,
    is_featured: actor.role === "admin" ? formData.get("is_featured") === "on" : false,
  };

  const { error } = await db.from("properties").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/properties");
  revalidatePath("/agent/properties");
  revalidatePath("/listings");

  return { id, slug };
}

export async function updateProperty(propertyId: string, formData: FormData) {
  const actor = await getActor();
  const db = dbClientFor(actor);

  const { data: existing, error: fetchError } = await db
    .from("properties")
    .select("id, agent_id, slug, title, images, videos, virtual_tours")
    .eq("id", propertyId)
    .single();

  if (fetchError || !existing) throw new Error("Property not found.");
  if (actor.role === "agent" && existing.agent_id !== actor.userId) {
    throw new Error("You can only edit your own properties.");
  }

  const title = str(formData, "title") ?? existing.title;
  const slug = title !== existing.title ? await uniqueSlug(title, propertyId) : existing.slug;

  const uploadClient = actor.role === "admin" ? createAdminClient() : actor.sessionClient;

  const keptImages = formData.getAll("existing_images").map(String);
  const newImages = await uploadImages(uploadClient, existing.agent_id, propertyId, fileList(formData, "images"));
  const images = [...keptImages, ...newImages];

  const keptVideos = formData.getAll("existing_videos").map(String);
  const newVideos = await uploadMedia(uploadClient, existing.agent_id, propertyId, fileList(formData, "videos"), "videos", VIDEO_TYPES);
  const videos = [...keptVideos, ...newVideos];

  const keptTours = formData.getAll("existing_tours").map(String);
  const newTours = await uploadMedia(uploadClient, existing.agent_id, propertyId, fileList(formData, "tours"), "tours", TOUR_TYPES);
  const virtual_tours = [...keptTours, ...newTours];

  const payload: Record<string, unknown> = {
    title,
    slug,
    description: str(formData, "description"),
    property_type: str(formData, "property_type"),
    listing_type: str(formData, "listing_type"),
    status: str(formData, "status") ?? "available",
    price: num(formData, "price"),
    price_label: str(formData, "price_label"),
    bedrooms: num(formData, "bedrooms"),
    bathrooms: num(formData, "bathrooms"),
    size_sqm: num(formData, "size_sqm"),
    location: str(formData, "location"),
    area: str(formData, "area"),
    city: str(formData, "city"),
    latitude: num(formData, "latitude"),
    longitude: num(formData, "longitude"),
    features: features(formData),
    images,
    videos,
    virtual_tours,
    updated_at: new Date().toISOString(),
  };

  if (actor.role === "admin") {
    payload.is_published = formData.get("is_published") === "on";
    payload.is_featured = formData.get("is_featured") === "on";
    if (str(formData, "agent_id")) payload.agent_id = str(formData, "agent_id");
  }

  const { error } = await db.from("properties").update(payload).eq("id", propertyId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/properties");
  revalidatePath("/agent/properties");
  revalidatePath("/listings");
  revalidatePath(`/listings/${slug}`);

  return { id: propertyId, slug };
}

export async function deleteProperty(propertyId: string) {
  const actor = await getActor();
  const db = dbClientFor(actor);

  const { data: existing } = await db
    .from("properties")
    .select("id, agent_id")
    .eq("id", propertyId)
    .single();

  if (!existing) throw new Error("Property not found.");
  if (actor.role === "agent" && existing.agent_id !== actor.userId) {
    throw new Error("You can only delete your own properties.");
  }

  const storageClient = actor.role === "admin" ? createAdminClient() : actor.sessionClient;
  const { data: files } = await storageClient.storage
    .from(BUCKET)
    .list(`${existing.agent_id}/${propertyId}`);
  if (files?.length) {
    await storageClient.storage
      .from(BUCKET)
      .remove(files.map((f) => `${existing.agent_id}/${propertyId}/${f.name}`));
  }

  const { error } = await db.from("properties").delete().eq("id", propertyId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/properties");
  revalidatePath("/agent/properties");
  revalidatePath("/listings");
}

export async function publishProperty(propertyId: string, isPublished: boolean) {
  const actor = await getActor();
  if (actor.role !== "admin") {
    throw new Error("Only admins can publish properties.");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("properties")
    .update({ is_published: isPublished })
    .eq("id", propertyId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/properties");
  revalidatePath("/listings");
}

export async function toggleFeatured(propertyId: string, isFeatured: boolean) {
  const actor = await getActor();
  if (actor.role !== "admin") {
    throw new Error("Only admins can feature properties.");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("properties")
    .update({ is_featured: isFeatured })
    .eq("id", propertyId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/properties");
  revalidatePath("/");
  revalidatePath("/listings");
}

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

function generateTempPassword() {
  return randomBytes(12).toString("base64url");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function img(id: string, w = 1200) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

const INTERIOR_IMAGES = [
  "1738168246881-40f35f8aba0a",
  "1738168279272-c08d6dd22002",
  "1715985160053-d339e8b6eb94",
  "1680416124510-5eae1beca412",
  "1741764014072-68953e93cd48",
  "1738168273959-952fdc961991",
];

const EXTERIOR_IMAGES = [
  "1706808849780-7a04fbac83ef",
  "1512917774080-9991f1c4c750",
  "1721815693498-cc28507c0ba2",
  "1627141234469-24711efb373c",
  "1706808849777-96e0d7be3bb7",
  "1600596542815-ffad4c1539a9",
];

const AGENT_PHOTOS = [
  "1560250097-0b93528c311a",
  "1573496359142-b8d87734a5a2",
  "1519085360753-af0119f7cbe7",
  "1494790108377-be9c29b29330",
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

  async function findUserByEmail(email: string) {
    const { data } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    return data.users.find((u) => u.email === email) ?? null;
  }

  async function ensureUser(email: string) {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email,
      password: generateTempPassword(),
      email_confirm: true,
    });
    if (!error) return created.user.id;

    const existing = await findUserByEmail(email);
    if (existing) return existing.id;
    throw new Error(`Failed to create or find user ${email}: ${error.message}`);
  }

  console.log("Seeding agents...");
  const agentSeeds = [
    {
      email: "amaka.eze@luzonprime.com",
      full_name: "Amaka Eze",
      phone: "+2348012345001",
      bio: "Specialist in Ikoyi and Banana Island luxury homes with 9 years in Lagos real estate.",
      verified: true,
      avatar_url: img(AGENT_PHOTOS[1], 300),
    },
    {
      email: "tunde.bakare@luzonprime.com",
      full_name: "Tunde Bakare",
      phone: "+2348012345002",
      bio: "Focused on Victoria Island commercial spaces and off-plan developments.",
      verified: true,
      avatar_url: img(AGENT_PHOTOS[2], 300),
    },
    {
      email: "chioma.okafor@luzonprime.com",
      full_name: "Chioma Okafor",
      phone: "+2348012345003",
      bio: "Lekki and Ajah rentals expert, known for fast turnaround on lettings.",
      verified: true,
      avatar_url: img(AGENT_PHOTOS[0], 300),
    },
    {
      email: "femi.adelaja@luzonprime.com",
      full_name: "Femi Adelaja",
      phone: "+2348012345004",
      bio: "12 years selling land and new developments across the Lagos mainland.",
      verified: false,
      avatar_url: img(AGENT_PHOTOS[3], 300),
    },
  ];

  const agentIds: string[] = [];
  for (const agent of agentSeeds) {
    const id = await ensureUser(agent.email);
    await supabase.from("profiles").upsert({
      id,
      role: "agent",
      full_name: agent.full_name,
      phone: agent.phone,
      bio: agent.bio,
      verified: agent.verified,
      avatar_url: agent.avatar_url,
    });
    agentIds.push(id);
  }

  console.log("Seeding clients...");
  const clientSeeds = [
    { email: "ada.client@example.com", full_name: "Ada Williams", phone: "+2348023456001" },
    { email: "samuel.client@example.com", full_name: "Samuel Johnson", phone: "+2348023456002" },
  ];

  const clientIds: string[] = [];
  for (const client of clientSeeds) {
    const id = await ensureUser(client.email);
    await supabase.from("profiles").upsert({
      id,
      role: "client",
      full_name: client.full_name,
      phone: client.phone,
    });
    clientIds.push(id);
  }

  console.log("Seeding properties...");
  const propertySeeds = [
    {
      title: "4-Bedroom Waterfront Duplex, Banana Island",
      property_type: "duplex",
      listing_type: "for_sale",
      price: 850_000_000,
      bedrooms: 4,
      bathrooms: 5,
      size_sqm: 520,
      area: "Banana Island",
      city: "Lagos",
      features: ["pool", "smart home", "private jetty", "gym"],
      images: [img(EXTERIOR_IMAGES[2]), img(INTERIOR_IMAGES[1]), img(INTERIOR_IMAGES[4])],
      agentIdx: 0,
      featured: true,
    },
    {
      title: "3-Bedroom Serviced Apartment, Ikoyi",
      property_type: "apartment",
      listing_type: "for_rent",
      price: 12_000_000,
      bedrooms: 3,
      bathrooms: 3,
      size_sqm: 210,
      area: "Ikoyi",
      city: "Lagos",
      features: ["elevator", "24/7 power", "gym", "concierge"],
      images: [img(INTERIOR_IMAGES[1]), img(INTERIOR_IMAGES[3]), img(INTERIOR_IMAGES[5])],
      agentIdx: 0,
      featured: true,
    },
    {
      title: "Grade A Office Floor, Victoria Island",
      property_type: "commercial",
      listing_type: "for_rent",
      price: 35_000_000,
      bedrooms: null,
      bathrooms: 2,
      size_sqm: 600,
      area: "Victoria Island",
      city: "Lagos",
      features: ["backup generator", "parking", "fibre internet"],
      images: [img(EXTERIOR_IMAGES[1]), img(EXTERIOR_IMAGES[3])],
      agentIdx: 1,
      featured: false,
    },
    {
      title: "Off-Plan Smart Towers, Victoria Island",
      property_type: "apartment",
      listing_type: "off_plan",
      price: 95_000_000,
      price_label: "From ₦95M — flexible payment plan",
      bedrooms: 2,
      bathrooms: 2,
      size_sqm: 140,
      area: "Victoria Island",
      city: "Lagos",
      features: ["smart home", "pool", "co-working lounge"],
      images: [img(EXTERIOR_IMAGES[5]), img(INTERIOR_IMAGES[2])],
      agentIdx: 1,
      featured: true,
    },
    {
      title: "2-Bedroom Flat, Lekki Phase 1",
      property_type: "apartment",
      listing_type: "for_rent",
      price: 4_500_000,
      bedrooms: 2,
      bathrooms: 2,
      size_sqm: 120,
      area: "Lekki Phase 1",
      city: "Lagos",
      features: ["24/7 power", "estate security"],
      images: [img(INTERIOR_IMAGES[3]), img(INTERIOR_IMAGES[5])],
      agentIdx: 2,
      featured: false,
    },
    {
      title: "5-Bedroom Detached House, Lekki",
      property_type: "duplex",
      listing_type: "for_sale",
      price: 260_000_000,
      bedrooms: 5,
      bathrooms: 6,
      size_sqm: 480,
      area: "Lekki",
      city: "Lagos",
      features: ["pool", "garden", "bq", "ample parking"],
      images: [img(EXTERIOR_IMAGES[0]), img(EXTERIOR_IMAGES[2]), img(INTERIOR_IMAGES[0])],
      agentIdx: 2,
      featured: true,
    },
    {
      title: "Serviced Plot, Epe Free Trade Zone",
      property_type: "land",
      listing_type: "for_sale",
      price: 28_000_000,
      bedrooms: null,
      bathrooms: null,
      size_sqm: 1000,
      area: "Epe",
      city: "Lagos",
      features: ["titled", "fenced", "dry land"],
      images: [img(EXTERIOR_IMAGES[4])],
      agentIdx: 3,
      featured: false,
    },
    {
      title: "3-Bedroom Terrace, Ajah",
      property_type: "duplex",
      listing_type: "for_sale",
      price: 65_000_000,
      bedrooms: 3,
      bathrooms: 3,
      size_sqm: 180,
      area: "Ajah",
      city: "Lagos",
      features: ["estate security", "borehole"],
      images: [img(EXTERIOR_IMAGES[3]), img(INTERIOR_IMAGES[2])],
      agentIdx: 3,
      featured: false,
    },
    {
      title: "Studio Apartment, Yaba Tech Hub",
      property_type: "apartment",
      listing_type: "for_rent",
      price: 2_200_000,
      bedrooms: 1,
      bathrooms: 1,
      size_sqm: 55,
      area: "Yaba",
      city: "Lagos",
      features: ["fibre internet", "24/7 power"],
      images: [img(INTERIOR_IMAGES[1])],
      agentIdx: 2,
      featured: false,
    },
  ];

  const propertyIds: { id: string; agent_id: string }[] = [];
  for (const p of propertySeeds) {
    const slug = `${slugify(p.title)}-${Math.random().toString(36).slice(2, 7)}`;
    const agent_id = agentIds[p.agentIdx];
    const { data, error } = await supabase
      .from("properties")
      .insert({
        agent_id,
        title: p.title,
        slug,
        description: `A beautifully presented ${p.property_type} in ${p.area}, ${p.city}. Contact us to arrange a viewing.`,
        property_type: p.property_type,
        listing_type: p.listing_type,
        status: "available",
        price: p.price,
        price_label: p.price_label ?? null,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        size_sqm: p.size_sqm,
        location: p.area,
        area: p.area,
        city: p.city,
        features: p.features,
        is_featured: p.featured,
        is_published: true,
        images: p.images,
      })
      .select("id, agent_id")
      .single();

    if (error) {
      console.error(`Failed to insert property "${p.title}":`, error.message);
      continue;
    }
    propertyIds.push(data);
  }

  console.log("Seeding subscribers...");
  const subscriberEmails = [
    "newsletter1@example.com",
    "newsletter2@example.com",
    "newsletter3@example.com",
    "newsletter4@example.com",
    "newsletter5@example.com",
  ];
  for (const email of subscriberEmails) {
    await supabase.from("subscribers").upsert({ email, status: "active" }, { onConflict: "email" });
  }

  console.log("Seeding inquiries...");
  const inquirySeeds = [
    {
      name: "Ada Williams",
      email: "ada.client@example.com",
      phone: "+2348023456001",
      message: "Is this property still available? I'd like to schedule a viewing this weekend.",
      inquiry_type: "purchase",
      status: "new",
      user_id: clientIds[0],
    },
    {
      name: "Samuel Johnson",
      email: "samuel.client@example.com",
      phone: "+2348023456002",
      message: "What's the earliest move-in date for this rental?",
      inquiry_type: "rent",
      status: "contacted",
      user_id: clientIds[1],
    },
    {
      name: "Ngozi Eze",
      email: "ngozi.prospect@example.com",
      phone: "+2348034567003",
      message: "Can you send the floor plan and a virtual tour link?",
      inquiry_type: "general",
      status: "new",
      user_id: null,
    },
    {
      name: "David Okon",
      email: "david.prospect@example.com",
      phone: "+2348034567004",
      message: "Interested in the off-plan payment structure — please call me.",
      inquiry_type: "purchase",
      status: "closed",
      user_id: null,
    },
  ];

  for (let i = 0; i < inquirySeeds.length && i < propertyIds.length; i++) {
    const inquiry = inquirySeeds[i];
    const property = propertyIds[i];
    await supabase.from("inquiries").insert({
      property_id: property.id,
      user_id: inquiry.user_id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      inquiry_type: inquiry.inquiry_type,
      status: inquiry.status,
      assigned_agent: property.agent_id,
    });
  }

  console.log("Seeding bookings...");
  const bookingSeeds = [
    { propertyIdx: 0, clientIdx: 0, status: "confirmed", daysFromNow: 3 },
    { propertyIdx: 1, clientIdx: 1, status: "pending", daysFromNow: 5 },
    { propertyIdx: 5, clientIdx: 0, status: "pending", daysFromNow: 9 },
  ];
  for (const b of bookingSeeds) {
    const property = propertyIds[b.propertyIdx];
    if (!property) continue;
    const scheduledAt = new Date(Date.now() + b.daysFromNow * 24 * 60 * 60 * 1000);
    await supabase.from("bookings").insert({
      user_id: clientIds[b.clientIdx],
      agent_id: property.agent_id,
      property_id: property.id,
      scheduled_at: scheduledAt.toISOString(),
      status: b.status,
      notes: "Site visit requested via website.",
    });
  }

  console.log("Seeding blog posts...");
  const postSeeds = [
    {
      title: "5 Neighbourhoods to Watch in Lagos This Year",
      content:
        "From Epe's emerging free trade zone to Lekki's continued growth, here's where smart buyers are looking next.",
      cover_image: img(EXTERIOR_IMAGES[4]),
      published: true,
    },
    {
      title: "A Buyer's Guide to Off-Plan Properties in Victoria Island",
      content:
        "Off-plan purchases can offer significant savings — here's what to check before you commit.",
      cover_image: img(EXTERIOR_IMAGES[5]),
      published: true,
    },
    {
      title: "How Verified Listings Protect You From Property Fraud",
      content:
        "Every listing on Luzon Prime Realtors goes through a verification step before it's published. Here's what that involves.",
      cover_image: img(EXTERIOR_IMAGES[1]),
      published: false,
    },
  ];
  for (const post of postSeeds) {
    const slug = `${slugify(post.title)}-${Math.random().toString(36).slice(2, 7)}`;
    await supabase.from("posts").insert({
      author_id: agentIds[0],
      title: post.title,
      slug,
      content: post.content,
      cover_image: post.cover_image,
      published: post.published,
    });
  }

  console.log("\nSeed complete.");
  console.log(`  Agents:     ${agentIds.length}`);
  console.log(`  Clients:    ${clientIds.length}`);
  console.log(`  Properties: ${propertyIds.length}`);
  console.log(`  Subscribers: ${subscriberEmails.length}`);
  console.log(`  Inquiries:  ${Math.min(inquirySeeds.length, propertyIds.length)}`);
  console.log(`  Bookings:   ${bookingSeeds.length}`);
  console.log(`  Posts:      ${postSeeds.length}`);
  console.log("\nAgent/client accounts were created with random passwords — use password reset to log in as them.");
}

main();

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

function generateTempPassword() {
  return randomBytes(12).toString("base64url");
}

async function main() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!email || !url || !serviceRoleKey) {
    console.error(
      "Missing ADMIN_BOOTSTRAP_EMAIL, NEXT_PUBLIC_SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY in env."
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const tempPassword = generateTempPassword();

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

  if (createError) {
    console.error("Failed to create admin user:", createError.message);
    process.exit(1);
  }

  const userId = created.user.id;

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    role: "admin",
    full_name: "Luzon Prime Realtors Admin",
  });

  if (profileError) {
    console.error("Failed to set admin role:", profileError.message);
    process.exit(1);
  }

  console.log("Admin account created.");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${tempPassword}`);
  console.log("Log in and change this password immediately.");
}

main();

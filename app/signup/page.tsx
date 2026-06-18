"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "client" },
  });

  async function onSubmit(values: SignupInput) {
    setServerError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.full_name } },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: values.full_name,
        role: values.role,
      });
    }

    router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--color-bg)] px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
        <h1 className="font-heading text-2xl font-bold text-[var(--color-primary)]">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Join Luzon Prime Realtors to save favourites, book consultations, and more.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <Input
            label="Full name"
            placeholder="Jane Doe"
            {...register("full_name")}
            error={errors.full_name?.message}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-sm font-medium text-[var(--color-text)]">
              I am a
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <input type="radio" value="client" {...register("role")} defaultChecked />
                Client
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <input type="radio" value="agent" {...register("role")} />
                Agent
              </label>
            </div>
          </div>

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? "Creating account…" : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-[var(--color-primary)]">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

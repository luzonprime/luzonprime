"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordInput) {
    setServerError(null);
    const supabase = createClient();

    // Sends the recovery email containing a 6-digit code ({{ .Token }}).
    const { error } = await supabase.auth.resetPasswordForEmail(values.email);

    if (error) {
      setServerError(error.message);
      return;
    }

    router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--color-bg)] px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
        <h1 className="font-heading text-2xl font-bold text-[var(--color-heading)]">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Enter your email and we&apos;ll send you a 6-digit code to reset your
          password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending…" : "Send reset code"}
          </Button>
        </form>
      </div>
    </div>
  );
}

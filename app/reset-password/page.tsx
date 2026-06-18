"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [serverError, setServerError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email },
  });

  async function onSubmit(values: ResetPasswordInput) {
    setServerError(null);
    const supabase = createClient();

    // Verify the 6-digit recovery code — this establishes a session.
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: values.email,
      token: values.token,
      type: "recovery",
    });
    if (verifyError) {
      setServerError(verifyError.message);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: values.password,
    });
    if (updateError) {
      setServerError(updateError.message);
      return;
    }

    await supabase.auth.signOut();
    router.push("/login");
  }

  async function resendCode() {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setServerError(error.message);
      return;
    }
    setResent(true);
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--color-bg)] px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
        <h1 className="font-heading text-2xl font-bold text-[var(--color-heading)]">
          Set a new password
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Enter the 6-digit code sent to <strong>{email || "your email"}</strong>{" "}
          and choose a new password. The code expires in 5 minutes.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <input type="hidden" {...register("email")} value={email} />
          <Input
            label="Verification code"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="text-center text-lg tracking-[0.5em]"
            {...register("token")}
            error={errors.token?.message}
          />
          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          {resent && (
            <p className="text-sm text-[var(--color-text-muted)]">
              A new code has been sent.
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
          <Button type="button" variant="outline" onClick={resendCode} className="w-full">
            Resend code
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

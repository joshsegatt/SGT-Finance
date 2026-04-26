"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to change password");
      setSuccess(true);
      reset();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Current password */}
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative max-w-sm">
          <Input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            {...register("currentPassword")}
            placeholder="Your current password"
            autoComplete="current-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New password */}
      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative max-w-sm">
          <Input
            id="newPassword"
            type={showNew ? "text" : "password"}
            {...register("newPassword")}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="Repeat new password"
          autoComplete="new-password"
          className="max-w-sm"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {success && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 rounded-lg max-w-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          Password changed successfully
        </div>
      )}

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2.5 rounded-lg max-w-sm">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} size="sm" variant="outline">
        {isSubmitting ? "Changing..." : "Change Password"}
      </Button>
    </form>
  );
}

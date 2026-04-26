"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/lib/actions";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormValues = z.infer<typeof schema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function ProfileForm({ user }: { user: User }) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name },
  });

  function onSubmit(values: FormValues) {
    setServerError("");
    setSuccess(false);
    startTransition(async () => {
      try {
        await updateUserProfile(values);
        setSuccess(true);
      } catch (e: unknown) {
        setServerError(e instanceof Error ? e.message : "Failed to save changes");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Your full name"
          className="max-w-sm"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input value={user.email} readOnly disabled className="max-w-sm opacity-60" />
        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
      </div>

      {success && (
        <p className="text-sm text-emerald-500 bg-emerald-500/10 p-3 rounded-md">
          Profile updated successfully
        </p>
      )}

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{serverError}</p>
      )}

      <Button type="submit" disabled={isSubmitting || !isDirty} size="sm">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

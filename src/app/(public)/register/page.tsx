"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const initialState: ActionResult = { success: false };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)] py-8">
      <div className="w-full max-w-md p-8 bg-surface rounded-xl border border-border-subtle">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Join NAV-FORGE</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Create your account to start submitting capabilities
          </p>
        </div>

        {state.error && (
          <div className="mb-6 p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <Input
            name="name"
            type="text"
            label="Full Name"
            placeholder="Jane Smith"
            required
            autoComplete="name"
          />
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Min 8 characters"
            required
            autoComplete="new-password"
          />
          <Select
            name="role"
            label="Role"
            options={[
              { value: "SUBMITTER", label: "Submitter (Vendor / Partner)" },
              { value: "REVIEWER", label: "SME Reviewer" },
              { value: "DIRECTOR", label: "RCO Director" },
            ]}
          />
          <Button type="submit" className="w-full" loading={isPending}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ActionResult = { success: false };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
      <div className="w-full max-w-md p-8 bg-surface rounded-xl border border-border-subtle">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to the NAV-FORGE Portal
          </p>
        </div>

        {state.error && (
          <div className="mb-6 p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
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
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full" loading={isPending}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          New to NAV-FORGE?{" "}
          <Link href="/register" className="text-accent hover:text-accent-hover">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

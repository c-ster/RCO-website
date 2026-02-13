"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validators/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AuthError } from "next-auth";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function registerAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: (formData.get("role") as string) || "SUBMITTER",
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid input. Check all fields." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role as "SUBMITTER" | "REVIEWER" | "DIRECTOR",
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    // Sign-in after register failed, but account was created
    return { success: false, error: "Account created but login failed. Please sign in." };
  }

  redirect("/dashboard");
}

export async function loginAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid email or password format." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    // IMPORTANT: Re-throw redirect errors so Next.js can handle them
    if (isRedirectError(error)) throw error;
    // Only treat AuthError as invalid credentials
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password." };
    }
    return { success: false, error: "An unexpected error occurred." };
  }

  redirect("/dashboard");
}

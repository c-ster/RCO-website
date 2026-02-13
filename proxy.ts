import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use edge-safe auth config (no Prisma/DB) for middleware
// The full auth with DB is only used in server components and API routes
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/submissions/:path*",
    "/platforms/:path*",
    "/intake/:path*",
  ],
};

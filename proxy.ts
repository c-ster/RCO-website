export { auth as default } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/submissions/:path*",
    "/platforms/:path*",
    "/intake/:path*",
  ],
};

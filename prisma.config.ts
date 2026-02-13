import path from "node:path";
import { defineConfig } from "prisma/config";

// Load .env.local for local development; Vercel provides env vars directly
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("dotenv").config({ path: ".env.local" });
} catch {
  // dotenv not available in production
}

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});

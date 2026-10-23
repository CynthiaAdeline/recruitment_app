import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ensure the directory for the SQLite file exists
const dbUrl = process.env.DATABASE_URL ?? "";
if (dbUrl.startsWith("file:")) {
  const dbPath = dbUrl.replace("file:", "");
  const dbDir = dbPath.startsWith("/") ? dirname(dbPath) : dirname(`${__dirname}/${dbPath}`);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
    console.log(`Created database directory: ${dbDir}`);
  }
}

try {
  console.log("==> Running database migrations...");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  console.log("==> Migrations complete.");
} catch (e) {
  console.error("Migration failed:", e.message);
  process.exit(1);
}

try {
  console.log("==> Seeding database...");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  console.log("==> Seed complete.");
} catch (e) {
  // Seed may fail if data already exists — that is fine
  console.log("==> Seed skipped (data may already exist).");
}

console.log("==> Starting Next.js...");
execSync("npx next start -p " + (process.env.PORT ?? 3000), { stdio: "inherit" });

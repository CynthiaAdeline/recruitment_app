import { execSync } from "child_process";

console.log("Running database migrations...");
execSync("npx prisma migrate deploy", { stdio: "inherit" });

console.log("Seeding database...");
execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });

console.log("Starting Next.js server...");
execSync("npx next start", { stdio: "inherit" });

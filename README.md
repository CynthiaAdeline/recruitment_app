# BrightCore Recruitment App

A full-stack recruitment web application built with Next.js 16, Prisma ORM, and SQLite.

## Getting Started

### One-command setup

```bash
npm install && npm run db:setup && npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Step by step

```bash
npm install          # install dependencies
npm run db:setup     # create database, run migrations, seed sample data
npm run dev          # start development server
```

## Seeded Admin Login

| Field    | Value                   |
|----------|-------------------------|
| Email    | admin@brightcore.com    |
| Password | admin123                |

Admin portal: [http://localhost:3000/admin](http://localhost:3000/admin)

## Features

### Public (Candidates)
- Browse open job listings with title, location, type, closing date and summary
- View full job details (description, responsibilities, requirements)
- Apply with name, email, phone, cover note and CV upload (PDF only, max 5 MB)
- Client-side and server-side validation with clear error messages
- Confirmation message on successful submission
- Blocked from applying to closed/expired jobs
- Duplicate application prevention (same email + job)

### Admin
- Secure login with JWT stored in an httpOnly cookie
- Post, edit and close jobs
- View all applicants per job, filterable by status (Pending / Accepted / Rejected)
- Open individual applications and download CVs (admin-only, not publicly accessible)
- Accept or reject applications with an optional note
- Dashboard overview: total jobs, open jobs, total applications, pending count

## Technology Choices

| Technology | Reason |
|---|---|
| **Next.js 16 (App Router)** | Full-stack React framework; API routes and server components in one project |
| **Prisma ORM + SQLite** | Type-safe database access; SQLite requires zero infrastructure for local dev |
| **bcryptjs** | Industry-standard password hashing |
| **jose** | Lightweight JWT signing/verification for the admin session cookie |
| **Tailwind CSS v4** | Utility-first styling; fast to build responsive UIs |
| **TypeScript** | Type safety across the entire codebase |

## Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT stored in `httpOnly`, `SameSite=lax` cookie — not accessible to JavaScript
- All admin API routes verify the JWT before responding
- CV files stored outside the `public/` directory and served only through an authenticated API route
- Server-side validation on all inputs (file type, size, email format, duplicate check)
- Prisma parameterised queries prevent SQL injection

## Project Structure

```
app/
  page.tsx                  # Public jobs listing
  jobs/[id]/page.tsx        # Job detail + application form
  admin/
    login/page.tsx          # Admin login
    jobs/page.tsx           # Jobs management + overview
    jobs/new/page.tsx       # Post a new job
    jobs/[id]/page.tsx      # Applicants for a job
    jobs/[id]/edit/         # Edit a job
    applications/[id]/      # Application detail + accept/reject
  api/
    auth/login/             # POST login
    auth/logout/            # POST logout
    jobs/                   # GET open jobs, POST create job
    jobs/[id]/              # GET job, PATCH update/close
    applications/           # GET list (admin), POST submit
    applications/[id]/      # GET detail (admin), PATCH status
    cv/[id]/                # GET download CV (admin)
lib/
  prisma.ts                 # Prisma client singleton
  auth.ts                   # JWT helpers
prisma/
  schema.prisma             # Data model
  seed.ts                   # Seed admin + 3 sample jobs
uploads/                    # CV files (not publicly accessible)
```

## What I Would Improve With More Time

- Email notifications to applicants when their status changes (nodemailer or Resend)
- Search and pagination on the jobs listing page
- Docker Compose setup for one-command deployment
- More comprehensive test coverage (currently covers core API logic)
- Rate limiting on the application submission endpoint
- Refresh token rotation for longer admin sessions

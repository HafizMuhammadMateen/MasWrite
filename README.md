# MasWrite

A full-stack blogging platform built with Next.js 16 App Router. Write, manage, and publish blog posts with a rich text editor, a clean public-facing blog, and a private dashboard — all in one place.

---

## Features

- **Rich text editor** — Tiptap v3 with headings, bold, italic, underline, links, images, bullet/task lists
- **Public blog** — SSG with ISR, SEO metadata per post, view counter
- **Dashboard** — analytics cards, charts (Recharts), recent posts
- **Manage blogs** — create, edit, duplicate, bulk delete, filter by status/category/sort, search
- **Dual authentication** — manual JWT (email/password) + NextAuth v4 (OAuth providers)
- **Password management** — change password, forgot password, email reset link via Resend
- **Responsive sidebar** — collapsible, profile popup, settings page
- **Settings page** — profile overview, change password

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4 |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth v4 + manual JWT (`jsonwebtoken`) |
| Editor | Tiptap v3 |
| Email | Resend + React Email |
| Charts | Recharts |
| UI Components | Radix UI (Dialog, Dropdown, Separator, Slot) |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## Project Structure

```
app/
  (auth)/           # Login, signup, forgot/reset password pages
  blogs/            # Public blog — SSG listing + detail pages
  dashboard/        # Protected dashboard, manage-blogs, settings
  api/              # REST API routes (auth, manage-blogs, public-blogs)

components/
  blogs/            # BlogCard, BlogEditor, ManageBlogsList, etc.
  dashboard/        # SideBar, SummaryCards, Charts, RecentBlogs
  layout/           # Footer, PublicNavbar
  modals/           # ProfileModal, ChangePasswordModal, DeleteConfirmModal
  ui/               # Button, Badge, Checkbox, Dialog, Dropdown, etc.

lib/
  models/           # Mongoose models (User, Blog)
  authenticateUser  # resolveUserId — unifies JWT + NextAuth session
  nextAuthOptions   # NextAuth config (Credentials + OAuth)

hooks/
  useCurrentUser    # Fetches authenticated user client-side
  useLogout         # Handles logout for both auth types
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/HafizMuhammadMateen/MasWrite.git
cd MasWrite
pnpm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>

# App URL (no trailing slash)
NEXTAUTH_URL=http://localhost:3000

# Auth secrets — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_nextauth_secret
JWT_AUTH_SECRET=your_jwt_secret

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

> Generate secrets: `openssl rand -base64 32`

### 3. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the public blog at `/blogs`.

---

## Authentication

MasWrite supports two parallel auth flows:

| Flow | How it works |
|---|---|
| **Email / Password** | Signs a JWT stored in an `httpOnly` cookie (`token`). Verified via `JWT_AUTH_SECRET`. |
| **OAuth (Google / GitHub)** | Handled by NextAuth v4. Session token stored via NextAuth's default cookie. |

All API routes use `resolveUserId()` (`lib/authenticateUser.ts`) which checks the manual JWT cookie first, then falls back to the NextAuth session token — so both flows work seamlessly.

---

## Key Scripts

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

---

## Deployment

The project is deployed on **Vercel**. On every push to the connected branch, Vercel runs:

```
pnpm install && pnpm build
```

Make sure all environment variables listed above are set in the Vercel project settings under **Settings → Environment Variables**.

---

## Author

**Hafiz Muhammad Mateen**
[GitHub](https://github.com/HafizMuhammadMateen)

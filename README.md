# MailForge — Client

> Automated email outreach platform frontend built with Next.js 15 App Router.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

---

## Overview

MailForge is a full-stack email outreach automation platform. This repository contains the **frontend** — a Next.js 15 App Router application with server components, JWT-based authentication, role-based access control, and real-time email delivery tracking.

---

## Features

- **Authentication** — Register, login, logout with JWT access + refresh token flow via httpOnly cookies
- **Role-based access control** — Admin and user roles enforced at the middleware level
- **Lead management** — Full CRUD for outreach leads with search, filtering, and status tracking
- **Template engine** — Create and manage email templates with `{{variable}}` placeholder support
- **Bulk outreach** — Select leads, pick a template, send with randomized delays between emails
- **Real-time tracking** — Live delivery status updates via Server-Sent Events (SSE)
- **Countdown timer** — Animated SVG countdown between email sends
- **Email calendar** — Daily email activity view with dot indicators and side panel drill-down
- **Dark mode** — Full dark/light mode support via shadcn/ui

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Date handling | date-fns |
| Auth | JWT (httpOnly cookies) |

---

## Project Structure

```
client/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Public auth routes
│   │   └── page.tsx            # Login / Register page
│   ├── dashboard/              # Protected dashboard
│   ├── websites/               # Lead management
│   ├── mail/                   # Outreach / send mail
│   ├── templates/              # Email templates
│   └── calendar/               # Email activity calendar
├── components/                 # Reusable UI components
│   ├── ui/                     # shadcn/ui base components
│   ├── AppSidebar.tsx          # RBAC-aware navigation
│   ├── CountdownCircle.tsx     # Animated SVG countdown
│   ├── HeroPanel.tsx           # Auth page left panel
│   └── SendMail.tsx            # Bulk send interface
├── hooks/
│   ├── useMailSSE.ts           # SSE event listener
│   └── useMailQueue.ts         # Frontend-driven mail queue
├── lib/
│   └── api.ts                  # Fetch utility with auto token refresh
├── services/
│   ├── auth.ts                 # Login, register, logout
│   ├── websites.ts             # Lead CRUD
│   ├── templates.ts            # Template CRUD
│   └── mail.ts                 # Mail send services
├── proxy.ts                    # Next.js middleware (auth + RBAC)
└── types/                      # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running instance of the MailForge backend

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mailforge-client.git
cd mailforge-client

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api/v1
ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

> `ACCESS_TOKEN_SECRET` must match the backend value exactly — used by middleware to verify JWT without an API call.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

---

## Authentication Flow

```
Register / Login
→ Backend returns accessToken in response body
→ Backend sets refreshToken as httpOnly cookie
→ Frontend saves accessToken to localStorage + regular cookie
→ Every API request sends Authorization: Bearer <token>
→ On 401 → frontend calls /auth/refresh silently
→ New accessToken saved → original request retried
```

Middleware (`proxy.ts`) reads the accessToken cookie on every request and redirects unauthenticated users to the login page before any page loads.

---

## Role-Based Access Control

| Route | User | Admin |
|---|---|---|
| `/dashboard` | ✅ | ✅ |
| `/calendar` | ✅ | ✅ |
| `/websites` | ❌ | ✅ |
| `/mail` | ❌ | ✅ |
| `/templates` | ❌ | ✅ |

Roles are read directly from the JWT payload — no extra API call needed.

---

## Deployment

This project is deployed on **Vercel**.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Required environment variables on Vercel:**

```
NEXT_PUBLIC_BASE_API=https://your-backend-url.com/api/v1
ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

---

## Known Limitations

- Mail queue requires the browser tab to remain open (delays run in the browser)
- SSE connection may drop on slow networks — reconnects automatically

---

## License

MIT

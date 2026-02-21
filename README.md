# Pran.ai — AI Digital Workforce for India

Marketing website for **Pran.ai**, a platform that deploys native-speaking, hyper-realistic AI voice and chat agents for customer support and sales development.

Built with [Next.js 16](https://nextjs.org), [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), and [Framer Motion](https://motion.dev).

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, Space Grotesk font |
| Animations | Framer Motion |
| Database | Supabase |
| Email | Resend + React Email |
| AI | Groq SDK |
| Analytics | Vercel Analytics, PostHog |
| Scheduling | Calendly (embedded) |
| Validation | Zod |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd pranai-website
npm install
```

### Environment Variables

Copy `.env.local.example` (or create `.env.local`) with the following keys:

```
# Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# Groq AI
GROQ_API_KEY=
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── actions/            # Server actions (lead submission)
├── app/
│   ├── _data.ts        # Static page data
│   ├── _sections/      # Page sections (hero, problem, solution, etc.)
│   ├── api/            # API routes (webhooks)
│   ├── components/     # Page-specific components
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── components/         # Shared components (contact modal, phone input)
├── emails/             # React Email templates
└── lib/                # Constants, animation utilities
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

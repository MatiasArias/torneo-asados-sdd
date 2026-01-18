# Overview - Torneo de Asados

## Status
- [x] Specified
- [x] Implemented  
- [x] Tested
- [x] Deployed

## Context

- **8 users total** (fixed group of friends)
- Tournament per year (2025)
- Mobile-first web app
- Trust-based (no complex permissions)
- Must work on Vercel free plan

## Goal

Simple web app to track asados, assign roles, calculate points automatically, and show rankings.

## Technology Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** (no component library)
- **React Hook Form** + **Zod** (forms)

### Backend
- **Vercel KV** (single JSON key)
- API routes in Next.js

### Auth
**Option 1 (recommended)**: No auth, shared URL
- Only friends know the URL
- Anyone can edit

**Option 2**: Single password
- One password in env variable
- Simple middleware check

**Current Implementation**: Option 1

### Deployment
- **Vercel** (free plan)
- Deploy on every push to main
- URL: https://torneo-asados-sdd.vercel.app

## Environment Variables

```bash
KV_URL=xxx
KV_REST_API_URL=xxx
KV_REST_API_TOKEN=xxx
KV_REST_API_READ_ONLY_TOKEN=xxx
```

## Repository Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── asados/       # Asados endpoints
│   │   ├── users/        # Users endpoints
│   │   └── penalties/    # Penalties endpoints
│   ├── asados/           # Asados pages
│   └── penalties/        # Penalties pages
├── components/            # React components
├── lib/                   # Business logic
│   ├── db.ts             # Database access
│   ├── points.ts         # Points calculation
│   ├── rankings.ts       # Rankings system
│   └── types.ts          # TypeScript types
├── scripts/              # Utility scripts
└── specs/                # Feature specifications
```

## What We're NOT Building (Out of Scope)

❌ Committee/roles/permissions  
❌ Multi-state validation workflow  
❌ Automatic absence tracking  
❌ Playoff system with voting  
❌ Expense tracking (friends split offline)  
❌ Cook rotation enforcement  
❌ Alternative meetup tracking  
❌ User profiles/history pages  
❌ Charts/graphs  
❌ Photos  
❌ Notifications  
❌ Mobile app  
❌ Multi-year history  

**Just the essentials: create asados, assign roles, see ranking.**

## Success Criteria

✅ 8 friends can access the app  
✅ Create asado in < 2 minutes  
✅ Points calculate correctly automatically  
✅ Rankings always up-to-date  
✅ Works on mobile phones  
✅ No bugs, simple and fast  

**Goal: Spend more time having asados than managing the app.**

---

Last updated: 2026-01-18


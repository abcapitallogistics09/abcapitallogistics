# AB Capital Logistics

A world-class logistics and freight forwarding website for AB Capital Logistics — a Cameroon-based company operating out of Douala.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/ab-capital-logistics run dev` — run the frontend (port 22466)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter, framer-motion, react-hook-form, zod, shadcn/ui, @tanstack/react-query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Frontend: `artifacts/ab-capital-logistics/src/`
  - Pages: `src/pages/` — home, about, contact, tracking, quote, services, service-detail, industries, blog, blog-post, faq, careers, global-network
  - Layout: `src/components/layout/` — Navbar (with Services dropdown), Layout (with Footer + floating WhatsApp button)
  - UI Components: `src/components/ui/` — full shadcn/ui component set
- API Server: `artifacts/api-server/src/routes/` — health, quote, contact, tracking
- DB Schema: `lib/db/src/schema/` — quotes, contacts tables
- API Spec: `lib/api-spec/` — OpenAPI YAML + Orval codegen config
- Generated Hooks: `lib/api-client-react/src/generated/` — useSubmitQuote, useSubmitContact, useTrackShipment

## Architecture decisions

- Contract-first API: OpenAPI spec → generated Zod schemas + React Query hooks via Orval
- Wouter for client-side routing (lightweight, no React Router dependency)
- Framer Motion for all page/section animations (scroll-triggered with viewport: { once: true })
- Brand colors: Primary Navy #0B1F3A (HSL 215 68% 14%), Secondary Blue #123D6B (HSL 211 71% 25%), Accent Orange #F28C28 (HSL 30 89% 55%)
- Tracking data is demo-only (ABCL-DEMO-001/002/003) for the MVP; real data would come from a shipment management system
- No auth layer for this site — it's a public marketing/transactional website

## Product

- **Homepage**: Cinematic hero, services grid, statistics, call-to-action sections
- **Services**: Overview grid + individual detail pages (Air Freight, Ocean Freight, Road Freight, Customs Clearance, Warehousing, 3PL) each with process flow, benefits, and FAQs
- **Tracking**: Real-time-style tracking UI with event timeline (demo shipments available)
- **Quote**: 3-step wizard form → stored in DB, reference number returned
- **Contact**: Full contact form → stored in DB, WhatsApp direct link
- **About**: Company story, values, milestones timeline
- **Blog**: 6 articles with featured post layout, category filtering, article detail pages with sidebar
- **Industries**: 9 industry verticals (Oil & Gas, FMCG, Telecom, etc.)
- **Global Network**: Regional presence map, carrier partners
- **FAQ**: Categorized Q&A with accordion
- **Careers**: Job openings with email application links
- Floating WhatsApp button on all pages (+237 677-238-818)

## User preferences

- Brand colors: Navy #0B1F3A, Blue #123D6B, Orange #F28C28
- Company contact: 3MGF+F5M Bonabéri, Douala, Cameroon | +237 677-238-818 | info@abcapitallogistics.com
- All pages should have premium, world-class design with framer-motion animations

## Gotchas

- Tracking route uses `getTrackShipmentQueryKey` from generated hooks — pass the tracking number as the query key
- The `useTrackShipment` hook requires `{ query: { enabled, queryKey } }` options
- Never use `console.log` in server code — use `req.log` in route handlers
- Do not run `pnpm dev` at workspace root — use workflows or `pnpm --filter` instead

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

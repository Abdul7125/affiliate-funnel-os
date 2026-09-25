# Affiliate Funnel OS

An initial, deployment-ready ClickFunnels affiliate funnel system with five message-matched entry routes:

- `/calculator` — `Entry - Calculator`
- `/funnel-audit` — `Entry - Audit`
- `/funnel-map` — `Entry - Map`
- `/funnel-templates` — `Entry - Templates`
- `/free-funnel-guide` — `Entry - Guide`

## What is implemented

The app has one shared capture and routing system. Every opt-in collects first name, email, and one low-friction business-type answer. The lead API validates the answer, persists the lead, adds entry/segment/asset tags, enrolls the lead in a shared sequence, and records a deduplicated event. Asset 4 is the branch point for business-type nurture and offer recommendations.

The local admin surface at `/admin` includes demo views for leads, tags, events, entry performance, offer readiness, and safe nurture controls. `/admin/sequences` includes per-step toggles plus a global pause/resume control. It is intentionally labeled demo mode until production authentication, database persistence, and an email provider are connected.

Offer routing is prepared for Free Trial, One Funnel Away Challenge, 3 Months for $99, PLR Funnels, and I’m All In / Funnel Builder Secrets. No affiliate URL is invented or committed. Configure the corresponding `AFFILIATE_URL_*` environment variables only after receiving approved URLs.

Tracking is prepared for browser events and the existing `/api/events` server boundary, with consent-aware attribution fields. A recorded event or HTTP response is not proof of Meta CAPI, GA, email, or affiliate-network receipt; verify those providers separately after connection.

## Local setup

```bash
npm install
npm run dev
```

Run checks with:

```bash
npm run test
npm run lint
npm run build
```

## Production handoff

1. Create the production D1/database binding and apply `migrations/0001_initial.sql` plus the additional schema statements in `db/schema.ts`.
2. Add `.env.example` values through the deployment platform’s secret manager.
3. Add an authentication layer and protect `/admin` and `/admin/sequences` before public deployment.
4. Connect the email provider and verify a real inbox receives Asset 1, then test unsubscribe handling.
5. Replace each empty affiliate URL with the exact approved destination; never infer tracking parameters.
6. Connect GTM/GA/Meta IDs and credentials, run consented browser and server event tests, and verify provider dashboards.
7. Set the production domain and complete privacy, consent, disclosure, accessibility, and mobile checks.

The system has no live provider credentials. The public GitHub repository is the developer handoff: `https://github.com/Abdul7125/affiliate-funnel-os`.

# First Client Lab — Developer Handoff

## Product position

First Client Lab is a focused affiliate education site for aspiring agency builders. The main website helps a visitor choose between five programs. Each program has a self-contained mini landing page that explains fit, benefits, limitations, and questions to check before the visitor opens the vendor website.

Locked rule: one audience, one problem, one offer, and one program landing page per paid campaign. Broad brand or comparison traffic may use the homepage; offer-specific paid traffic must go directly to the matching `/reviews/[slug]` page.

## Primary routes

- `/` — brand homepage and five-program selector
- `/reviews` — full program comparison directory
- `/reviews/[slug]` — self-contained campaign landing page with program image, benefits, fit, limitations, optional email capture, and repeated vendor CTA
- `/guide` — First Client Launch Kit
- `/resources` — original educational content hub
- `/about` — editorial method
- `/paths`, `/paths/[slug]` — optional educational support; never a required step before a vendor click
- `/mentors`, `/mentors/[slug]` — secondary expert context; not part of the paid conversion route
- `/affiliate-disclosure`, `/privacy`, `/terms`, `/contact` — trust and compliance

## Affiliate links

All offer configuration lives in `app/content-data.ts` under `reviews`.

1. Obtain written program approval.
2. Confirm paid-traffic, brand-keyword, geography, cookie, payout, refund, and creative rules.
3. Replace only the matching `affiliateUrl: null` value with the approved personalized URL.
4. Do not overwrite `officialUrl`; it is the transparent fallback.
5. Confirm the page disclosure still matches the commercial arrangement.
6. Test the click and a permitted transaction before traffic launch.

The CTA automatically uses `affiliateUrl` when present and otherwise uses `officialUrl`.

## Reusable vendor-page template

Every vendor page uses the single component `app/program-landing-template.tsx`. Do not duplicate or redesign the page for each new vendor.

To add a vendor, add one object to `reviews` in `app/content-data.ts` and provide:

- Identity: `slug`, `name`, `category`, `operator`
- Destination: `officialUrl`, then the approved `affiliateUrl`
- Creative: `image`, `imageAlt`
- Conversion copy: `headline`, `summary`, `problem`, `mechanism`, `cta`
- Decision content: `benefits`, `pros`, `goodFor`, `pauseIf`, `verify`

The template automatically creates the route, metadata, focused hero, one-problem/one-offer section, visual email capture, concise disclosure, and mobile sticky vendor button. Keep this three-block flow concise; do not restore the removed outcome, self-selection, or verification sections unless testing proves they improve qualified vendor visits.

Conversion principles are fixed in the template: message match, specificity, one problem, one mechanism, two-track intent capture, a tangible toolkit preview, and conspicuous disclosure. The vendor CTA must remain the first and dominant action. Do not add fake testimonials, false scarcity, countdown timers, income promises, or unverified claims.

Mobile requirements are part of the shared template: no horizontal overflow from 360px upward, 16px email inputs to prevent iOS focus zoom, 44px-or-larger touch targets, a persistent vendor CTA, iPhone safe-area spacing, responsive imagery, and a reduced headline scale on narrow phones. Recheck these rules whenever CTA text or vendor imagery changes.

Do not merge the five programs into a generic offer catalogue. Keep these distinctions visible:

- Acquisition.com — campaign-specific; confirm a current launch is open
- Tai Lopez AI SMMA — configured with the user-confirmed affiliate ID `/aismma/A5345541`; preserve it exactly
- ClickFunnels — the public page now promotes the user-supplied `3 Months for $99` affiliate URL. Preserve the full `aff=153e...312a` value exactly and do not mix ClickFunnels 2.0 and Classic commission structures.
- Brian Tracy — verify which affiliate route and offer-specific rate applies
- GrowthDay — do not use Brendon Burchard or coach photos; use only permitted program assets

## Email capture

Email leads are stored in the D1 `leads` table through `POST /api/leads`.

Capture points:

- Homepage guide section
- Every program landing page
- Global popup

Email capture is always optional. Never hide, delay, or lock the official vendor button behind a form submission.

Program pages do not show the global popup. Their inline email offer is the secondary conversion for visitors who are interested but not ready to visit the vendor. The primary vendor CTA remains visible in the first screen and as the mobile sticky button.

Popup rules:

- Appears after 25 seconds, approximately 48% scroll, or desktop exit intent
- Does not appear on privacy, terms, or contact pages
- Dismissal is remembered on that device for seven days
- Successful signup redirects to `/guide`
- Popup behavior lives in `app/email-popup.tsx`

The project stores subscribers and contains a Resend delivery integration inside `/api/leads`. Configure the production secrets `RESEND_API_KEY` and `LEAD_FROM_EMAIL` before launch. `LEAD_FROM_EMAIL` must use a sender/domain verified by the email provider. The email links to `/first-client-launch-kit.pdf`; the public form never exposes the provider key.

On a program landing page, successful submission sends the toolkit email and then redirects the visitor to that program's configured vendor destination. Homepage and popup signups continue to the on-site guide. If email credentials are missing, the lead is still stored and the API reports `emailSent: false`; do not claim email delivery is live until a real inbox test passes.

Recommended subscriber tags: capture source, selected path, first-touch campaign, and consent timestamp.

## Analytics and attribution implementation

Consent-aware browser tracking is implemented in `app/tracking.tsx`. The current event taxonomy is:

- `PageView` on initial load and client-side route changes
- `ViewProgram`, sent to Meta as `ViewContent`, on the Tai Lopez AI SMMA and ClickFunnels review pages
- `LeadFormOpen` when a visitor first focuses a lead form
- `Lead` only after `/api/leads` successfully stores the email
- `LeadMagnetDownload` when the launch-kit PDF is opened
- `AffiliateOutboundClick` when an affiliate CTA is clicked, including the post-lead vendor redirect

First-touch attribution stores UTM parameters, `gclid`, `gbraid`, `wbraid`, `fbclid`, `_fbc`, `_fbp`, landing page and referrer. Meta and Google browser tags load only after the corresponding consent is granted.

Server-side Meta Conversions API delivery currently covers `Lead` through `/api/leads` and `AffiliateOutboundClick` through `/api/events`. Each uses the same event ID as its browser counterpart for Meta deduplication. `PageView`, `ViewContent` and `LeadFormOpen` are currently browser-only and must not be described as browser/server-deduplicated events.

The affiliate-event endpoint records the event and attribution in D1 before attempting Meta delivery. The required database definitions are in `db/schema.ts` and `drizzle/0002_affiliate_events.sql`.

### Production configuration

Configure these server-side environment values privately in the deployment platform; never commit them to GitHub:

- `META_PIXEL_ID` — currently `1679259859838157`
- `META_CAPI_ACCESS_TOKEN` — required for server-side Meta delivery
- `META_GRAPH_VERSION` — optional; defaults to `v23.0`
- `META_TEST_EVENT_CODE` — temporary, Test Events only; remove after validation
- `RESEND_API_KEY` — required to send the launch-kit email
- `LEAD_FROM_EMAIL` — must be a sender/domain verified in Resend
- `GA_MEASUREMENT_ID` — optional Google Analytics measurement
- `GOOGLE_ADS_ID` and `GOOGLE_ADS_LEAD_LABEL` — optional Google Ads lead conversion

This implementation uses Resend, not a Gmail app password. Without the Meta token, CAPI is skipped; without the Resend values, leads are still stored but the toolkit email is not sent.

### Verification required before campaign activation

1. Deploy the merged production version and confirm the environment values are present.
2. In Meta Events Manager, obtain a temporary Test Events code and configure it as `META_TEST_EVENT_CODE`.
3. Visit both campaign landing pages with test UTM and click identifiers, accept advertising measurement, open and submit each lead form, confirm the toolkit email, and confirm the correct affiliate redirect.
4. Verify browser events for `PageView`, `ViewContent`, `LeadFormOpen`, `Lead` and `AffiliateOutboundClick`.
5. Verify server events and deduplication for `Lead` and `AffiliateOutboundClick` only.
6. Remove `META_TEST_EVENT_CODE` after testing and keep campaigns paused until the complete test passes.

Send advertising purchase events only when the vendor or affiliate network supplies confirmed server-side conversion data. Do not fire a Purchase event on an outbound click.

## Paid campaign mapping

- Offer clarity / Alex Hormozi audience → `/reviews/acquisition-com`
- AI SMMA / AI agency audience → `/reviews/tai-lopez-smma`
- Service businesses, coaches, creators, and agencies with a defined offer ready to launch → `/reviews/clickfunnels`
- Sales-skills audience → `/reviews/brian-tracy`
- Performance / consistency audience → `/reviews/growthday`

Google pages must retain meaningful original editorial value. Do not reduce them to thin email gates or automatic redirects.

## Content and claims

- Keep internal operating language out of the public UI. Program approval, commission rates, affiliate routes, tracking, portal assets, campaign selection, and implementation notes belong in this handoff or private configuration—not in visitor-facing headlines, cards, labels, or disclosures.
- Public pages should discuss the visitor's goal, what the product does, benefits, strengths, fit, limitations, current price or inclusions when verified, and questions to ask before buying.
- Never invent earnings, outcomes, reviews, credentials, approval, partnerships, or endorsements.
- Person pages explicitly separate “affiliate-program operator” from “strategy influence”; neither role implies endorsement of First Client Lab.
- Verify current prices and terms at the vendor before publishing changes.
- Preserve clear affiliate disclosures beside recommendation buttons.
- Use vendor-approved assets only; public social content is research, not reuse permission. The Tai AI SMMA page currently uses a real still from Tai's official AI SMMA video presentation. Confirm reuse permission in the affiliate portal before paid promotion and replace it with a supplied affiliate creative if required.

Deferred ClickFunnels offer: `https://www.plrfunnels.com/plr-wf?aff=153e794460350ec7f40210df38d8189c3026242c83e5dea21d81d3da97ac312a`. Do not mix it into the 3-month software page. It targets buyers seeking private-label products and ready-made funnel assets, enters through a free webinar, and should receive its own audience and landing page only if selected later.

## Data

- D1 binding: `DB`
- Schema: `db/schema.ts`
- Migration: `migrations/0001_initial.sql`
- Lead endpoint: `app/api/leads/route.ts`
- Contact endpoint: `app/api/contact/route.ts`

## Pre-launch checklist

- Replace approved affiliate URLs
- Connect email delivery and unsubscribe handling
- Configure production tracking and email secrets, then complete the Test Events workflow above
- Confirm privacy/terms with the operating business and target markets
- Replace placeholder business identity/contact details
- Verify every mobile route and form
- Test lead storage and email delivery
- Test every vendor click and affiliate attribution
- Run an accessibility and performance review
- Keep paid traffic paused until the selected offer permits it

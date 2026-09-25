export type EntryKey = 'calculator' | 'audit' | 'map' | 'templates' | 'guide';
export type SegmentKey = 'coaching' | 'course' | 'agency' | 'local' | 'ecommerce' | 'unknown';
export type OfferKey = 'free-trial' | 'ofa-challenge' | 'three-months' | 'plr-funnels' | 'all-in';

export const segmentOptions: { value: SegmentKey; label: string }[] = [
  { value: 'coaching', label: 'Coaching/consulting funnel' }, { value: 'course', label: 'Course/digital product funnel' },
  { value: 'agency', label: 'Agency/client funnel' }, { value: 'local', label: 'Local business funnel' },
  { value: 'ecommerce', label: 'Ecommerce funnel' }, { value: 'unknown', label: "I don't know yet" },
];

export type EntryConfig = { key: EntryKey; path: string; tag: string; eyebrow: string; title: string; body: string; promise: string; bullets: string[]; cta: string };
export const entries: Record<EntryKey, EntryConfig> = {
  calculator: { key: 'calculator', path: '/calculator', tag: 'Entry - Calculator', eyebrow: 'Funnel clarity calculator', title: 'See what your funnel is costing you before you buy another tool.', body: 'Answer a few practical questions and get a simple starting point for the next funnel improvement worth making.', promise: 'A 3-minute funnel baseline for your next decision.', bullets: ['Spot the highest-friction step', 'Separate traffic, offer, and follow-up problems', 'Get a recommendation matched to your funnel type'], cta: 'Get my funnel baseline' },
  audit: { key: 'audit', path: '/funnel-audit', tag: 'Entry - Audit', eyebrow: 'Funnel audit checklist', title: 'Find the leaks between click, lead, and customer.', body: 'Use the audit to turn a vague “my funnel is not working” feeling into a short list of observable fixes.', promise: 'A practical leak-finding checklist, delivered before the recommendations.', bullets: ['Review message match and offer clarity', 'Check capture, follow-up, and handoffs', 'Prioritize the fix with the clearest upside'], cta: 'Send me the audit' },
  map: { key: 'map', path: '/funnel-map', tag: 'Entry - Map', eyebrow: 'Funnel map', title: 'Map the simplest path from first click to next step.', body: 'Start with the visitor decision, then map only the pages, messages, and follow-up needed to support it.', promise: 'A one-page funnel map you can explain to a teammate or client.', bullets: ['Choose one audience and one next action', 'Connect page, email, and offer logic', 'Make missing ownership visible'], cta: 'Get the funnel map' },
  templates: { key: 'templates', path: '/funnel-templates', tag: 'Entry - Templates', eyebrow: 'Funnel templates', title: 'Start from a funnel structure that fits what you sell.', body: 'Get the educational foundation first. At the template step, choose your business type and branch into the most relevant build path.', promise: 'Business-type templates plus a recommendation path that stays specific.', bullets: ['Coaching, course, agency, local, or ecommerce paths', 'Clear page and follow-up jobs', 'Offer routing after intent is known'], cta: 'Send me the templates' },
  guide: { key: 'guide', path: '/free-funnel-guide', tag: 'Entry - Guide', eyebrow: 'Free funnel guide', title: 'Build a funnel people can understand, enter, and finish.', body: 'A short guide to the decisions that matter before software, automation, or traffic makes the system more complicated.', promise: 'A foundational guide first, followed by useful next steps—not a hard sell.', bullets: ['Clarify the offer and audience', 'Choose the smallest useful funnel', 'Learn when to consider a ClickFunnels path'], cta: 'Email me the free guide' },
};

export const offers: Record<OfferKey, { key: OfferKey; name: string; audience: string; description: string; envKey: string; url: string | null }> = {
  'free-trial': { key: 'free-trial', name: 'ClickFunnels Free Trial', audience: 'People who need to validate the core funnel flow', description: 'A low-commitment starting point for exploring the platform and getting the first path connected.', envKey: 'AFFILIATE_URL_FREE_TRIAL', url: null },
  'ofa-challenge': { key: 'ofa-challenge', name: 'One Funnel Away Challenge', audience: 'People who want a guided build sprint', description: 'A challenge-style path for turning the idea into a focused funnel build.', envKey: 'AFFILIATE_URL_OFA_CHALLENGE', url: null },
  'three-months': { key: 'three-months', name: '3 Months for $99', audience: 'People with an offer ready to build and test', description: 'A longer runway for publishing and improving one complete funnel.', envKey: 'AFFILIATE_URL_THREE_MONTHS', url: null },
  'plr-funnels': { key: 'plr-funnels', name: 'PLR Funnels', audience: 'People seeking private-label funnel assets', description: 'A separate path for buyers evaluating ready-made funnel assets and licensing options.', envKey: 'AFFILIATE_URL_PLR_FUNNELS', url: null },
  'all-in': { key: 'all-in', name: "I'm All In / Funnel Builder Secrets", audience: 'People ready for a deeper funnel-building commitment', description: 'The higher-intent path for visitors who already know they want a full funnel education system.', envKey: 'AFFILIATE_URL_ALL_IN', url: null },
};
export const defaultOfferBySegment: Record<SegmentKey, OfferKey> = { coaching: 'three-months', course: 'all-in', agency: 'three-months', local: 'free-trial', ecommerce: 'ofa-challenge', unknown: 'free-trial' };
export const assetSequence = [
  { number: 1, key: 'foundation', title: 'The funnel foundation', description: 'Audience, offer, promise, and the one action the page should earn.' },
  { number: 2, key: 'message', title: 'Message match', description: 'Make the entry page, opt-in, and follow-up tell the same story.' },
  { number: 3, key: 'follow-up', title: 'Follow-up that helps', description: 'Teach the next decision before asking for a platform decision.' },
  { number: 4, key: 'templates', title: 'Choose your business-type template', description: 'Intent selection branches into a relevant nurture sequence and recommendation.' },
];
export const entryList = Object.values(entries);

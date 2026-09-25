export const createLeadsTable = `
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'website',
    entry_key TEXT NOT NULL DEFAULT '',
    segment TEXT NOT NULL DEFAULT 'unknown',
    consent INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export const createLeadEmailIndex = `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email ON leads(email)
`;

export const createLeadEventsTable = `
  CREATE TABLE IF NOT EXISTS lead_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    source TEXT NOT NULL,
    event_id TEXT NOT NULL,
    program TEXT NOT NULL DEFAULT '',
    redirect_url TEXT NOT NULL DEFAULT '',
    page_url TEXT NOT NULL DEFAULT '',
    landing_page TEXT NOT NULL DEFAULT '',
    referrer TEXT NOT NULL DEFAULT '',
    utm_source TEXT NOT NULL DEFAULT '',
    utm_medium TEXT NOT NULL DEFAULT '',
    utm_campaign TEXT NOT NULL DEFAULT '',
    utm_content TEXT NOT NULL DEFAULT '',
    utm_term TEXT NOT NULL DEFAULT '',
    gclid TEXT NOT NULL DEFAULT '',
    gbraid TEXT NOT NULL DEFAULT '',
    wbraid TEXT NOT NULL DEFAULT '',
    fbclid TEXT NOT NULL DEFAULT '',
    fbc TEXT NOT NULL DEFAULT '',
    fbp TEXT NOT NULL DEFAULT '',
    ad_consent TEXT NOT NULL DEFAULT 'denied',
    analytics_consent TEXT NOT NULL DEFAULT 'denied',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export const createLeadEventIdIndex = `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_events_event_id ON lead_events(event_id)
`;

export const createAffiliateEventsTable = `
  CREATE TABLE IF NOT EXISTS affiliate_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL,
    lead_event_id TEXT NOT NULL DEFAULT '',
    program TEXT NOT NULL,
    cta_location TEXT NOT NULL DEFAULT 'unknown',
    destination_url TEXT NOT NULL DEFAULT '',
    page_url TEXT NOT NULL DEFAULT '',
    landing_page TEXT NOT NULL DEFAULT '',
    referrer TEXT NOT NULL DEFAULT '',
    utm_source TEXT NOT NULL DEFAULT '',
    utm_medium TEXT NOT NULL DEFAULT '',
    utm_campaign TEXT NOT NULL DEFAULT '',
    utm_content TEXT NOT NULL DEFAULT '',
    utm_term TEXT NOT NULL DEFAULT '',
    gclid TEXT NOT NULL DEFAULT '',
    fbclid TEXT NOT NULL DEFAULT '',
    fbc TEXT NOT NULL DEFAULT '',
    fbp TEXT NOT NULL DEFAULT '',
    ad_consent TEXT NOT NULL DEFAULT 'denied',
    analytics_consent TEXT NOT NULL DEFAULT 'denied',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export const createAffiliateEventIdIndex = `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliate_events_event_id ON affiliate_events(event_id)
`;

export const createAffiliateProgramCreatedIndex = `
  CREATE INDEX IF NOT EXISTS idx_affiliate_events_program_created_at ON affiliate_events(program, created_at)
`;

export const createMessagesTable = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export const createLeadTagsTable = `
  CREATE TABLE IF NOT EXISTS lead_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    tag TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email, tag)
  )
`;

export const createSequenceEnrollmentsTable = `
  CREATE TABLE IF NOT EXISTS sequence_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    sequence_key TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    current_step INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email, sequence_key)
  )
`;

export const createFunnelEventsTable = `
  CREATE TABLE IF NOT EXISTS funnel_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL UNIQUE,
    event_name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    entry_key TEXT NOT NULL DEFAULT '',
    segment TEXT NOT NULL DEFAULT '',
    payload_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

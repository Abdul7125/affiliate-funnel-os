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
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliate_events_event_id ON affiliate_events(event_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_events_program_created_at ON affiliate_events(program, created_at);

PRAGMA optimize;


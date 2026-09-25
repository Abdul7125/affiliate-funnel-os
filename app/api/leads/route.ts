import { env } from 'cloudflare:workers';
import { createFunnelEventsTable, createLeadEmailIndex, createLeadEventIdIndex, createLeadEventsTable, createLeadTagsTable, createLeadsTable, createSequenceEnrollmentsTable } from '../../../db/schema';
import { defaultOfferBySegment, entries, segmentOptions, type EntryKey, type SegmentKey } from '../../../app/content-data';

const validEntries = new Set(Object.keys(entries));
const validSegments = new Set(segmentOptions.map((item) => item.value));
const emailPattern = /^\S+@\S+\.\S+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { firstName?: string; email?: string; entry?: string; source?: string; segment?: string; eventId?: string; attribution?: Record<string, unknown> };
    const firstName = body.firstName?.trim().slice(0, 80) || '';
    const email = body.email?.trim().toLowerCase() || '';
    const entry = (body.entry || 'guide') as EntryKey;
    const segment = (body.segment || 'unknown') as SegmentKey;
    if (!firstName || firstName.length < 2) return Response.json({ error: 'Enter your first name.' }, { status: 400 });
    if (!emailPattern.test(email)) return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
    if (!validEntries.has(entry)) return Response.json({ error: 'Choose a valid entry page.' }, { status: 400 });
    if (!validSegments.has(segment)) return Response.json({ error: 'Choose a valid funnel type.' }, { status: 400 });

    let database: D1Database | undefined;
    try { database = (env as unknown as { DB?: D1Database }).DB; } catch { database = undefined; }
    const eventId = body.eventId?.slice(0, 120) || crypto.randomUUID();
    const source = body.source?.slice(0, 80) || entry;
    const tagValues = [`Entry - ${entry[0].toUpperCase()}${entry.slice(1)}`, 'Lead', `Segment - ${segment}`, 'Asset - 1'];
    if (!database) return Response.json({ ok: true, recorded: false, demo: true, eventId, recommendedOffer: defaultOfferBySegment[segment], providerReceipt: 'unverified' });
    await database.batch([
      database.prepare(createLeadsTable), database.prepare(createLeadEmailIndex), database.prepare(createLeadEventsTable), database.prepare(createLeadEventIdIndex),
      database.prepare(createLeadTagsTable), database.prepare(createSequenceEnrollmentsTable), database.prepare(createFunnelEventsTable),
    ]);
    await database.prepare(`INSERT INTO leads (first_name, email, source, entry_key, segment, consent) VALUES (?, ?, ?, ?, ?, 1) ON CONFLICT(email) DO UPDATE SET first_name = excluded.first_name, source = excluded.source, entry_key = excluded.entry_key, segment = excluded.segment`).bind(firstName, email, source, entry, segment).run();
    for (const tag of tagValues) await database.prepare('INSERT OR IGNORE INTO lead_tags (email, tag) VALUES (?, ?)').bind(email, tag).run();
    await database.prepare('INSERT OR IGNORE INTO sequence_enrollments (email, sequence_key, status, current_step) VALUES (?, ?, ?, 1)').bind(email, `shared-${entry}`, 'active').run();
    await database.prepare('INSERT OR IGNORE INTO funnel_events (event_id, event_name, email, entry_key, segment, payload_json) VALUES (?, ?, ?, ?, ?, ?)').bind(eventId, 'Lead', email, entry, segment, JSON.stringify({ source, attribution: body.attribution || {} })).run();
    return Response.json({ ok: true, recorded: true, eventId, recommendedOffer: defaultOfferBySegment[segment], providerReceipt: 'unverified' });
  } catch {
    return Response.json({ error: 'We could not save your details. Connect the database binding or try again.' }, { status: 500 });
  }
}

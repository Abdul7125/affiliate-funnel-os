import { env } from 'cloudflare:workers';
import { createAffiliateEventIdIndex, createAffiliateEventsTable, createAffiliateProgramCreatedIndex } from '../../../db/schema';

type ConsentValue = 'granted' | 'denied';
type Attribution = {
  pageUrl?: string; landingPage?: string; referrer?: string;
  utmSource?: string; utmMedium?: string; utmCampaign?: string; utmContent?: string; utmTerm?: string;
  gclid?: string; fbclid?: string; fbc?: string; fbp?: string;
  consent?: { analytics_storage?: ConsentValue; ad_storage?: ConsentValue };
};

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value.trim().toLowerCase()));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sendMetaAffiliateClick(request: Request, body: { eventId:string; leadEventId?:string; program:string; ctaLocation:string; destinationUrl:string; email?:string; attribution:Attribution }) {
  const runtime = env as unknown as { META_PIXEL_ID?:string; META_CAPI_ACCESS_TOKEN?:string; META_TEST_EVENT_CODE?:string; META_GRAPH_VERSION?:string };
  if (!runtime.META_PIXEL_ID || !runtime.META_CAPI_ACCESS_TOKEN || body.attribution.consent?.ad_storage !== 'granted') return false;
  const userData: Record<string,unknown> = { client_user_agent:request.headers.get('user-agent') || undefined };
  const clientIp = request.headers.get('cf-connecting-ip'); if (clientIp) userData.client_ip_address = clientIp;
  if (body.email) userData.em = [await sha256(body.email)];
  if (body.attribution.fbc) userData.fbc = body.attribution.fbc;
  if (body.attribution.fbp) userData.fbp = body.attribution.fbp;
  const payload: Record<string,unknown> = { data:[{
    event_name:'AffiliateOutboundClick', event_time:Math.floor(Date.now()/1000), event_id:body.eventId,
    action_source:'website', event_source_url:body.attribution.pageUrl || request.headers.get('referer') || '',
    user_data:userData,
    custom_data:{ program:body.program, cta_location:body.ctaLocation, destination_url:body.destinationUrl, lead_event_id:body.leadEventId || '' },
  }] };
  if (runtime.META_TEST_EVENT_CODE) payload.test_event_code = runtime.META_TEST_EVENT_CODE;
  const version = runtime.META_GRAPH_VERSION || 'v23.0';
  const response = await fetch(`https://graph.facebook.com/${version}/${encodeURIComponent(runtime.META_PIXEL_ID)}/events?access_token=${encodeURIComponent(runtime.META_CAPI_ACCESS_TOKEN)}`, { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify(payload) });
  return response.ok;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { eventId?:string; leadEventId?:string; program?:string; ctaLocation?:string; destinationUrl?:string; email?:string; attribution?:Attribution };
    const attribution = body.attribution || {};
    if (!body.eventId || !body.program || !body.destinationUrl) return Response.json({ error:'Invalid event.' }, { status:400 });
    if (attribution.consent?.analytics_storage !== 'granted' && attribution.consent?.ad_storage !== 'granted') return Response.json({ ok:true, recorded:false, metaSent:false });
    const record = {
      eventId:body.eventId.slice(0,120), leadEventId:body.leadEventId?.slice(0,120) || '', program:body.program.slice(0,80),
      ctaLocation:body.ctaLocation?.slice(0,80) || 'unknown', destinationUrl:body.destinationUrl.slice(0,1000),
    };
    const database = env.DB as D1Database;
    await database.batch([
      database.prepare(createAffiliateEventsTable),
      database.prepare(createAffiliateEventIdIndex),
      database.prepare(createAffiliateProgramCreatedIndex),
    ]);
    await database.prepare(`
      INSERT OR IGNORE INTO affiliate_events (
        event_id, lead_event_id, program, cta_location, destination_url, page_url, landing_page, referrer,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid, fbc, fbp, ad_consent, analytics_consent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      record.eventId, record.leadEventId, record.program, record.ctaLocation, record.destinationUrl,
      attribution.pageUrl?.slice(0,1000) || '', attribution.landingPage?.slice(0,1000) || '', attribution.referrer?.slice(0,1000) || '',
      attribution.utmSource?.slice(0,200) || '', attribution.utmMedium?.slice(0,200) || '', attribution.utmCampaign?.slice(0,200) || '', attribution.utmContent?.slice(0,200) || '', attribution.utmTerm?.slice(0,200) || '',
      attribution.gclid?.slice(0,500) || '', attribution.fbclid?.slice(0,500) || '', attribution.fbc?.slice(0,500) || '', attribution.fbp?.slice(0,500) || '',
      attribution.consent?.ad_storage || 'denied', attribution.consent?.analytics_storage || 'denied'
    ).run();
    const metaSent = await sendMetaAffiliateClick(request, { ...record, email:body.email?.trim().toLowerCase(), attribution });
    return Response.json({ ok:true, recorded:true, metaSent, eventId:record.eventId });
  } catch {
    return Response.json({ error:'Event could not be recorded.' }, { status:500 });
  }
}

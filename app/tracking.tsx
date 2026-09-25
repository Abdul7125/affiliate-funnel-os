'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type ConsentValue = 'granted' | 'denied';
export type TrackingConsent = { analytics_storage: ConsentValue; ad_storage: ConsentValue; ad_user_data: ConsentValue; ad_personalization: ConsentValue };
export type Attribution = {
  pageUrl: string; landingPage: string; referrer: string;
  utmSource: string; utmMedium: string; utmCampaign: string; utmContent: string; utmTerm: string;
  gclid: string; gbraid: string; wbraid: string; fbclid: string; fbc: string; fbp: string;
  consent: TrackingConsent;
};
type TrackingConfig = { metaPixelId?: string; gaMeasurementId?: string; googleAdsId?: string; googleAdsLeadLabel?: string };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: Window['fbq'];
    __fclTrackingConfig?: TrackingConfig;
  }
}

const CONSENT_KEY = 'ubm_tracking_consent_v1';
const ATTRIBUTION_KEY = 'ubm_attribution_v1';
const denied: TrackingConsent = { analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' };
const granted: TrackingConsent = { analytics_storage:'granted', ad_storage:'granted', ad_user_data:'granted', ad_personalization:'granted' };

function readConsent(): TrackingConsent {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || '') as TrackingConsent; } catch { return denied; }
}
function cookie(name: string) {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').find((item) => item.startsWith(`${name}=`))?.split('=').slice(1).join('=') || '';
}
function rememberAttribution() {
  const query = new URLSearchParams(location.search);
  let stored: Record<string,string> = {};
  try { stored = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || '{}'); } catch {}
  const keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid','fbclid'];
  for (const key of keys) if (query.get(key)) stored[key] = query.get(key) || '';
  stored.landing_page ||= location.href;
  stored.first_seen_at ||= new Date().toISOString();
  localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(stored));
  return stored;
}

export function trackingEventId(prefix = 'evt') { return `${prefix}-${Date.now()}-${crypto.randomUUID()}`; }

export function getAttribution(): Attribution {
  const stored = typeof window === 'undefined' ? {} : rememberAttribution();
  const fbclid = stored.fbclid || '';
  return {
    pageUrl: typeof location === 'undefined' ? '' : location.href,
    landingPage: stored.landing_page || '', referrer: typeof document === 'undefined' ? '' : document.referrer,
    utmSource: stored.utm_source || '', utmMedium: stored.utm_medium || '', utmCampaign: stored.utm_campaign || '',
    utmContent: stored.utm_content || '', utmTerm: stored.utm_term || '',
    gclid: stored.gclid || '', gbraid: stored.gbraid || '', wbraid: stored.wbraid || '', fbclid,
    fbc: cookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : ''), fbp: cookie('_fbp'),
    consent: typeof window === 'undefined' ? denied : readConsent(),
  };
}

export function trackWebsiteEvent(eventName: string, parameters: Record<string, unknown> = {}, eventId?: string) {
  if (typeof window === 'undefined') return;
  const id = eventId || trackingEventId(eventName.toLowerCase());
  const consent = readConsent();
  window.dataLayer ||= [];
  window.dataLayer.push({ event:eventName, event_id:id, ...parameters });
  const gaNames: Record<string,string> = { PageView:'page_view', ViewProgram:'view_program', LeadFormOpen:'lead_form_open', Lead:'generate_lead', LeadMagnetDownload:'file_download', AffiliateOutboundClick:'affiliate_click' };
  if (consent.analytics_storage === 'granted') window.gtag?.('event', gaNames[eventName] || eventName, { ...parameters, event_id:id });
  if (consent.ad_storage === 'granted' && window.fbq) {
    if (eventName === 'PageView') window.fbq('track', 'PageView', parameters, { eventID:id });
    else if (eventName === 'ViewProgram') window.fbq('track', 'ViewContent', parameters, { eventID:id });
    else if (eventName === 'Lead') window.fbq('track', 'Lead', parameters, { eventID:id });
    else window.fbq('trackCustom', eventName, parameters, { eventID:id });
  }
  const config = window.__fclTrackingConfig;
  if (eventName === 'Lead' && consent.ad_storage === 'granted' && config?.googleAdsId && config.googleAdsLeadLabel) {
    window.gtag?.('event', 'conversion', { send_to:`${config.googleAdsId}/${config.googleAdsLeadLabel}`, ...parameters, event_id:id });
  }
}

export function trackAffiliateOutboundClick(program: string, ctaLocation: string, destinationUrl: string, email = '', leadEventId = '') {
  if (typeof window === 'undefined') return '';
  const eventId = trackingEventId('affiliate-click');
  const attribution = getAttribution();
  trackWebsiteEvent('AffiliateOutboundClick', { program, cta_location:ctaLocation, destination_url:destinationUrl }, eventId);
  if (attribution.consent.analytics_storage === 'denied' && attribution.consent.ad_storage === 'denied') return eventId;
  const body = JSON.stringify({ eventId, leadEventId, program, ctaLocation, destinationUrl, email, attribution });
  const blob = new Blob([body], { type:'application/json' });
  if (!navigator.sendBeacon?.('/api/events', blob)) {
    void fetch('/api/events', { method:'POST', headers:{ 'content-type':'application/json' }, body, keepalive:true }).catch(() => {});
  }
  return eventId;
}

function loadGoogle(config: TrackingConfig, consent: TrackingConsent) {
  const id = config.gaMeasurementId || config.googleAdsId;
  if (!id || document.querySelector('script[data-ubm-google]')) return;
  window.dataLayer ||= [];
  window.gtag = window.gtag || function(...args: unknown[]) { window.dataLayer.push(args); };
  window.gtag('consent', 'default', { ...denied, wait_for_update:500 });
  window.gtag('js', new Date());
  if (config.gaMeasurementId) window.gtag('config', config.gaMeasurementId, { send_page_view:false });
  if (config.googleAdsId) window.gtag('config', config.googleAdsId);
  window.gtag('consent', 'update', consent);
  const script = document.createElement('script'); script.async = true; script.dataset.ubmGoogle = '1'; script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`; document.head.appendChild(script);
}

function loadMeta(pixelId?: string) {
  if (!pixelId || window.fbq) return;
  const fbq = function(...args: unknown[]) { if (fbq.callMethod) fbq.callMethod(...args); else (fbq.queue ||= []).push(args); } as Window['fbq'];
  if (!fbq) return;
  window.fbq = fbq; window._fbq = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
  const script = document.createElement('script'); script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(script);
  fbq('init', pixelId);
}

export function TrackingProvider() {
  const pathname = usePathname();
  const [choiceMade, setChoiceMade] = useState(false);
  const [config, setConfig] = useState<TrackingConfig>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    rememberAttribution(); window.setTimeout(() => setChoiceMade(Boolean(localStorage.getItem(CONSENT_KEY))), 0);
    const consent = readConsent();
    fetch('/api/tracking-config').then((r) => r.ok ? r.json() : {}).then((value: TrackingConfig) => {
      setConfig(value); window.__fclTrackingConfig = value; loadGoogle(value, consent); if (consent.ad_storage === 'granted') loadMeta(value.metaPixelId);
    }).catch(() => {}).finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (!ready) return;
    const program = pathname.startsWith('/reviews/') ? pathname.split('/').pop() || '' : '';
    trackWebsiteEvent('PageView', { page_path:pathname });
    if (program === 'tai-lopez-smma' || program === 'clickfunnels') trackWebsiteEvent('ViewProgram', { content_name:program, content_category:'affiliate_program' });
  }, [pathname, ready]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest('a'); if (!target) return;
      const program = target.getAttribute('data-affiliate-program');
      if (program) trackAffiliateOutboundClick(program, target.getAttribute('data-cta-location') || 'unknown', target.getAttribute('href') || '');
      if ((target.getAttribute('href') || '').includes('first-client-launch-kit.pdf')) trackWebsiteEvent('LeadMagnetDownload', { file_name:'first-client-launch-kit.pdf' });
    };
    document.addEventListener('click', onClick); return () => document.removeEventListener('click', onClick);
  }, []);
  function choose(consent: TrackingConsent) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); setChoiceMade(true);
    window.gtag?.('consent', 'update', consent);
    if (consent.ad_storage === 'granted') { loadMeta(config.metaPixelId); setTimeout(() => trackWebsiteEvent('PageView', { page_path:location.pathname, consent_update:true }), 50); }
  }
  return <>
    {!choiceMade && <aside className="consent-banner" aria-label="Privacy choices"><div><strong>UBM Trainings respects your privacy.</strong><p>Allow analytics and advertising measurement so we can understand which campaigns produce real leads. You can continue without accepting.</p></div><div className="consent-actions"><button onClick={() => choose(denied)}>Reject optional tracking</button><button className="consent-accept" onClick={() => choose(granted)}>Accept tracking</button></div></aside>}
    {choiceMade && <button className="consent-manage" onClick={() => setChoiceMade(false)}>Privacy choices</button>}
  </>;
}

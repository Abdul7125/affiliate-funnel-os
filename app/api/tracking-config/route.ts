import { env } from 'cloudflare:workers';

export async function GET() {
  const runtime = env as unknown as { META_PIXEL_ID?: string; GA_MEASUREMENT_ID?: string; GOOGLE_ADS_ID?: string; GOOGLE_ADS_LEAD_LABEL?: string };
  return Response.json({ metaPixelId:runtime.META_PIXEL_ID || '', gaMeasurementId:runtime.GA_MEASUREMENT_ID || '', googleAdsId:runtime.GOOGLE_ADS_ID || '', googleAdsLeadLabel:runtime.GOOGLE_ADS_LEAD_LABEL || '' }, { headers:{ 'cache-control':'public, max-age=300' } });
}

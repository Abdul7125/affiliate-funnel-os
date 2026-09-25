import { env } from 'cloudflare:workers';
import { offers, type OfferKey } from '../../../content-data';

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params;
    if (!(key in offers)) return Response.json({ error: 'Unknown offer.' }, { status: 404 });
    const offer = offers[key as OfferKey];
    let destination = '';
    try {
      const runtime = env as unknown as Record<string, string | undefined>;
      destination = runtime[offer.envKey] || '';
    } catch {
      destination = '';
    }
    if (!destination || !/^https:\/\//i.test(destination)) return Response.json({ error: 'Offer destination is not configured.', offer: offer.name, envKey: offer.envKey, configured: false }, { status: 503 });
    return Response.redirect(destination, 302);
}

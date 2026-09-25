'use client';

import { FormEvent, useState } from 'react';
import { defaultOfferBySegment, segmentOptions, type EntryKey, type SegmentKey } from './content-data';
import { getAttribution, trackWebsiteEvent, trackingEventId } from './tracking';

export function FunnelLeadForm({ entry, compact = false }: { entry: EntryKey; compact?: boolean }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [segment, setSegment] = useState<SegmentKey>('unknown');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('saving'); setMessage('');
    const eventId = trackingEventId('lead');
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ firstName, email, segment, entry, source: entry, eventId, attribution: getAttribution() }) });
      const result = await response.json() as { error?: string; recommendedOffer?: string };
      if (!response.ok) throw new Error(result.error || 'Please try again.');
      trackWebsiteEvent('Lead', { entry_tag: `Entry - ${entry[0].toUpperCase()}${entry.slice(1)}`, segment, recommended_offer: result.recommendedOffer || defaultOfferBySegment[segment] }, eventId);
      setStatus('saved'); setMessage('You’re in. Asset 1 is ready, and we’ll send the next steps to your inbox.');
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Please try again.'); }
  }

  if (status === 'saved') return <div className="form-success" role="status"><strong>Thanks, {firstName || 'there'}.</strong><p>{message}</p><a className="secondary-button" href="/free-funnel-guide">Continue to the guide →</a></div>;
  return <form className={`funnel-form ${compact ? 'compact-form' : ''}`} onSubmit={submit}>
    <div className="form-heading"><span>Free access</span><strong>Get the first asset, then choose your path.</strong></div>
    <label htmlFor={`${entry}-first-name`}>First name<input id={`${entry}-first-name`} value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" required /></label>
    <label htmlFor={`${entry}-email`}>Email<input id={`${entry}-email`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
    <label htmlFor={`${entry}-segment`}>What are you building?<select id={`${entry}-segment`} value={segment} onChange={(event) => setSegment(event.target.value as SegmentKey)}>{segmentOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
    <button className="primary-button" type="submit" disabled={status === 'saving'}>{status === 'saving' ? 'Saving…' : 'Send me the asset →'}</button>
    <p className="form-note">Educational email only. Unsubscribe anytime. We’ll use your answer to tailor the later template and offer path.</p>
    {status === 'error' && <p className="form-error" role="alert">{message}</p>}
  </form>;
}

'use client';
import { FormEvent, useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setStatus('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Please try again.');
      event.currentTarget.reset(); setStatus('Thanks—your message has been received.');
    } catch (caught) { setStatus(caught instanceof Error ? caught.message : 'Please try again.'); }
    finally { setLoading(false); }
  }
  return <form className="contact-form" onSubmit={submit}>
    <label>Name<input name="name" required /></label>
    <label>Email<input name="email" type="email" required /></label>
    <label>How can we help?<textarea name="message" rows={7} required /></label>
    <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send message'}</button>
    {status && <p className="form-status" role="status">{status}</p>}
  </form>;
}

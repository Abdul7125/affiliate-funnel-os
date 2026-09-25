import { env } from 'cloudflare:workers';
import { createMessagesTable } from '../../../db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; email?: string; message?: string };
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const message = body.message?.trim();
    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !message) {
      return Response.json({ error: 'Complete all fields with valid information.' }, { status: 400 });
    }
    const database = env.DB as D1Database;
    await database.prepare(createMessagesTable).run();
    await database.prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)')
      .bind(name.slice(0, 100), email, message.slice(0, 3000)).run();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Your message could not be saved. Please try again.' }, { status: 500 });
  }
}

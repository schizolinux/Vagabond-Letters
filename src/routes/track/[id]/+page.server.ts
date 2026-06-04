import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

  const stmt = db.prepare(`
    SELECT letters.*,
           sender.name as sender,
           recipient.name as recipient
    FROM letters
    INNER JOIN users as sender ON letters.sender_id = sender.id
    INNER JOIN users as recipient ON letters.recipient_id = recipient.id
    WHERE letters.id = ?
  `);
  const letter = stmt.get(id) as {
    id: string;
    from_city: string;
    to_city: string;
    sender: string;
    recipient: string;
    message: string;
    dispatch_time: number;
    arrival_time: number;
  } | undefined;

  if (!letter) {
    throw error(404, 'Letter not found');
  }

  return { letter };
};

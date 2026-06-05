import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import sql from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

  const result = await sql`
    SELECT letters.*,
           sender.name as sender,
           recipient.name as recipient
    FROM letters
    INNER JOIN users as sender ON letters.sender_id = sender.id
    INNER JOIN users as recipient ON letters.recipient_id = recipient.id
    WHERE letters.id = ${id}
  `;
  const letter = result[0] as {
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

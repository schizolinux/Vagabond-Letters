import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

  const stmt = db.prepare('SELECT * FROM letters WHERE id = ?');
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

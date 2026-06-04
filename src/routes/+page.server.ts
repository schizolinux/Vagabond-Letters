import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import db from '$lib/server/db';
import crypto from 'crypto';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getCoordinates(city: string) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, {
    headers: {
      'User-Agent': 'SlowLetterApp/1.0'
    }
  });
  const data = await res.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  return null;
}

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// If not logged in, they can't send a letter. They will see the landing page and be directed to login.
  let friends: any[] = [];
  if (locals.user) {
    friends = db.prepare(`
      SELECT users.id, users.name, users.email
      FROM friends
      INNER JOIN users ON friends.friend_id = users.id
      WHERE friends.user_id = ?
    `).all(locals.user.id);
  }

  return { friends };
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login');
    }

    const data = await request.formData();
    const from_city = data.get('from_city')?.toString();
    const to_city = data.get('to_city')?.toString();
    const recipient_id = data.get('recipient_id')?.toString();
    const message = data.get('message')?.toString();

    if (!from_city || !to_city || !recipient_id || !message) {
      return { success: false, error: 'All fields are required.' };
    }

    const fromCoords = await getCoordinates(from_city);
    const toCoords = await getCoordinates(to_city);

    if (!fromCoords || !toCoords) {
      return { success: false, error: 'Could not find coordinates for one or both cities.' };
    }

    const distance = haversine(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
    
    // Speed: 500 km per day
    let days = distance / 500;
    
    // For very close distances, let's make it at least take a short amount of time, e.g., 5 minutes 
    // so the tracking bar can be observed
    if (days < (5 / (24 * 60))) {
        days = 5 / (24 * 60);
    }

    const durationMs = Math.round(days * 24 * 60 * 60 * 1000);
    const dispatch_time = Date.now();
    const arrival_time = dispatch_time + durationMs;

    const id = crypto.randomUUID();

    // Verify recipient is a friend
    const isFriend = db.prepare('SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?').get(locals.user.id, recipient_id);
    if (!isFriend) {
      return { success: false, error: 'You can only send letters to friends.' };
    }

    const stmt = db.prepare(`
      INSERT INTO letters (id, from_city, to_city, sender_id, recipient_id, message, dispatch_time, arrival_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, from_city, to_city, locals.user.id, recipient_id, message, dispatch_time, arrival_time);

    throw redirect(303, `/track/${id}`);
  }
};

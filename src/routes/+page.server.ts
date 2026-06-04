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

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const from_city = data.get('from_city')?.toString();
    const to_city = data.get('to_city')?.toString();
    const sender = data.get('sender')?.toString();
    const recipient = data.get('recipient')?.toString();
    const sender_email = data.get('sender_email')?.toString();
    const recipient_email = data.get('recipient_email')?.toString();
    const message = data.get('message')?.toString();

    if (!from_city || !to_city || !sender || !recipient || !sender_email || !recipient_email || !message) {
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

    const stmt = db.prepare(`
      INSERT INTO letters (id, from_city, to_city, sender, recipient, sender_email, recipient_email, message, dispatch_time, arrival_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, from_city, to_city, sender, recipient, sender_email, recipient_email, message, dispatch_time, arrival_time);

    throw redirect(303, `/track/${id}`);
  }
};

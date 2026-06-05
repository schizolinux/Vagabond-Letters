import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import sql from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// Fetch letters sent BY the user
	const sentLetters = await sql`
		SELECT letters.id, letters.to_city, letters.dispatch_time, letters.arrival_time, users.name as recipient_name
		FROM letters
		INNER JOIN users ON letters.recipient_id = users.id
		WHERE letters.sender_id = ${locals.user.id}
		ORDER BY letters.dispatch_time DESC
	`;

	// Fetch letters sent TO the user
	const receivedLetters = await sql`
		SELECT letters.id, letters.from_city, letters.dispatch_time, letters.arrival_time, users.name as sender_name
		FROM letters
		INNER JOIN users ON letters.sender_id = users.id
		WHERE letters.recipient_id = ${locals.user.id}
		ORDER BY letters.arrival_time DESC
	`;

	return {
		sentLetters,
		receivedLetters
	};
};

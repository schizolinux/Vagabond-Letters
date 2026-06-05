import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import sql from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// Fetch current friends
	const friends = await sql`
		SELECT users.id, users.name, users.email
		FROM friends
		INNER JOIN users ON friends.friend_id = users.id
		WHERE friends.user_id = ${locals.user.id}
	`;

	return { friends };
};

export const actions: Actions = {
	addFriend: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const data = await request.formData();
		const email = data.get('email')?.toString();

		if (!email) return fail(400, { error: 'Email is required' });
		if (email === locals.user.email) return fail(400, { error: 'You cannot add yourself.' });

		try {
			const result = await sql`SELECT id FROM users WHERE email = ${email}`;
			const friend = result[0];

			if (!friend) {
				return fail(404, { error: 'No user found with that email address.' });
			}

			// Add friend (both ways for simplicity in this prototype)
			await sql`
				INSERT INTO friends (user_id, friend_id) VALUES (${locals.user.id}, ${friend.id}), (${friend.id}, ${locals.user.id})
				ON CONFLICT DO NOTHING
			`;

			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Internal server error' });
		}
	}
};

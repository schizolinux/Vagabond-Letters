import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// Fetch current friends
	const friends = db.prepare(`
		SELECT users.id, users.name, users.email
		FROM friends
		INNER JOIN users ON friends.friend_id = users.id
		WHERE friends.user_id = ?
	`).all(locals.user.id);

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
			const friend = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: string } | undefined;

			if (!friend) {
				return fail(404, { error: 'No user found with that email address.' });
			}

			// Add friend (both ways for simplicity in this prototype)
			db.prepare(`
				INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)
			`).run(locals.user.id, friend.id, friend.id, locals.user.id);

			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Internal server error' });
		}
	}
};

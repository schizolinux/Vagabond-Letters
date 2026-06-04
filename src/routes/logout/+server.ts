import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

export const POST: RequestHandler = async ({ cookies }) => {
	const sessionId = cookies.get('session');
	if (sessionId) {
		try {
			db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
		} catch (e) {
			console.error("Error deleting session", e);
		}
		cookies.delete('session', { path: '/' });
	}

	throw redirect(303, '/');
};

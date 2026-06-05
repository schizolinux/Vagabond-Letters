import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sql from '$lib/server/db';

export const POST: RequestHandler = async ({ cookies }) => {
	const sessionId = cookies.get('session');
	if (sessionId) {
		try {
			await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
		} catch (e) {
			console.error("Error deleting session", e);
		}
		cookies.delete('session', { path: '/' });
	}

	throw redirect(303, '/');
};

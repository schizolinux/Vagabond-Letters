import type { Handle } from '@sveltejs/kit';
import db from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');

	if (!sessionId) {
		event.locals.user = null;
		return resolve(event);
	}

    try {
        const stmt = db.prepare(`
            SELECT users.id, users.email, users.name, sessions.expires_at
            FROM sessions
            INNER JOIN users ON sessions.user_id = users.id
            WHERE sessions.id = ?
        `);
        const session = stmt.get(sessionId) as { id: string, email: string, name: string, expires_at: number } | undefined;

        if (session && session.expires_at > Date.now()) {
            event.locals.user = {
                id: session.id,
                email: session.email,
                name: session.name
            };
        } else {
            // Invalid or expired session
            event.cookies.delete('session', { path: '/' });
            if (session) {
                db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
            }
            event.locals.user = null;
        }
    } catch (e) {
        event.locals.user = null;
    }

	return resolve(event);
};

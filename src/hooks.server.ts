import type { Handle } from '@sveltejs/kit';
import sql from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');

	if (!sessionId) {
		event.locals.user = null;
		return resolve(event);
	}

    try {
        const result = await sql`
            SELECT users.id, users.email, users.name, sessions.expires_at
            FROM sessions
            INNER JOIN users ON sessions.user_id = users.id
            WHERE sessions.id = ${sessionId}
        `;
        const session = result[0];

        if (session && Number(session.expires_at) > Date.now()) {
            event.locals.user = {
                id: session.id,
                email: session.email,
                name: session.name
            };
        } else {
            // Invalid or expired session
            event.cookies.delete('session', { path: '/' });
            if (session) {
                await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
            }
            event.locals.user = null;
        }
    } catch (e) {
        event.locals.user = null;
    }

	return resolve(event);
};

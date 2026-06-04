import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import db from '$lib/server/db';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'All fields are required.' });
		}

		try {
			const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

			if (!user) {
				return fail(400, { error: 'Invalid email or password.' });
			}

			const passwordMatch = await bcrypt.compare(password, user.password_hash);
			if (!passwordMatch) {
				return fail(400, { error: 'Invalid email or password.' });
			}

			// Create session
			const sessionId = crypto.randomUUID();
			const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days

			db.prepare(`
				INSERT INTO sessions (id, user_id, expires_at)
				VALUES (?, ?, ?)
			`).run(sessionId, user.id, expiresAt);

			cookies.set('session', sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30
			});

		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Internal server error.' });
		}

		throw redirect(303, '/dashboard');
	}
};

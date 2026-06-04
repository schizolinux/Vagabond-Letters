import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import db from '$lib/server/db';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!name || !email || !password) {
			return fail(400, { error: 'All fields are required.' });
		}

		try {
			// Check if user exists
			const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
			if (existingUser) {
				return fail(400, { error: 'An account with that email already exists.' });
			}

			const userId = crypto.randomUUID();
			const passwordHash = await bcrypt.hash(password, 10);

			db.prepare(`
				INSERT INTO users (id, email, password_hash, name)
				VALUES (?, ?, ?, ?)
			`).run(userId, email, passwordHash, name);

			// Create session
			const sessionId = crypto.randomUUID();
			const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days

			db.prepare(`
				INSERT INTO sessions (id, user_id, expires_at)
				VALUES (?, ?, ?)
			`).run(sessionId, userId, expiresAt);

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

import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BASE_URL, SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	const code = url.searchParams.get('code') || null;
	const state = url.searchParams.get('state') || null;

	const storedAuthState = cookies.get('spotify_auth_state') || null;
	const storedChallengeVerifier = cookies.get('spotify_auth_challenge_verifier') || null;

	if (!state || state !== storedAuthState) throw error(400, 'State mismatch!');

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`).toString('base64')}`
		},
		body: new URLSearchParams({
			code: code || '',
			redirect_uri: `${BASE_URL}/api/auth/callback`,
			grant_type: 'authorization_code',
			code_verifier: storedChallengeVerifier || '',
			client_id: SPOTIFY_APP_CLIENT_ID
		})
	});

	const result = await response.json();

	if (result.error) throw error(400, result.error_description);

	cookies.set('refresh_token', result.refresh_token, { path: '/' });
	cookies.set('access_token', result.access_token, { path: '/' });
	cookies.delete('spotify_auth_state', { path: '/' });
	cookies.delete('spotify_auth_challenge_verifier', { path: '/' });

	throw redirect(303, '/');
};

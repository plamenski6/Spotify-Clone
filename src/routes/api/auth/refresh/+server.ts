import type { RequestHandler } from './$types';
import { SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
	const refresh_token = cookies.get('refresh_token');

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`).toString('base64')}`
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refresh_token || ''
		})
	});

	const result = await response.json();

	if (result.error) {
		cookies.delete('refresh_token', { path: '/' });
		cookies.delete('access_token', { path: '/' });
		throw error(401, result.error_description);
	}

	cookies.set('refresh_token', result.refresh_token, { path: '/' });
	cookies.set('access_token', result.access_token, { path: '/' });

	return json(result);
};

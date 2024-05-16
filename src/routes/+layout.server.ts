import { SPOTIFY_BASE } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
	const access_token = cookies.get('access_token');
	const refresh_token = cookies.get('refresh_token');

	if (!access_token) {
		return {
			user: null
		};
	}

	const response = await fetch(`${SPOTIFY_BASE}/me`, {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});

	if (response.ok) {
		const result: SpotifyApi.CurrentUsersProfileResponse = await response.json();
		return {
			user: result
		};
	}
	if (response.status === 401 && refresh_token) {
		// refresh the access token and try again
		const refreshRes = await fetch('/api/auth/refresh');
		if (refreshRes.ok) {
			throw redirect(307, url.pathname);
		}
		return {
			user: null
		};
	} else {
		return {
			user: null
		};
	}
};

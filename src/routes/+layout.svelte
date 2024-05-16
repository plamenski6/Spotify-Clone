<script lang="ts">
	import 'modern-normalize/modern-normalize.css';
	import '../styles/main.scss';
	import { LogoutButton } from '$components';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: user = data.user;
</script>

{#if user}
	<p>Hello, {user.display_name}</p>
	<LogoutButton />
{/if}

<slot />

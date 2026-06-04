<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { enhance } from '$app/forms';

	let { data, children } = $props();
	let user = $derived(data.user);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 text-stone-800">
	<div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
		<a href="/" class="text-xl font-serif tracking-tight text-stone-900 font-bold hover:text-stone-600 transition-colors">Vagabond Letters</a>

		<div class="flex items-center space-x-6">
			{#if user}
				<a href="/dashboard" class="text-sm font-medium hover:text-stone-600 transition-colors">Dashboard</a>
				<a href="/dashboard/friends" class="text-sm font-medium hover:text-stone-600 transition-colors">Friends</a>
				<div class="h-4 w-px bg-stone-300"></div>
				<form action="/logout" method="POST" use:enhance class="inline">
					<button type="submit" class="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">Logout</button>
				</form>
			{:else}
				<a href="/login" class="text-sm font-medium hover:text-stone-600 transition-colors">Login</a>
				<a href="/register" class="text-sm font-medium bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors">Sign Up</a>
			{/if}
		</div>
	</div>
</nav>

<main>
	{@render children()}
</main>

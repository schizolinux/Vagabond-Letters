<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Register - Vagabond Letters</title>
</svelte:head>

<div class="min-h-[calc(100vh-4rem)] bg-[#fdfbf7] flex items-center justify-center p-4">
	<div class="w-full max-w-md bg-white p-8 shadow-sm border border-stone-200 rounded-xl">
		<h1 class="text-3xl font-serif text-stone-800 mb-2 text-center">Join the Guild</h1>
		<p class="text-stone-600 text-center mb-8">Create an account to start sending letters.</p>

		<form method="POST" use:enhance class="space-y-4">
			{#if form?.error}
				<div class="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-sm">
					{form.error}
				</div>
			{/if}

			<div>
				<label for="name" class="block text-sm font-medium text-stone-600 mb-1">Full Name</label>
				<input type="text" id="name" name="name" required
					class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-600 focus:border-stone-600 outline-none transition-all placeholder-stone-400">
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-stone-600 mb-1">Email Address</label>
				<input type="email" id="email" name="email" required
					class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-600 focus:border-stone-600 outline-none transition-all placeholder-stone-400">
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-stone-600 mb-1">Password</label>
				<input type="password" id="password" name="password" required
					class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-600 focus:border-stone-600 outline-none transition-all">
			</div>

			<button type="submit"
				class="w-full py-3 mt-4 bg-stone-800 hover:bg-stone-700 hover:-translate-y-0.5 text-white font-medium rounded-lg shadow-sm transition-all duration-200">
				Sign Up
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-stone-500">
			Already have an account? <a href="/login" class="text-stone-800 font-medium hover:underline">Log in</a>
		</p>
	</div>
</div>

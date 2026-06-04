<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData, form: ActionData } = $props();
	let friends = $derived(data.friends as any[]);
</script>

<svelte:head>
	<title>Friends - Vagabond Letters</title>
</svelte:head>

<div class="min-h-[calc(100vh-4rem)] bg-[#fdfbf7] p-4 md:p-8 font-sans">
	<div class="max-w-2xl mx-auto space-y-12">

		<header class="border-b border-stone-200 pb-4">
			<h1 class="text-3xl font-serif text-stone-900 tracking-tight">Your Friends</h1>
			<p class="text-stone-500 mt-1">Add friends by their email address so you can send them letters.</p>
		</header>

		<!-- Add Friend Form -->
		<div class="bg-white p-6 shadow-sm border border-stone-200 rounded-xl">
			<h2 class="text-lg font-medium text-stone-800 mb-4">Add a new friend</h2>

			<form action="?/addFriend" method="POST" use:enhance class="flex gap-4 items-start">
				<div class="flex-grow space-y-2">
					<input type="email" name="email" required placeholder="friend@example.com"
						class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-600 focus:border-stone-600 outline-none transition-all placeholder-stone-400">
					{#if form?.error}
						<p class="text-sm text-red-600">{form.error}</p>
					{/if}
					{#if form?.success}
						<p class="text-sm text-green-600">Friend added successfully!</p>
					{/if}
				</div>
				<button type="submit" class="py-3 px-6 bg-stone-800 hover:bg-stone-700 hover:-translate-y-0.5 text-white font-medium rounded-lg shadow-sm transition-all duration-200 whitespace-nowrap">
					Add Friend
				</button>
			</form>
		</div>

		<!-- Friends List -->
		<section>
			<h2 class="text-xl font-serif text-stone-800 mb-4">Friends List</h2>

			<div class="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
				{#if friends.length === 0}
					<div class="p-8 text-center text-stone-500">
						You haven't added any friends yet.
					</div>
				{:else}
					<ul class="divide-y divide-stone-200">
						{#each friends as friend}
							<li class="p-4 flex justify-between items-center hover:bg-stone-50 transition-colors">
								<div>
									<p class="font-medium text-stone-800">{friend.name}</p>
									<p class="text-sm text-stone-500">{friend.email}</p>
								</div>
								<a href="/?to={friend.id}" class="text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 py-1.5 px-3 rounded-md transition-colors">
									Send Letter
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</section>

	</div>
</div>

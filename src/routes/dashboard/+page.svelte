<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let sentLetters = $derived(data.sentLetters as any[]);
	let receivedLetters = $derived(data.receivedLetters as any[]);
	let user = $derived(data.user!);

	function getStatus(dispatchTime: number, arrivalTime: number) {
		const now = Date.now();
		if (now >= arrivalTime) return 'Arrived';
		return 'In Transit';
	}
</script>

<svelte:head>
	<title>Dashboard - Vagabond Letters</title>
</svelte:head>

<div class="min-h-[calc(100vh-4rem)] bg-[#fdfbf7] p-4 md:p-8 font-sans">
	<div class="max-w-4xl mx-auto space-y-12">

		<header class="flex justify-between items-end border-b border-stone-200 pb-4">
			<div>
				<h1 class="text-3xl font-serif text-stone-900 tracking-tight">Welcome, {user.name}</h1>
				<p class="text-stone-500 mt-1">Manage your correspondence and friends.</p>
			</div>
			<a href="/" class="py-2 px-5 bg-stone-800 hover:bg-stone-700 hover:-translate-y-0.5 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
				Compose Letter
			</a>
		</header>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">

			<!-- Incoming Letters -->
			<section>
				<h2 class="text-xl font-serif text-stone-800 mb-4 flex items-center space-x-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-500" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" clip-rule="evenodd" />
					</svg>
					<span>Received Letters</span>
				</h2>

				<div class="space-y-4">
					{#if receivedLetters.length === 0}
						<div class="bg-white border border-stone-200 border-dashed rounded-xl p-8 text-center text-stone-500">
							Your inbox is empty. Ask a friend to write you!
						</div>
					{:else}
						{#each receivedLetters as letter}
							{@const status = getStatus(letter.dispatch_time, letter.arrival_time)}
							<div class="bg-white p-5 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
								<div class="flex justify-between items-start mb-2">
									<h3 class="font-medium text-stone-800">From {letter.sender_name}</h3>
									<span class="text-xs font-medium px-2 py-1 rounded-full {status === 'Arrived' ? 'bg-stone-100 text-stone-700' : 'bg-amber-50 text-amber-700'}">
										{status}
									</span>
								</div>
								<p class="text-sm text-stone-500 mb-4">Dispatched from {letter.from_city}</p>

								{#if getStatus(letter.dispatch_time, letter.arrival_time) === 'Arrived'}
									<a href="/letter/{letter.id}" class="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Read Letter &rarr;</a>
								{:else}
									<a href="/track/{letter.id}" class="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Track Journey &rarr;</a>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			</section>

			<!-- Outgoing Letters -->
			<section>
				<h2 class="text-xl font-serif text-stone-800 mb-4 flex items-center space-x-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-500" viewBox="0 0 20 20" fill="currentColor">
						<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
					</svg>
					<span>Sent Letters</span>
				</h2>

				<div class="space-y-4">
					{#if sentLetters.length === 0}
						<div class="bg-white border border-stone-200 border-dashed rounded-xl p-8 text-center text-stone-500">
							You haven't sent any letters yet.
						</div>
					{:else}
						{#each sentLetters as letter}
							{@const status = getStatus(letter.dispatch_time, letter.arrival_time)}
							<div class="bg-white p-5 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
								<div class="flex justify-between items-start mb-2">
									<h3 class="font-medium text-stone-800">To {letter.recipient_name}</h3>
									<span class="text-xs font-medium px-2 py-1 rounded-full {status === 'Arrived' ? 'bg-stone-100 text-stone-700' : 'bg-amber-50 text-amber-700'}">
										{status}
									</span>
								</div>
								<p class="text-sm text-stone-500 mb-4">Destination: {letter.to_city}</p>
								<a href="/track/{letter.id}" class="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Track Journey &rarr;</a>
							</div>
						{/each}
					{/if}
				</div>
			</section>

		</div>
	</div>
</div>

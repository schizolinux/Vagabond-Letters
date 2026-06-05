<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';
  import { page } from '$app/stores';

  let { data, form }: { data: PageData, form: ActionData } = $props();
  let user = $derived(data.user);
  let friends = $derived(data.friends || []);
  let prefillFriendId = $derived($page.url.searchParams.get('to'));
</script>

<svelte:head>
  <title>Send a Vagabond Letter</title>
</svelte:head>

<div class="min-h-screen bg-[#fdfbf7] text-[#1a202c] font-sans selection:bg-[#e2e8f0]">
  <div class="max-w-2xl mx-auto px-4 py-16">
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-serif text-stone-800 mb-4 tracking-tight">Vagabond Letters</h1>
      <p class="text-lg text-stone-600 max-w-lg mx-auto">Embrace the anticipation. Send a digital letter that wanders across the world in real time.</p>
    </header>

    <div class="bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-[#f1f5f9] rounded-xl transition-all duration-300 hover:-translate-y-1">
      {#if !user}
        <div class="text-center py-8">
          <h2 class="text-2xl font-serif text-stone-800 mb-4">Join to start sending</h2>
          <p class="text-stone-600 mb-8">You need an account to send letters to your friends.</p>
          <div class="flex justify-center space-x-4">
            <a href="/login" class="px-6 py-3 bg-stone-100 text-stone-800 font-medium rounded-lg hover:bg-stone-200 transition-colors">Log In</a>
            <a href="/register" class="px-6 py-3 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-700 transition-colors">Sign Up</a>
          </div>
        </div>
      {:else if friends.length === 0}
        <div class="text-center py-8">
          <h2 class="text-2xl font-serif text-stone-800 mb-4">You have no friends yet!</h2>
          <p class="text-stone-600 mb-8">Add a friend to your address book before sending a letter.</p>
          <a href="/dashboard/friends" class="px-6 py-3 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-700 transition-colors">Find Friends</a>
        </div>
      {:else}
      <form method="POST" use:enhance class="space-y-6">
        
        {#if form?.error}
          <div class="bg-red-50 text-red-700 p-4 rounded-md border border-red-100 text-sm">
            {form.error}
          </div>
        {/if}

        <div class="space-y-1">
          <label for="recipient_id" class="block text-sm font-medium text-stone-600">To (Friend)</label>
          <select id="recipient_id" name="recipient_id" required
            class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-600 focus:border-stone-600 outline-none transition-all text-stone-800">
            <option value="" disabled selected={!prefillFriendId}>Select a friend...</option>
            {#each friends as friend}
              <option value={friend.id} selected={friend.id === prefillFriendId}>{friend.name} ({friend.email})</option>
            {/each}
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <label for="from_city" class="block text-sm font-medium text-stone-600">Origin City</label>
            <input type="text" id="from_city" name="from_city" required
              class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-600 focus:border-stone-600 outline-none transition-all placeholder-stone-400"
              placeholder="e.g. London, UK">
          </div>
          
          <div class="space-y-1">
            <label for="to_city" class="block text-sm font-medium text-stone-600">Destination City</label>
            <input type="text" id="to_city" name="to_city" required
              class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-600 focus:border-stone-600 outline-none transition-all placeholder-stone-400"
              placeholder="e.g. Paris, France">
          </div>
        </div>

        <div class="space-y-1">
          <label for="message" class="block text-sm font-medium text-stone-600">Your Letter</label>
          <textarea id="message" name="message" rows="8" required
            class="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-600 focus:border-stone-600 outline-none transition-all resize-none font-serif text-lg leading-relaxed placeholder-stone-400"
            placeholder="Dearest friend..."></textarea>
        </div>

        <button type="submit"
          class="w-full py-4 px-6 bg-stone-800 hover:bg-stone-700 hover:-translate-y-0.5 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2">
          <span>Dispatch Letter</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
      {/if}
    </div>
  </div>
</div>

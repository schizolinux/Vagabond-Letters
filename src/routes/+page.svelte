<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Send a Vagabond Letter</title>
</svelte:head>

<div class="min-h-screen bg-[#fdfbf7] text-[#1a202c] font-sans selection:bg-[#e2e8f0]">
  <div class="max-w-2xl mx-auto px-4 py-16">
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-serif text-[#1e3a8a] mb-4 tracking-tight">Vagabond Letters</h1>
      <p class="text-lg text-[#475569] max-w-lg mx-auto">Embrace the anticipation. Send a digital letter that wanders across the world in real time.</p>
    </header>

    <div class="bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f1f5f9] rounded-xl">
      <form method="POST" use:enhance class="space-y-6">
        
        {#if form?.error}
          <div class="bg-red-50 text-red-700 p-4 rounded-md border border-red-100 text-sm">
            {form.error}
          </div>
        {/if}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <label for="sender" class="block text-sm font-medium text-[#64748b]">From (Your Name)</label>
            <input type="text" id="sender" name="sender" required
              class="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all placeholder-[#94a3b8]"
              placeholder="e.g. Jane Austen">
          </div>
          
          <div class="space-y-1">
            <label for="recipient" class="block text-sm font-medium text-[#64748b]">To (Recipient Name)</label>
            <input type="text" id="recipient" name="recipient" required
              class="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all placeholder-[#94a3b8]"
              placeholder="e.g. Mr. Darcy">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <label for="from_city" class="block text-sm font-medium text-[#64748b]">Origin City</label>
            <input type="text" id="from_city" name="from_city" required
              class="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all placeholder-[#94a3b8]"
              placeholder="e.g. London, UK">
          </div>
          
          <div class="space-y-1">
            <label for="to_city" class="block text-sm font-medium text-[#64748b]">Destination City</label>
            <input type="text" id="to_city" name="to_city" required
              class="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all placeholder-[#94a3b8]"
              placeholder="e.g. Paris, France">
          </div>
        </div>

        <div class="space-y-1">
          <label for="message" class="block text-sm font-medium text-[#64748b]">Your Letter</label>
          <textarea id="message" name="message" rows="8" required
            class="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none transition-all resize-none font-serif text-lg leading-relaxed placeholder-[#94a3b8]"
            placeholder="Dearest friend..."></textarea>
        </div>

        <button type="submit"
          class="w-full py-4 px-6 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center space-x-2">
          <span>Dispatch Letter</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</div>

<script lang="ts">
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
  let letter = $derived(data.letter);

  // Format date nicely
  let arrivalDate = $derived(new Date(letter.arrival_time).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
</script>

<svelte:head>
  <title>A Letter for {letter.recipient}</title>
</svelte:head>

<div class="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-[#e2e8f0]">
  <div class="w-full max-w-2xl bg-[#fdfaeb] p-10 md:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-stone-200 relative animate-fade-in-up">
    
    <!-- Paper texture hints -->
    <div class="absolute inset-0 opacity-[0.01] pointer-events-none mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <div class="flex justify-between items-start mb-16 pb-6 border-b border-[#e2e8f0] relative z-10">
      <div class="text-[#64748b] space-y-1">
        <p class="text-sm uppercase tracking-widest font-bold">From</p>
        <p class="font-medium text-[#334155]">{letter.sender}</p>
        <p class="text-sm">{letter.from_city}</p>
      </div>
      <div class="text-right text-[#64748b] space-y-1">
        <p class="text-sm uppercase tracking-widest font-bold">Arrived</p>
        <p class="font-medium text-[#334155]">{arrivalDate}</p>
        <p class="text-sm">{letter.to_city}</p>
      </div>
    </div>

    <div class="prose prose-lg prose-slate max-w-none font-serif text-stone-900 leading-loose relative z-10">
      <p class="text-xl mb-8">Dear {letter.recipient},</p>
      
      <!-- Preserve line breaks from textarea -->
      <div class="whitespace-pre-wrap mb-12">
        {letter.message}
      </div>

      <p class="text-xl">Yours truly,</p>
      <p class="text-2xl font-medium mt-2">{letter.sender}</p>
    </div>
    
    <div class="mt-20 pt-8 border-t border-stone-200 text-center relative z-10">
      <a href="/" class="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
        Send another letter
      </a>
    </div>

  </div>
</div>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
  let letter = $derived(data.letter);

  let progressPercentage = $state(0);
  let statusText = $state('');
  let isArrived = $state(false);
  let animationFrame: number;

  function updateProgressBar() {
    const now = new Date().getTime();
    const totalJourneyTime = letter.arrival_time - letter.dispatch_time;
    const timeElapsed = now - letter.dispatch_time;

    progressPercentage = (timeElapsed / totalJourneyTime) * 100;
    
    if (progressPercentage >= 100) {
      progressPercentage = 100;
      isArrived = true;
      statusText = "Your letter has arrived!";
    } else if (progressPercentage <= 0) {
      progressPercentage = 0;
      statusText = "Preparing for dispatch...";
    } else {
      const daysLeft = Math.ceil((letter.arrival_time - now) / (1000 * 60 * 60 * 24));
      if (daysLeft > 1) {
          statusText = `${daysLeft} days remaining on its journey...`;
      } else {
          const hoursLeft = Math.ceil((letter.arrival_time - now) / (1000 * 60 * 60));
          if (hoursLeft > 1) {
              statusText = `${hoursLeft} hours remaining on its journey...`;
          } else {
              const minsLeft = Math.ceil((letter.arrival_time - now) / (1000 * 60));
              statusText = `${minsLeft} minutes remaining on its journey...`;
          }
      }
    }

    if (!isArrived) {
      animationFrame = requestAnimationFrame(updateProgressBar);
    }
  }

  onMount(() => {
    updateProgressBar();
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  });
</script>

<svelte:head>
  <title>Tracking Letter - {letter.from_city} to {letter.to_city}</title>
</svelte:head>

<div class="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-4 font-sans text-[#1a202c]">
  <div class="w-full max-w-3xl bg-white p-8 md:p-12 shadow-sm border border-[#e2e8f0] rounded-xl text-center relative overflow-hidden">
    
    <!-- Decorative top accent -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-stone-800"></div>

    <h1 class="text-3xl md:text-4xl font-serif text-stone-800 mb-2 tracking-tight">Tracking Letter</h1>
    <p class="text-stone-600 mb-12 text-lg">A message from <strong class="text-stone-800 font-medium">{letter.sender}</strong> to <strong class="text-stone-800 font-medium">{letter.recipient}</strong></p>

    <div class="flex justify-between items-end mb-4 px-2">
      <div class="text-left">
        <span class="block text-xs uppercase tracking-wider text-[#94a3b8] font-bold mb-1">Origin</span>
        <span class="block text-lg text-[#1e293b] font-medium">{letter.from_city}</span>
      </div>
      
      <!-- Envelope Icon positioned based on progress -->
      <div class="flex-grow relative h-8 mx-4">
        <div 
          class="absolute bottom-0 -ml-3 transition-all duration-300 ease-out" 
          style="left: {progressPercentage}%;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div class="text-right">
        <span class="block text-xs uppercase tracking-wider text-[#94a3b8] font-bold mb-1">Destination</span>
        <span class="block text-lg text-[#1e293b] font-medium">{letter.to_city}</span>
      </div>
    </div>

    <!-- The Beautiful Progress Bar -->
    <div class="w-full bg-stone-100 rounded-full h-3 mb-8 overflow-hidden border border-stone-200 relative">
      <div 
        class="bg-stone-800 h-3 rounded-full transition-all duration-300 ease-out"
        style="width: {progressPercentage}%"
      ></div>
    </div>

    <div class="text-xl font-serif italic text-[#475569] h-8 transition-opacity duration-500">
      {statusText}
    </div>

    {#if isArrived}
      <div class="mt-12 animate-fade-in-up">
        <a href={`/letter/${letter.id}`} class="inline-block py-3 px-8 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200">
          Open Letter
        </a>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
</style>

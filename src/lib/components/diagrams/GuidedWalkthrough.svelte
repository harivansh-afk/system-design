<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import { fly, fade } from 'svelte/transition';

  interface WalkthroughStep {
    id: string;
    title: string;
    description: string;
    icon?: string;
    highlight?: string; // CSS selector or id to highlight
    details?: string;
    tip?: string;
  }

  interface Props {
    title: string;
    subtitle?: string;
    steps: WalkthroughStep[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
  }

  let { 
    title, 
    subtitle = '', 
    steps, 
    autoPlay = false,
    autoPlayInterval = 3000 
  }: Props = $props();

  let currentStep = $state(0);
  let isPlaying = $state(autoPlay);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function getIcon(iconName?: string) {
    if (!iconName) return Icons.Circle;
    return (Icons as Record<string, typeof Icons.Box>)[iconName] || Icons.Circle;
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      currentStep = 0;
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
    }
  }

  function goToStep(index: number) {
    currentStep = index;
  }

  function togglePlay() {
    isPlaying = !isPlaying;
  }

  $effect(() => {
    if (isPlaying) {
      intervalId = setInterval(nextStep, autoPlayInterval);
    } else if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  });

  const step = $derived(steps[currentStep]);
  const StepIcon = $derived(getIcon(step?.icon));
  const progress = $derived(((currentStep + 1) / steps.length) * 100);
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-start justify-between">
    <div>
      <h2 class="section-title">{title}</h2>
      {#if subtitle}
        <p class="section-subtitle">{subtitle}</p>
      {/if}
    </div>
    <div class="flex items-center gap-2">
      <button
        onclick={togglePlay}
        class="btn-secondary flex items-center gap-2"
      >
        {#if isPlaying}
          <Icons.Pause class="w-4 h-4" />
          Pause
        {:else}
          <Icons.Play class="w-4 h-4" />
          Auto Play
        {/if}
      </button>
    </div>
  </div>

  <!-- Progress Bar -->
  <div class="relative">
    <div class="h-1 bg-surface-800 rounded-full overflow-hidden">
      <div 
        class="h-full bg-surface-100 transition-all duration-300"
        style="width: {progress}%"
      ></div>
    </div>
    <div class="flex justify-between mt-2">
      <span class="text-xs text-surface-500">Step {currentStep + 1} of {steps.length}</span>
      <span class="text-xs text-surface-500">{Math.round(progress)}% complete</span>
    </div>
  </div>

  <!-- Step Indicators -->
  <div class="flex justify-center gap-2 flex-wrap">
    {#each steps as s, i}
      {@const Icon = getIcon(s.icon)}
      <button
        onclick={() => goToStep(i)}
        class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors duration-200"
        class:bg-surface-100={i === currentStep}
        class:border-surface-200={i === currentStep}
        class:text-surface-950={i === currentStep}
        class:bg-surface-900={i !== currentStep && i <= currentStep}
        class:border-surface-800={i !== currentStep && i <= currentStep}
        class:text-surface-200={i !== currentStep && i <= currentStep}
        class:bg-surface-950={i > currentStep}
        class:border-surface-900={i > currentStep}
        class:text-surface-600={i > currentStep}
      >
        <Icon class="w-4 h-4" />
        <span class="text-sm font-medium hidden md:inline">{i + 1}</span>
      </button>
    {/each}
  </div>

  <!-- Current Step Content -->
  {#key currentStep}
    <div 
      class="card"
      in:fly={{ x: 50, duration: 300 }}
      out:fade={{ duration: 150 }}
    >
      <div class="flex items-start gap-6">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <div class="w-16 h-16 rounded-xl bg-surface-900 border border-surface-800 flex items-center justify-center">
            <StepIcon class="w-8 h-8 text-surface-200" />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 space-y-4">
          <div>
            <span class="tag tag-concept mb-2">Step {currentStep + 1}</span>
            <h3 class="text-xl font-semibold text-surface-100 mt-2">{step.title}</h3>
          </div>

          <p class="text-surface-300">{step.description}</p>

          {#if step.details}
            <div class="bg-surface-800 rounded-lg p-4 border border-surface-700">
              <div class="flex items-center gap-2 mb-2">
                <Icons.Info class="w-4 h-4 text-surface-300" />
                <span class="text-sm font-medium text-surface-300">Technical Details</span>
              </div>
              <p class="text-sm text-surface-400">{step.details}</p>
            </div>
          {/if}

          {#if step.tip}
            <div class="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
              <div class="flex items-center gap-2 mb-2">
                <Icons.Lightbulb class="w-4 h-4 text-yellow-400" />
                <span class="text-sm font-medium text-yellow-400">Pro Tip</span>
              </div>
              <p class="text-sm text-surface-300">{step.tip}</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/key}

  <!-- Navigation -->
  <div class="flex justify-between items-center">
    <button
      onclick={prevStep}
      disabled={currentStep === 0}
      class="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Icons.ArrowLeft class="w-4 h-4" />
      Previous
    </button>

    <div class="flex gap-1">
      {#each steps as _, i}
        <button
          onclick={() => goToStep(i)}
          class="w-2 h-2 rounded-full transition-all duration-200"
          class:bg-surface-100={i === currentStep}
          class:w-4={i === currentStep}
          class:bg-surface-700={i !== currentStep}
        ></button>
      {/each}
    </div>

    <button
      onclick={nextStep}
      class="btn-primary flex items-center gap-2"
    >
      {#if currentStep === steps.length - 1}
        Start Over
        <Icons.RotateCcw class="w-4 h-4" />
      {:else}
        Next
        <Icons.ArrowRight class="w-4 h-4" />
      {/if}
    </button>
  </div>
</div>

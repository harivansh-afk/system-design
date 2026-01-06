<script lang="ts">
  import * as Icons from 'lucide-svelte';

  interface Props {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    type?: 'aws' | 'gcp' | 'concept' | 'default';
    selected?: boolean;
    onclick?: () => void;
  }

  let { 
    id, 
    label, 
    description = '', 
    icon = 'Box', 
    type = 'default',
    selected = false,
    onclick
  }: Props = $props();

  function getIcon(iconName: string) {
    return (Icons as Record<string, typeof Icons.Box>)[iconName] || Icons.Box;
  }

  const Icon = $derived(getIcon(icon));

  const borderColor = $derived({
    aws: 'border-aws-orange',
    gcp: 'border-gcp-blue',
    concept: 'border-purple-500',
    default: 'border-surface-600'
  }[type]);

  const bgColor = $derived({
    aws: 'bg-aws-orange/10',
    gcp: 'bg-gcp-blue/10',
    concept: 'bg-purple-500/10',
    default: 'bg-surface-800'
  }[type]);

  const iconColor = $derived({
    aws: 'text-aws-orange',
    gcp: 'text-gcp-blue',
    concept: 'text-purple-400',
    default: 'text-surface-300'
  }[type]);
</script>

<button
  {onclick}
  class="relative group cursor-pointer transition-all duration-200 transform hover:scale-105"
  class:ring-2={selected}
  class:ring-blue-500={selected}
  class:ring-offset-2={selected}
  class:ring-offset-surface-950={selected}
>
  <div 
    class="flex flex-col items-center p-4 rounded-xl border-2 min-w-[120px] {borderColor} {bgColor}"
  >
    <!-- Icon -->
    <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-2 {iconColor}">
      <Icon class="w-8 h-8" />
    </div>

    <!-- Label -->
    <span class="text-sm font-medium text-surface-100 text-center">{label}</span>

    <!-- Description (on hover) -->
    {#if description}
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-800 rounded-lg text-xs text-surface-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-surface-700 shadow-lg">
        {description}
        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-surface-800 border-r border-b border-surface-700 transform rotate-45"></div>
      </div>
    {/if}
  </div>

  <!-- Type badge -->
  {#if type !== 'default'}
    <span class="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-medium rounded-full uppercase
      {type === 'aws' ? 'bg-aws-orange text-white' : ''}
      {type === 'gcp' ? 'bg-gcp-blue text-white' : ''}
      {type === 'concept' ? 'bg-purple-500 text-white' : ''}
    ">
      {type}
    </span>
  {/if}
</button>

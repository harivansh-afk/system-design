<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  interface ComparisonItem {
    feature: string;
    description?: string;
    values: Record<string, string | boolean>;
  }

  interface Option {
    id: string;
    name: string;
    color: string;
    icon: string;
    whenToUse: string[];
    whenNotToUse: string[];
    realWorldExample?: string;
  }

  interface Props {
    title: string;
    subtitle?: string;
    options: Option[];
    features: ComparisonItem[];
  }

  let { title, subtitle = '', options, features }: Props = $props();
  let selectedOption = $state<string | null>(null);

  function getIcon(iconName: string) {
    return (Icons as Record<string, typeof Icons.Box>)[iconName] || Icons.Box;
  }

  function getCellContent(value: string | boolean) {
    if (typeof value === 'boolean') {
      return value 
        ? { type: 'check', class: 'text-green-400' }
        : { type: 'x', class: 'text-red-400' };
    }
    return { type: 'text', value, class: 'text-surface-300' };
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h2 class="section-title">{title}</h2>
    {#if subtitle}
      <p class="section-subtitle">{subtitle}</p>
    {/if}
  </div>

  <!-- Comparison Table -->
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="text-left p-4 bg-surface-900 border-b border-surface-700 text-surface-400 font-medium">
            Feature
          </th>
          {#each options as option}
            {@const Icon = getIcon(option.icon)}
            <th 
              class="p-4 bg-surface-900 border-b border-surface-700 text-center cursor-pointer hover:bg-surface-800 transition-colors"
              onclick={() => selectedOption = selectedOption === option.id ? null : option.id}
            >
              <div class="flex flex-col items-center gap-2">
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  style="background-color: {option.color}20; color: {option.color}"
                >
                  <Icon class="w-6 h-6" />
                </div>
                <span class="font-medium text-surface-100">{option.name}</span>
              </div>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each features as feature, i}
          <tr class="border-b border-surface-800 hover:bg-surface-900/50">
            <td class="p-4">
              <div class="font-medium text-surface-200">{feature.feature}</div>
              {#if feature.description}
                <div class="text-sm text-surface-500 mt-1">{feature.description}</div>
              {/if}
            </td>
            {#each options as option}
              {@const cell = getCellContent(feature.values[option.id])}
              <td class="p-4 text-center {cell.class}">
                {#if cell.type === 'check'}
                  <Icons.Check class="w-5 h-5 mx-auto" />
                {:else if cell.type === 'x'}
                  <Icons.X class="w-5 h-5 mx-auto" />
                {:else}
                  <span class="text-sm">{cell.value}</span>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- When to Use / When Not to Use Panels -->
  {#if selectedOption}
    {@const selected = options.find(o => o.id === selectedOption)}
    {#if selected}
      <div transition:slide={{ duration: 200 }} class="grid md:grid-cols-2 gap-4">
        <!-- When to Use -->
        <div class="card border-green-500/30">
          <div class="flex items-center gap-2 mb-4">
            <Icons.CheckCircle class="w-5 h-5 text-green-400" />
            <h3 class="font-semibold text-green-400">When to Use {selected.name}</h3>
          </div>
          <ul class="space-y-2">
            {#each selected.whenToUse as reason}
              <li class="flex items-start gap-2 text-sm text-surface-300">
                <Icons.Check class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </li>
            {/each}
          </ul>
        </div>

        <!-- When NOT to Use -->
        <div class="card border-red-500/30">
          <div class="flex items-center gap-2 mb-4">
            <Icons.XCircle class="w-5 h-5 text-red-400" />
            <h3 class="font-semibold text-red-400">When NOT to Use {selected.name}</h3>
          </div>
          <ul class="space-y-2">
            {#each selected.whenNotToUse as reason}
              <li class="flex items-start gap-2 text-sm text-surface-300">
                <Icons.X class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Real World Example -->
        {#if selected.realWorldExample}
          <div class="card md:col-span-2 border-blue-500/30">
            <div class="flex items-center gap-2 mb-3">
              <Icons.Lightbulb class="w-5 h-5 text-blue-400" />
              <h3 class="font-semibold text-blue-400">Real World Example</h3>
            </div>
            <p class="text-sm text-surface-300">{selected.realWorldExample}</p>
          </div>
        {/if}
      </div>
    {/if}
  {:else}
    <div class="text-center py-6 text-surface-500">
      <Icons.MousePointerClick class="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p class="text-sm">Click on a column header to see when to use each option</p>
    </div>
  {/if}
</div>

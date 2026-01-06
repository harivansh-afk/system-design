<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import { navigationItems, type NavItem } from '$lib/stores/navigation';

  type IconComponent = typeof Icons.Box;
  function getIcon(iconName: string): IconComponent {
    const iconMap = Icons as unknown as Record<string, IconComponent>;
    return iconMap[iconName] || Icons.Box;
  }

  const section = navigationItems.find((i) => i.id === 'messaging') as NavItem | undefined;
</script>

<svelte:head>
  <title>Messaging - System Design Explorer</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/" class="hover:text-surface-300">Overview</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Messaging</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Messaging</h1>
    <p class="text-surface-400 mt-2">
      Decouple services with asynchronous communication: queues, pub/sub, and event-driven patterns.
    </p>
  </div>

  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each section?.children ?? [] as child}
      {@const Icon = getIcon(child.icon)}
      <a href={child.href} class="card-hover group">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center flex-shrink-0 group-hover:border-surface-600 transition-colors duration-200">
            <Icon class="w-6 h-6 text-surface-200" />
          </div>
          <div>
            <h3 class="font-semibold text-surface-100 group-hover:text-white transition-colors">
              {child.label}
            </h3>
            <p class="text-sm text-surface-400 mt-1">Concepts + trade-offs</p>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-surface-400 group-hover:text-surface-200">
          <span>Open</span>
          <Icons.ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </a>
    {/each}
  </div>
</div>


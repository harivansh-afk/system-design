<script lang="ts">
  import { page } from '$app/stores';
  import { navigationItems, sidebarOpen, expandedSections, type NavItem } from '$lib/stores/navigation';
  import * as Icons from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  type IconComponent = typeof Icons.Box;

  function getIcon(iconName: string): IconComponent {
    const iconMap = Icons as unknown as Record<string, IconComponent>;
    return iconMap[iconName] || (Icons.Circle as IconComponent);
  }

  function toggleSection(id: string) {
    expandedSections.update(set => {
      const newSet = new Set(set);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  function isActive(href: string): boolean {
    return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
  }
</script>

<aside 
  class="fixed left-0 top-0 h-screen bg-surface-900 border-r border-surface-800 flex flex-col z-40 transition-all duration-300"
  class:w-64={$sidebarOpen}
  class:w-16={!$sidebarOpen}
>
  <!-- Logo -->
  <div class="h-16 flex items-center px-4 border-b border-surface-800">
    {#if $sidebarOpen}
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center">
          <Icons.Layers class="w-5 h-5 text-surface-200" />
        </div>
        <span class="font-bold text-lg text-surface-100">System Design</span>
      </div>
    {:else}
      <div class="w-8 h-8 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center mx-auto">
        <Icons.Layers class="w-5 h-5 text-surface-200" />
      </div>
    {/if}
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto py-4 px-2">
    {#each navigationItems as item}
      {@const Icon = getIcon(item.icon)}
      {@const hasChildren = item.children && item.children.length > 0}
      {@const isExpanded = $expandedSections.has(item.id)}
      {@const active = isActive(item.href)}

      <div class="mb-1">
        {#if hasChildren}
          <button
            onclick={() => toggleSection(item.id)}
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150"
            class:bg-surface-800={active}
            class:text-surface-100={active}
            class:text-surface-400={!active}
            class:hover:bg-surface-800={!active}
            class:hover:text-surface-200={!active}
          >
            <Icon class="w-5 h-5 flex-shrink-0" />
            {#if $sidebarOpen}
              <span class="flex-1 text-sm font-medium">{item.label}</span>
              <Icons.ChevronDown
                class="w-4 h-4 transition-transform duration-200 {isExpanded ? 'rotate-180' : ''}"
              />
            {/if}
          </button>
        {:else}
          <a
            href={item.href}
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent transition-colors duration-150"
            class:bg-surface-800={active}
            class:border-surface-700={active}
            class:text-surface-100={active}
            class:text-surface-400={!active}
            class:hover:bg-surface-800={!active}
            class:hover:text-surface-200={!active}
          >
            <Icon class="w-5 h-5 flex-shrink-0" />
            {#if $sidebarOpen}
              <span class="text-sm font-medium">{item.label}</span>
            {/if}
          </a>
        {/if}

        {#if hasChildren && isExpanded && $sidebarOpen}
          <div transition:slide={{ duration: 200 }} class="ml-4 mt-1 space-y-1">
            {#each item.children as child}
              {@const ChildIcon = getIcon(child.icon)}
              {@const childActive = isActive(child.href)}
              <a
                href={child.href}
                class="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-transparent text-sm transition-colors duration-150 {childActive ? 'bg-surface-800 text-surface-200 border-surface-700' : 'text-surface-500 hover:bg-surface-800 hover:text-surface-300'}"
              >
                <ChildIcon class="w-4 h-4 flex-shrink-0" />
                <span>{child.label}</span>
              </a>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </nav>

  <!-- Toggle Button -->
  <div class="p-4 border-t border-surface-800">
    <button
      onclick={() => sidebarOpen.update(v => !v)}
      class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-surface-200 transition-colors"
    >
      {#if $sidebarOpen}
        <Icons.PanelLeftClose class="w-5 h-5" />
        <span class="text-sm">Collapse</span>
      {:else}
        <Icons.PanelLeftOpen class="w-5 h-5" />
      {/if}
    </button>
  </div>
</aside>

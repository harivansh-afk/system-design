<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import { fly, fade } from 'svelte/transition';

  interface DecisionNode {
    id: string;
    type: 'question' | 'answer';
    text: string;
    description?: string;
    icon?: string;
    yes?: string; // id of next node if yes
    no?: string;  // id of next node if no
    recommendation?: string;
    reasoning?: string;
    alternatives?: string[];
  }

  interface Props {
    title: string;
    subtitle?: string;
    nodes: DecisionNode[];
    startNode: string;
  }

  let { title, subtitle = '', nodes, startNode }: Props = $props();

  let path = $state<string[]>([startNode]);
  let answers = $state<Record<string, boolean>>({});

  function getNode(id: string): DecisionNode | undefined {
    return nodes.find(n => n.id === id);
  }

  function getIcon(iconName?: string) {
    if (!iconName) return Icons.HelpCircle;
    return (Icons as Record<string, typeof Icons.Box>)[iconName] || Icons.HelpCircle;
  }

  function answer(nodeId: string, isYes: boolean) {
    const node = getNode(nodeId);
    if (!node) return;

    answers[nodeId] = isYes;
    const nextId = isYes ? node.yes : node.no;
    if (nextId) {
      path = [...path, nextId];
    }
  }

  function goBack() {
    if (path.length > 1) {
      const lastNodeId = path[path.length - 1];
      delete answers[path[path.length - 2]];
      path = path.slice(0, -1);
    }
  }

  function reset() {
    path = [startNode];
    answers = {};
  }

  const currentNode = $derived(getNode(path[path.length - 1]));
  const isAtEnd = $derived(currentNode?.type === 'answer');
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h2 class="section-title">{title}</h2>
    {#if subtitle}
      <p class="section-subtitle">{subtitle}</p>
    {/if}
  </div>

  <!-- Progress Trail -->
  <div class="flex items-center gap-2 flex-wrap">
    {#each path as nodeId, i}
      {@const node = getNode(nodeId)}
      {@const isLast = i === path.length - 1}
      {#if node}
        <div class="flex items-center gap-2">
          {#if i > 0}
            <Icons.ChevronRight class="w-4 h-4 text-surface-600" />
          {/if}
          <span 
            class="px-3 py-1 rounded-full text-sm transition-colors"
            class:bg-surface-100={isLast}
            class:text-surface-950={isLast}
            class:bg-surface-800={!isLast}
            class:text-surface-400={!isLast}
          >
            {#if node.type === 'question'}
              {answers[nodeId] !== undefined ? (answers[nodeId] ? 'Yes' : 'No') : '?'}
            {:else}
              {node.text.substring(0, 20)}...
            {/if}
          </span>
        </div>
      {/if}
    {/each}
  </div>

  <!-- Current Decision -->
  {#if currentNode}
    <div 
      class="card max-w-2xl mx-auto"
      in:fly={{ y: 20, duration: 300 }}
    >
      {#if currentNode.type === 'question'}
        <!-- Question Node -->
        <div class="text-center space-y-6">
          <div class="w-16 h-16 mx-auto rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center">
            <Icons.HelpCircle class="w-8 h-8 text-surface-300" />
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-surface-100 mb-2">{currentNode.text}</h3>
            {#if currentNode.description}
              <p class="text-surface-400">{currentNode.description}</p>
            {/if}
          </div>

          <div class="flex justify-center gap-4">
            <button
              onclick={() => answer(currentNode.id, true)}
              class="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors"
            >
              <Icons.Check class="w-5 h-5" />
              Yes
            </button>
            <button
              onclick={() => answer(currentNode.id, false)}
              class="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
            >
              <Icons.X class="w-5 h-5" />
              No
            </button>
          </div>
        </div>

      {:else}
        <!-- Answer Node -->
        {@const Icon = getIcon(currentNode.icon)}
        <div class="text-center space-y-6">
          <div class="w-20 h-20 mx-auto rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center">
            <Icon class="w-10 h-10 text-surface-200" />
          </div>
          
          <div>
            <span class="tag tag-concept mb-2">Recommendation</span>
            <h3 class="text-2xl font-bold text-surface-100 mt-2">{currentNode.text}</h3>
          </div>

          {#if currentNode.reasoning}
            <div class="text-left bg-surface-800 rounded-lg p-4 border border-surface-700">
              <div class="flex items-center gap-2 mb-2">
                <Icons.Lightbulb class="w-5 h-5 text-yellow-400" />
                <span class="font-medium text-yellow-400">Why this choice?</span>
              </div>
              <p class="text-surface-300 text-sm">{currentNode.reasoning}</p>
            </div>
          {/if}

          {#if currentNode.alternatives && currentNode.alternatives.length > 0}
            <div class="text-left bg-surface-800 rounded-lg p-4 border border-surface-700">
              <div class="flex items-center gap-2 mb-2">
                <Icons.GitBranch class="w-5 h-5 text-surface-300" />
                <span class="font-medium text-surface-300">Alternatives to consider</span>
              </div>
              <ul class="space-y-1">
                {#each currentNode.alternatives as alt}
                  <li class="text-surface-400 text-sm flex items-start gap-2">
                    <Icons.ChevronRight class="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{alt}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Controls -->
  <div class="flex justify-center gap-4">
    {#if path.length > 1}
      <button
        onclick={goBack}
        class="btn-secondary flex items-center gap-2"
      >
        <Icons.ArrowLeft class="w-4 h-4" />
        Go Back
      </button>
    {/if}
    {#if isAtEnd}
      <button
        onclick={reset}
        class="btn-primary flex items-center gap-2"
      >
        <Icons.RotateCcw class="w-4 h-4" />
        Start Over
      </button>
    {/if}
  </div>
</div>

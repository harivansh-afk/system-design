<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  type CapChoice = 'C' | 'A' | 'P' | 'CA' | 'CP' | 'AP' | null;
  
  let selectedChoice = $state<CapChoice>(null);
  let hoveredVertex = $state<'C' | 'A' | 'P' | null>(null);

  const vertices = {
    C: { 
      x: 200, 
      y: 50, 
      label: 'Consistency',
      short: 'C',
      description: 'Every read receives the most recent write or an error',
      detail: 'All nodes see the same data at the same time. When you write data, all subsequent reads return that data.',
      color: '#3B82F6' // blue
    },
    A: { 
      x: 50, 
      y: 300, 
      label: 'Availability',
      short: 'A',
      description: 'Every request receives a response (success or failure)',
      detail: 'The system remains operational and responsive, even if some nodes fail. Every request gets a response.',
      color: '#22C55E' // green
    },
    P: { 
      x: 350, 
      y: 300, 
      label: 'Partition Tolerance',
      short: 'P',
      description: 'System continues to operate despite network partitions',
      detail: 'The system continues to function even when network communication between nodes fails.',
      color: '#EAB308' // yellow
    }
  };

  const combinations = {
    CA: {
      name: 'CA (Consistency + Availability)',
      description: 'NOT possible in distributed systems',
      explanation: 'In a distributed system, network partitions are inevitable. When a partition occurs, you must choose between C and A.',
      examples: ['Single-node databases (PostgreSQL, MySQL on one server)', 'Not achievable in distributed systems'],
      color: '#94A3B8',
      viable: false
    },
    CP: {
      name: 'CP (Consistency + Partition Tolerance)',
      description: 'Sacrifice availability for consistency',
      explanation: 'During a partition, the system refuses to respond rather than return potentially stale data. Prioritizes data accuracy.',
      examples: ['MongoDB (default)', 'HBase', 'Redis Cluster', 'Zookeeper', 'etcd'],
      useCase: 'Financial systems, inventory management, booking systems - where incorrect data causes real problems',
      color: '#8B5CF6',
      viable: true
    },
    AP: {
      name: 'AP (Availability + Partition Tolerance)',
      description: 'Sacrifice consistency for availability',
      explanation: 'During a partition, the system continues to respond but may return stale data. Prioritizes uptime.',
      examples: ['Cassandra', 'DynamoDB', 'CouchDB', 'Riak'],
      useCase: 'Social media feeds, shopping carts, DNS - where temporary inconsistency is acceptable',
      color: '#EC4899',
      viable: true
    }
  };

  function selectCombination(choice: CapChoice) {
    selectedChoice = selectedChoice === choice ? null : choice;
  }

  const activeVertex = $derived(hoveredVertex);
</script>

<svelte:head>
  <title>CAP Theorem - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <!-- Header -->
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/fundamentals" class="hover:text-surface-300">Fundamentals</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">CAP Theorem</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">CAP Theorem</h1>
    <p class="text-surface-400 mt-2">
      The fundamental trade-off in distributed systems: you can only guarantee two of three properties.
    </p>
  </div>

  <!-- Interactive Triangle -->
  <div class="card">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- SVG Triangle -->
      <div class="flex-1">
        <svg viewBox="0 0 400 380" class="w-full max-w-md mx-auto">
          <!-- Triangle edges -->
          <line x1={vertices.C.x} y1={vertices.C.y} x2={vertices.A.x} y2={vertices.A.y} 
                stroke="#334155" stroke-width="2" />
          <line x1={vertices.A.x} y1={vertices.A.y} x2={vertices.P.x} y2={vertices.P.y} 
                stroke="#334155" stroke-width="2" />
          <line x1={vertices.P.x} y1={vertices.P.y} x2={vertices.C.x} y2={vertices.C.y} 
                stroke="#334155" stroke-width="2" />

          <!-- Edge labels (combinations) -->
          <!-- CA Edge -->
          <g 
            class="cursor-pointer" 
            onclick={() => selectCombination('CA')}
            onmouseenter={() => {}}
          >
            <line x1={vertices.C.x} y1={vertices.C.y} x2={vertices.A.x} y2={vertices.A.y} 
                  stroke={selectedChoice === 'CA' ? '#94A3B8' : 'transparent'} 
                  stroke-width="8" 
                  class="transition-all duration-200" />
            <text x={(vertices.C.x + vertices.A.x) / 2 - 30} y={(vertices.C.y + vertices.A.y) / 2} 
                  fill={selectedChoice === 'CA' ? '#94A3B8' : '#64748B'}
                  class="text-sm font-medium transition-colors duration-200">
              CA
            </text>
            <text x={(vertices.C.x + vertices.A.x) / 2 - 30} y={(vertices.C.y + vertices.A.y) / 2 + 16} 
                  fill="#EF4444"
                  class="text-[10px]">
              (Not viable)
            </text>
          </g>

          <!-- CP Edge -->
          <g 
            class="cursor-pointer" 
            onclick={() => selectCombination('CP')}
          >
            <line x1={vertices.C.x} y1={vertices.C.y} x2={vertices.P.x} y2={vertices.P.y} 
                  stroke={selectedChoice === 'CP' ? '#8B5CF6' : 'transparent'} 
                  stroke-width="8" 
                  class="transition-all duration-200" />
            <text x={(vertices.C.x + vertices.P.x) / 2 + 15} y={(vertices.C.y + vertices.P.y) / 2} 
                  fill={selectedChoice === 'CP' ? '#8B5CF6' : '#64748B'}
                  class="text-sm font-medium transition-colors duration-200">
              CP
            </text>
          </g>

          <!-- AP Edge -->
          <g 
            class="cursor-pointer" 
            onclick={() => selectCombination('AP')}
          >
            <line x1={vertices.A.x} y1={vertices.A.y} x2={vertices.P.x} y2={vertices.P.y} 
                  stroke={selectedChoice === 'AP' ? '#EC4899' : 'transparent'} 
                  stroke-width="8" 
                  class="transition-all duration-200" />
            <text x={(vertices.A.x + vertices.P.x) / 2} y={(vertices.A.y + vertices.P.y) / 2 + 30} 
                  fill={selectedChoice === 'AP' ? '#EC4899' : '#64748B'}
                  class="text-sm font-medium transition-colors duration-200">
              AP
            </text>
          </g>

          <!-- Vertices -->
          {#each Object.entries(vertices) as [key, vertex]}
            <g 
              class="cursor-pointer"
              onmouseenter={() => hoveredVertex = key as 'C' | 'A' | 'P'}
              onmouseleave={() => hoveredVertex = null}
            >
              <circle 
                cx={vertex.x} 
                cy={vertex.y} 
                r={hoveredVertex === key ? 35 : 30}
                fill={vertex.color}
                class="transition-all duration-200"
                opacity={hoveredVertex === key ? 1 : 0.8}
              />
              <text 
                x={vertex.x} 
                y={vertex.y + 6}
                text-anchor="middle"
                fill="white"
                class="text-lg font-bold pointer-events-none"
              >
                {vertex.short}
              </text>
            </g>
          {/each}

          <!-- Center text -->
          <text x="200" y="200" text-anchor="middle" fill="#64748B" class="text-xs">
            Click an edge to learn more
          </text>
        </svg>
      </div>

      <!-- Vertex Info Panel -->
      <div class="lg:w-80 space-y-4">
        <h3 class="font-semibold text-surface-200">The Three Properties</h3>
        {#each Object.entries(vertices) as [key, vertex]}
          <div 
            class="p-4 rounded-lg border transition-all duration-200"
            class:bg-surface-800={hoveredVertex !== key}
            class:border-surface-700={hoveredVertex !== key}
            style:background-color={hoveredVertex === key ? `${vertex.color}20` : undefined}
            style:border-color={hoveredVertex === key ? vertex.color : undefined}
            onmouseenter={() => hoveredVertex = key as 'C' | 'A' | 'P'}
            onmouseleave={() => hoveredVertex = null}
          >
            <div class="flex items-center gap-2 mb-2">
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style:background-color={vertex.color}
              >
                {vertex.short}
              </div>
              <span class="font-medium text-surface-100">{vertex.label}</span>
            </div>
            <p class="text-sm text-surface-400">{vertex.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Selected Combination Details -->
  {#if selectedChoice && selectedChoice !== 'C' && selectedChoice !== 'A' && selectedChoice !== 'P'}
    {@const combo = combinations[selectedChoice]}
    <div 
      class="card border-2 transition-all duration-300"
      style:border-color={combo.color}
      in:fly={{ y: 20, duration: 300 }}
    >
      <div class="flex items-start gap-4">
        <div 
          class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
          style:background-color={combo.color}
        >
          {selectedChoice}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-xl font-semibold text-surface-100">{combo.name}</h3>
            {#if !combo.viable}
              <span class="tag bg-red-500/20 text-red-400">Not Achievable</span>
            {/if}
          </div>
          <p class="text-surface-300 mb-4">{combo.explanation}</p>

          {#if combo.viable}
            <div class="grid md:grid-cols-2 gap-4">
              <!-- Examples -->
              <div class="bg-surface-800 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-3">
                  <Icons.Database class="w-4 h-4 text-blue-400" />
                  <span class="text-sm font-medium text-blue-400">Examples</span>
                </div>
                <ul class="space-y-2">
                  {#each combo.examples as example}
                    <li class="text-sm text-surface-300 flex items-start gap-2">
                      <Icons.ChevronRight class="w-4 h-4 mt-0.5 text-surface-500 flex-shrink-0" />
                      {example}
                    </li>
                  {/each}
                </ul>
              </div>

              <!-- Use Case -->
              {#if combo.useCase}
                <div class="bg-surface-800 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <Icons.Lightbulb class="w-4 h-4 text-yellow-400" />
                    <span class="text-sm font-medium text-yellow-400">Best For</span>
                  </div>
                  <p class="text-sm text-surface-300">{combo.useCase}</p>
                </div>
              {/if}
            </div>
          {:else}
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <Icons.AlertTriangle class="w-4 h-4 text-red-400" />
                <span class="text-sm font-medium text-red-400">Why Not Achievable?</span>
              </div>
              <p class="text-sm text-surface-300">
                In any distributed system, network partitions can and will occur. When they do, 
                you MUST choose between consistency and availability - you cannot have both.
                CA systems only exist as single-node databases.
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Key Insight -->
  <div class="card bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
        <Icons.Sparkles class="w-5 h-5 text-blue-400" />
      </div>
      <div>
        <h3 class="font-semibold text-surface-100 mb-2">The Key Insight</h3>
        <p class="text-surface-300 text-sm">
          In practice, <strong class="text-yellow-400">Partition Tolerance (P) is mandatory</strong> for any 
          distributed system - network failures are a reality. This means your real choice is between 
          <strong class="text-purple-400">CP</strong> (consistency over availability) and 
          <strong class="text-pink-400">AP</strong> (availability over consistency).
        </p>
      </div>
    </div>
  </div>

  <!-- Real-World Decision Guide -->
  <div class="card">
    <h3 class="text-lg font-semibold text-surface-100 mb-4">Choosing Between CP and AP</h3>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <span class="text-sm font-bold text-purple-400">CP</span>
          </div>
          <span class="font-medium text-surface-200">Choose CP when...</span>
        </div>
        <ul class="space-y-2 ml-10">
          {#each [
            'Wrong data causes real harm (financial transactions)',
            'Users expect immediate consistency (booking systems)',
            'You need strong guarantees (inventory counts)',
            'Data conflicts are hard to resolve'
          ] as item}
            <li class="text-sm text-surface-400 flex items-start gap-2">
              <Icons.Check class="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          {/each}
        </ul>
      </div>

      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <span class="text-sm font-bold text-pink-400">AP</span>
          </div>
          <span class="font-medium text-surface-200">Choose AP when...</span>
        </div>
        <ul class="space-y-2 ml-10">
          {#each [
            'Availability is critical (always-on services)',
            'Eventual consistency is acceptable (social feeds)',
            'You can merge conflicts automatically',
            'Stale data is better than no data'
          ] as item}
            <li class="text-sm text-surface-400 flex items-start gap-2">
              <Icons.Check class="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex justify-between items-center pt-4 border-t border-surface-800">
    <a href="/fundamentals" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" />
      Back to Fundamentals
    </a>
    <a href="/fundamentals/consistency" class="btn-primary flex items-center gap-2">
      Next: Consistency Models
      <Icons.ArrowRight class="w-4 h-4" />
    </a>
  </div>
</div>

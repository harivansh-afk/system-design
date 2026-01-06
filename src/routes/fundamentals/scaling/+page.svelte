<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const strategies = [
    {
      title: 'Vertical scaling (scale up)',
      desc: 'Bigger machine: more CPU/RAM/IO. Simple, but hard limits and single-node failures.',
      icon: 'ArrowUp'
    },
    {
      title: 'Horizontal scaling (scale out)',
      desc: 'More machines behind a load balancer. Adds complexity: coordination, partitions, consistency.',
      icon: 'Layers'
    },
    {
      title: 'Caching',
      desc: 'Reduce repeated work. Fast reads, but you must manage invalidation and staleness.',
      icon: 'Zap'
    },
    {
      title: 'Partitioning/sharding',
      desc: 'Split data by key to distribute load. Requires careful key design, rebalancing, and cross-shard queries.',
      icon: 'Split'
    }
  ] as const;

  type IconComponent = typeof Icons.Box;
  function getIcon(iconName: string): IconComponent {
    const iconMap = Icons as unknown as Record<string, IconComponent>;
    return iconMap[iconName] || Icons.Box;
  }

  const references = [
    { label: 'AWS EC2 Instances (concepts)', href: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Instances.html' },
    { label: 'Kubernetes (scaling concepts)', href: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/' }
  ];
</script>

<svelte:head>
  <title>Scaling - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/fundamentals" class="hover:text-surface-300">Fundamentals</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Scaling</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Scaling</h1>
    <p class="text-surface-400 mt-2">
      Techniques to handle more traffic and data while keeping reliability, latency, and cost under control.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    {#each strategies as s}
      {@const Icon = getIcon(s.icon)}
      <div class="card">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center">
            <Icon class="w-5 h-5 text-surface-300" />
          </div>
          <div>
            <h2 class="font-semibold text-surface-100">{s.title}</h2>
            <p class="text-sm text-surface-400 mt-1">{s.desc}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">Rule of Thumb</h2>
    <div class="grid md:grid-cols-2 gap-4 text-surface-300">
      <div class="p-4 rounded-lg bg-surface-800/50 border border-surface-700">
        <h3 class="font-medium text-surface-200">Start simple</h3>
        <p class="text-sm text-surface-400 mt-1">Scale up first when you can; introduce distributed complexity only when needed.</p>
      </div>
      <div class="p-4 rounded-lg bg-surface-800/50 border border-surface-700">
        <h3 class="font-medium text-surface-200">Measure, then optimize</h3>
        <p class="text-sm text-surface-400 mt-1">Use SLOs and profiling to find the real bottleneck: CPU, DB, network, locks, or tail latency.</p>
      </div>
    </div>
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">References</h2>
    <ul class="space-y-2">
      {#each references as ref}
        <li>
          <a class="text-surface-200 hover:text-white underline underline-offset-4" href={ref.href} target="_blank" rel="noreferrer">
            {ref.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>

  <div class="flex justify-between">
    <a href="/fundamentals/consistency" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" /> Consistency Models
    </a>
    <a href="/fundamentals/latency" class="btn-primary flex items-center gap-2">
      Latency vs Throughput <Icons.ArrowRight class="w-4 h-4" />
    </a>
  </div>
</div>


<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const concepts = [
    {
      title: 'Latency',
      desc: 'Time for a single request to complete (p50/p95/p99). Users feel tail latency most.',
      icon: 'Clock'
    },
    {
      title: 'Throughput',
      desc: 'Work completed per unit time (requests/sec, bytes/sec). Often limited by CPU, IO, or contention.',
      icon: 'Gauge'
    },
    {
      title: 'Queueing',
      desc: 'As utilization approaches 100%, queues build and latency spikes. Keep headroom for bursts.',
      icon: 'ListOrdered'
    },
    {
      title: 'Backpressure',
      desc: 'Push back on producers (shed load, rate limit, bounded queues) to protect downstream systems.',
      icon: 'ArrowDownToLine'
    }
  ] as const;

  type IconComponent = typeof Icons.Box;
  function getIcon(iconName: string): IconComponent {
    const iconMap = Icons as unknown as Record<string, IconComponent>;
    return iconMap[iconName] || Icons.Box;
  }

  const references = [
    { label: 'Kubernetes (resource requests/limits)', href: 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/' },
    { label: 'AWS Lambda (performance & behavior)', href: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html' }
  ];
</script>

<svelte:head>
  <title>Latency vs Throughput - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/fundamentals" class="hover:text-surface-300">Fundamentals</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Latency vs Throughput</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Latency vs Throughput</h1>
    <p class="text-surface-400 mt-2">
      Fast single requests and high volume are related—but optimizing one can hurt the other.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    {#each concepts as c}
      {@const Icon = getIcon(c.icon)}
      <div class="card">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center">
            <Icon class="w-5 h-5 text-surface-300" />
          </div>
          <div>
            <h2 class="font-semibold text-surface-100">{c.title}</h2>
            <p class="text-sm text-surface-400 mt-1">{c.desc}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">Practical Tips</h2>
    <ul class="space-y-2 text-surface-300">
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Track p50/p95/p99; p99 drives user experience and incident pain.</li>
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Bound queues and add timeouts; unbounded retries create latency collapse.</li>
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Use load shedding when overloaded to keep the system responsive for some users.</li>
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Prefer idempotent operations so retries don’t amplify failures.</li>
    </ul>
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
    <a href="/fundamentals/scaling" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" /> Scaling
    </a>
    <a href="/compute" class="btn-primary flex items-center gap-2">
      Compute <Icons.ArrowRight class="w-4 h-4" />
    </a>
  </div>
</div>


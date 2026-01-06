<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const highlights = [
    { title: 'Packaging', desc: 'Bundle app + dependencies into an image; run consistently across environments.' },
    { title: 'Isolation', desc: 'Process-level isolation using OS primitives (namespaces/cgroups), not a full guest OS.' },
    { title: 'Fast deploys', desc: 'Start/stop quickly; good for CI/CD and autoscaling.' },
    { title: 'Standard interface', desc: 'Images + registries + runtime API make shipping software predictable.' }
  ] as const;

  const references = [
    { label: 'Docker Documentation', href: 'https://docs.docker.com/' },
    { label: 'Kubernetes (containers & workloads)', href: 'https://kubernetes.io/docs/concepts/workloads/pods/' }
  ];
</script>

<svelte:head>
  <title>Containers - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/compute" class="hover:text-surface-300">Compute</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Containers</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Containers</h1>
    <p class="text-surface-400 mt-2">
      Lightweight deployment units: ship code as images and run them with predictable runtime boundaries.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    {#each highlights as h}
      <div class="card">
        <h2 class="text-lg font-semibold text-surface-100">{h.title}</h2>
        <p class="text-sm text-surface-400 mt-2">{h.desc}</p>
      </div>
    {/each}
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">Operational Notes</h2>
    <ul class="space-y-2 text-surface-300">
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Use immutable images; avoid “ssh and fix” in running containers.</li>
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Prefer one process per container; scale via replicas.</li>
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Log to stdout/stderr; let the platform aggregate.</li>
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Define CPU/memory limits to prevent noisy neighbors.</li>
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
    <a href="/compute/virtual-machines" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" /> Virtual Machines
    </a>
    <a href="/compute/kubernetes" class="btn-primary flex items-center gap-2">
      Kubernetes <Icons.ArrowRight class="w-4 h-4" />
    </a>
  </div>
</div>


<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const references = [
    { label: 'Amazon EBS User Guide', href: 'https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html' }
  ];
</script>

<svelte:head>
  <title>Block Storage - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/storage" class="hover:text-surface-300">Storage</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Block Storage</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Block Storage</h1>
    <p class="text-surface-400 mt-2">
      A virtual disk you attach to a machine. Low-latency random reads/writes; typically single-writer.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Best for</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Databases and workloads needing random IO</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Boot volumes and durable VM state</li>
      </ul>
    </div>
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Trade-offs</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Often attached to one host/zone at a time</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Scaling is vertical; sharding/replication required for horizontal scale</li>
      </ul>
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
</div>


<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const references = [
    { label: 'Amazon EFS User Guide', href: 'https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html' }
  ];
</script>

<svelte:head>
  <title>File Storage - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/storage" class="hover:text-surface-300">Storage</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">File Storage</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">File Storage</h1>
    <p class="text-surface-400 mt-2">
      Shared filesystem semantics (often POSIX-like) over the network. Multiple clients can mount and read/write.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Best for</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Shared assets (media processing, ML models)</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Legacy apps expecting a filesystem</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Multiple compute nodes reading the same data</li>
      </ul>
    </div>
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Trade-offs</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Network latency and throughput constraints</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Locking/coordination can limit scale for heavy writes</li>
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


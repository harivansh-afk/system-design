<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const references = [
    { label: 'Amazon S3 User Guide', href: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html' }
  ];
</script>

<svelte:head>
  <title>Object Storage - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/storage" class="hover:text-surface-300">Storage</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Object Storage</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Object Storage</h1>
    <p class="text-surface-400 mt-2">
      Store blobs (objects) addressed by key, typically accessed via an HTTP API. Great durability and scale.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Best for</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Images, video, backups, logs, data lakes</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Static web assets + CDN</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Immutable or append-like workflows</li>
      </ul>
    </div>
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Trade-offs</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Not a POSIX filesystem (no in-place edits like a disk)</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Higher per-operation latency than local disk</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Consistency semantics depend on provider/features</li>
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


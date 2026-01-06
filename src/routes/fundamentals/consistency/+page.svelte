<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const references = [
    { label: 'CAP Theorem (in-app)', href: '/fundamentals/cap-theorem' },
    { label: 'DynamoDB Read Consistency', href: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html' },
    { label: 'Cloud Spanner: TrueTime & External Consistency', href: 'https://cloud.google.com/spanner/docs/true-time-external-consistency' }
  ];
</script>

<svelte:head>
  <title>Consistency Models - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/fundamentals" class="hover:text-surface-300">Fundamentals</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Consistency Models</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Consistency Models</h1>
    <p class="text-surface-400 mt-2">
      How quickly reads reflect writes in a distributed system (and what you trade for it).
    </p>
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">Common Models</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="p-4 rounded-lg bg-surface-800/50 border border-surface-700">
        <h3 class="font-medium text-surface-200">Strong consistency</h3>
        <p class="text-sm text-surface-400 mt-1">
          Reads always see the latest successful write. Simple mental model; can cost availability/latency under partitions.
        </p>
      </div>
      <div class="p-4 rounded-lg bg-surface-800/50 border border-surface-700">
        <h3 class="font-medium text-surface-200">Eventual consistency</h3>
        <p class="text-sm text-surface-400 mt-1">
          Replicas converge over time. Higher availability and lower latency; clients may observe stale data temporarily.
        </p>
      </div>
      <div class="p-4 rounded-lg bg-surface-800/50 border border-surface-700">
        <h3 class="font-medium text-surface-200">Read-your-writes</h3>
        <p class="text-sm text-surface-400 mt-1">
          After a client writes, they will see their own write on subsequent reads (session guarantees).
        </p>
      </div>
      <div class="p-4 rounded-lg bg-surface-800/50 border border-surface-700">
        <h3 class="font-medium text-surface-200">Causal consistency</h3>
        <p class="text-sm text-surface-400 mt-1">
          Preserves cause→effect ordering (if A influenced B, everyone sees A before B) without full strong consistency.
        </p>
      </div>
    </div>
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">Design Checklist</h2>
    <ul class="space-y-2 text-surface-300">
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />What user-visible anomalies are acceptable (stale reads, reordering, duplicates)?</li>
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Do you need monotonic reads (no going “back in time”)?</li>
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />What happens during partitions: fail (CP) or serve stale (AP)?</li>
      <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Can clients handle retries/idempotency to compensate?</li>
    </ul>
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">References</h2>
    <ul class="space-y-2">
      {#each references as ref}
        <li>
          <a
            class="text-surface-200 hover:text-white underline underline-offset-4"
            href={ref.href}
            target={ref.href.startsWith('http') ? '_blank' : undefined}
            rel={ref.href.startsWith('http') ? 'noreferrer' : undefined}
          >
            {ref.label}
          </a>
        </li>
      {/each}
    </ul>
    <p class="text-xs text-surface-500 mt-4">
      References are external; open in a new tab.
    </p>
  </div>

  <div class="flex justify-between">
    <a href="/fundamentals/cap-theorem" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" /> CAP Theorem
    </a>
    <a href="/fundamentals/scaling" class="btn-primary flex items-center gap-2">
      Scaling <Icons.ArrowRight class="w-4 h-4" />
    </a>
  </div>
</div>

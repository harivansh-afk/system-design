<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const references = [
    { label: 'AWS SQS Developer Guide', href: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' }
  ];
</script>

<svelte:head>
  <title>Message Queues - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/messaging" class="hover:text-surface-300">Messaging</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Message Queues</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Message Queues</h1>
    <p class="text-surface-400 mt-2">
      Queue-based messaging for background work: one message is typically handled by one consumer.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">What you get</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Decoupling between producers and workers</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Smoothing bursty load (buffering)</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Retry + DLQ patterns for failures</li>
      </ul>
    </div>
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Design gotchas</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />At-least-once delivery means duplicates; consumers must be idempotent.</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Visibility timeouts and retries can amplify load if misconfigured.</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Ordering is rarely global; assume partial ordering at best.</li>
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
    <div class="mt-4">
      <a href="/decisions/which-queue" class="btn-primary">Which Message Queue?</a>
    </div>
  </div>
</div>


<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const references = [
    { label: 'AWS SNS Developer Guide', href: 'https://docs.aws.amazon.com/sns/latest/dg/welcome.html' }
  ];
</script>

<svelte:head>
  <title>Pub/Sub - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/messaging" class="hover:text-surface-300">Messaging</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Pub/Sub</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Pub/Sub</h1>
    <p class="text-surface-400 mt-2">
      Publish events once; multiple subscribers consume independently. Great for fanout and integrations.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">When to use</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />One event triggers multiple side effects</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />You want to add consumers without changing producers</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Integrations with email/SMS/webhooks/queues</li>
      </ul>
    </div>
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Trade-offs</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Harder to reason about end-to-end flows</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Delivery semantics vary by system and subscription type</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />You still need idempotent handlers</li>
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


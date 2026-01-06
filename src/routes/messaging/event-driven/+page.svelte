<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const principles = [
    { title: 'Events are facts', desc: 'Model immutable “what happened” records; derive state from events when useful.' },
    { title: 'Loose coupling', desc: 'Producers don’t know consumers; schemas and contracts become critical.' },
    { title: 'Async boundaries', desc: 'Failures become retries, DLQs, and compensations—not simple rollbacks.' },
    { title: 'Observability', desc: 'Trace IDs, idempotency keys, and event lineage make debugging possible.' }
  ] as const;

  const references = [
    { label: 'Kafka (for event streaming)', href: '/compare/kafka-vs-rabbitmq' }
  ];
</script>

<svelte:head>
  <title>Event-Driven Architecture - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/messaging" class="hover:text-surface-300">Messaging</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Event-Driven</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Event-Driven Architecture</h1>
    <p class="text-surface-400 mt-2">
      Systems communicate by emitting and reacting to events, enabling fanout, resilience, and evolution over time.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    {#each principles as p}
      <div class="card">
        <h2 class="text-lg font-semibold text-surface-100">{p.title}</h2>
        <p class="text-sm text-surface-400 mt-2">{p.desc}</p>
      </div>
    {/each}
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">Next steps</h2>
    <div class="flex flex-wrap gap-3">
      {#each references as ref}
        <a class="btn-primary" href={ref.href}>{ref.label}</a>
      {/each}
    </div>
  </div>
</div>


<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const models = [
    { title: 'Document', desc: 'JSON-like documents; flexible schema; easy to evolve.' },
    { title: 'Key-value', desc: 'Fast lookups by key; simple operations; often used for sessions/caching.' },
    { title: 'Wide-column', desc: 'High write throughput and horizontal scale; good for time-series/event data.' },
    { title: 'Graph', desc: 'Relationships are first-class; great for traversals (social graphs, recommendations).' }
  ] as const;

  const references = [
    { label: 'Compare: SQL vs NoSQL', href: '/compare/sql-vs-nosql' },
    { label: 'MongoDB Manual', href: 'https://www.mongodb.com/docs/manual/' },
    { label: 'DynamoDB Developer Guide', href: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html' }
  ];
</script>

<svelte:head>
  <title>NoSQL Databases - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/databases" class="hover:text-surface-300">Databases</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">NoSQL Databases</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">NoSQL Databases</h1>
    <p class="text-surface-400 mt-2">
      A family of models optimized for scale, availability, and flexible schemas—at the cost of uniform query power.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    {#each models as m}
      <div class="card">
        <h2 class="text-lg font-semibold text-surface-100">{m.title}</h2>
        <p class="text-sm text-surface-400 mt-2">{m.desc}</p>
      </div>
    {/each}
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">Design note</h2>
    <p class="text-surface-300">
      With NoSQL, model around access patterns: define the queries first, then shape the data to serve them cheaply.
    </p>
    <div class="mt-4 flex flex-wrap gap-3">
      {#each references as ref}
        <a
          class="btn-primary"
          href={ref.href}
          target={ref.href.startsWith('http') ? '_blank' : undefined}
          rel={ref.href.startsWith('http') ? 'noreferrer' : undefined}
        >
          {ref.label}
        </a>
      {/each}
    </div>
  </div>
</div>

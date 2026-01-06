<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const traits = [
    { title: 'Relational model', desc: 'Tables, rows, and relations; great for multi-entity queries and constraints.' },
    { title: 'ACID transactions', desc: 'Strong correctness guarantees for critical business invariants.' },
    { title: 'Indexes', desc: 'Fast point/range lookups; cost extra writes and storage.' },
    { title: 'Scaling pattern', desc: 'Scale reads via replicas; scale writes via sharding/partitioning or specialized systems.' }
  ] as const;

  const references = [
    { label: 'Which Database? (decision tree)', href: '/decisions/which-database' },
    { label: 'PostgreSQL Documentation', href: 'https://www.postgresql.org/docs/' }
  ];
</script>

<svelte:head>
  <title>SQL Databases - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/databases" class="hover:text-surface-300">Databases</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">SQL Databases</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">SQL Databases</h1>
    <p class="text-surface-400 mt-2">
      The default choice for many products: strong correctness, powerful querying, and mature tooling.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    {#each traits as t}
      <div class="card">
        <h2 class="text-lg font-semibold text-surface-100">{t.title}</h2>
        <p class="text-sm text-surface-400 mt-2">{t.desc}</p>
      </div>
    {/each}
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-surface-100 mb-3">Next steps</h2>
    <div class="flex flex-wrap gap-3">
      {#each references as ref}
        <a
          class="btn-secondary"
          href={ref.href}
          target={ref.href.startsWith('http') ? '_blank' : undefined}
          rel={ref.href.startsWith('http') ? 'noreferrer' : undefined}
        >
          {ref.label}
        </a>
      {/each}
      <a class="btn-primary" href="/compare/sql-vs-nosql">SQL vs NoSQL</a>
    </div>
  </div>
</div>

<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import ComparisonTable from '$lib/components/diagrams/ComparisonTable.svelte';

  const options = [
    {
      id: 'rest',
      name: 'REST',
      description: 'Resource-oriented HTTP APIs with caching-friendly semantics',
      color: '#3B82F6',
      icon: 'Globe',
      whenToUse: [
        'Public APIs with broad client support',
        'Simple CRUD over resources',
        'Strong HTTP caching semantics',
        'Teams that want predictable operational simplicity'
      ],
      whenNotToUse: [
        'Highly nested/graph queries causing over/under-fetching',
        'Strict low-latency internal RPC at high QPS',
        'Many client-specific response shapes'
      ]
    },
    {
      id: 'graphql',
      name: 'GraphQL',
      description: 'Client-driven query language for APIs (typed schema)',
      color: '#A855F7',
      icon: 'Binary',
      whenToUse: [
        'Multiple clients with different data needs',
        'You want a single endpoint with typed schema',
        'You can invest in schema governance and resolvers',
        'Rapid product iteration with changing UI requirements'
      ],
      whenNotToUse: [
        'You need simple caching at the HTTP layer',
        'You cannot commit to strict schema discipline',
        'Complex authorization per field without good tooling'
      ]
    },
    {
      id: 'grpc',
      name: 'gRPC',
      description: 'High-performance RPC over HTTP/2 with protobuf contracts',
      color: '#22C55E',
      icon: 'Zap',
      whenToUse: [
        'Internal service-to-service communication',
        'Low latency and high throughput are priorities',
        'Strong contracts and code generation help correctness',
        'Streaming (client/server/bidi) is valuable'
      ],
      whenNotToUse: [
        'Browser-first clients without a gateway layer',
        'Human-readable payloads are required',
        'You need “just curl it” simplicity'
      ]
    }
  ];

  const features = [
    {
      feature: 'Contract',
      description: 'How requests/responses are described',
      values: {
        rest: 'OpenAPI (optional)',
        graphql: 'Schema (required)',
        grpc: 'Protobuf (required)'
      }
    },
    {
      feature: 'Transport',
      description: 'What runs on the wire',
      values: {
        rest: 'HTTP/1.1+',
        graphql: 'HTTP',
        grpc: 'HTTP/2'
      }
    },
    {
      feature: 'Caching',
      description: 'Where caching is easiest',
      values: {
        rest: 'HTTP caching',
        graphql: 'App/gateway caching',
        grpc: 'App/gateway caching'
      }
    },
    {
      feature: 'Streaming',
      description: 'Real-time / incremental responses',
      values: {
        rest: 'Limited (varies)',
        graphql: 'Subscriptions (varies)',
        grpc: 'Built-in (streams)'
      }
    },
    {
      feature: 'Best fit',
      description: 'Typical sweet spot',
      values: {
        rest: 'Public APIs',
        graphql: 'Product UIs',
        grpc: 'Internal services'
      }
    }
  ];

  const references = [
    { label: 'MDN: REST', href: 'https://developer.mozilla.org/en-US/docs/Glossary/REST' },
    { label: 'GraphQL Specification', href: 'https://spec.graphql.org/' },
    { label: 'gRPC Documentation', href: 'https://grpc.io/docs/' }
  ];
</script>

<svelte:head>
  <title>REST vs GraphQL vs gRPC - System Design Explorer</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/compare" class="hover:text-surface-300">Compare</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">REST vs GraphQL vs gRPC</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">REST vs GraphQL vs gRPC</h1>
    <p class="text-surface-400">
      API style is a product and operational decision: clients, latency, caching, and contracts all matter.
    </p>
  </div>

  <div class="card">
    <ComparisonTable
      title="Pick the right API style"
      subtitle="Click a column header for “when to use” guidance"
      {options}
      {features}
    />
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

<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import DecisionTree from '$lib/components/diagrams/DecisionTree.svelte';

  const nodes = [
    {
      id: 'start',
      type: 'question' as const,
      text: 'Is your workload event-driven or spiky (bursts, unpredictable traffic)?',
      description: 'Examples: webhooks, queues, cron jobs, variable API traffic.',
      yes: 'cold-start-ok',
      no: 'steady-load'
    },
    {
      id: 'steady-load',
      type: 'question' as const,
      text: 'Is the workload steady and long-running (always-on)?',
      description: 'Example: low-latency APIs with predictable throughput.',
      yes: 'containers-or-vms',
      no: 'cold-start-ok'
    },
    {
      id: 'cold-start-ok',
      type: 'question' as const,
      text: 'Can you tolerate occasional cold starts (extra latency)?',
      description: 'Some serverless platforms add startup latency when scaling from zero.',
      yes: 'serverless-answer',
      no: 'containers-answer'
    },
    {
      id: 'serverless-answer',
      type: 'answer' as const,
      text: 'Serverless Functions',
      icon: 'Zap',
      reasoning: 'Great for bursty/event-driven workloads: automatic scaling, pay-per-use, minimal ops. Watch limits, execution time, and cold-start latency.',
      alternatives: [
        'Managed containers (Cloud Run / Fargate) for more control',
        'Kubernetes for complex multi-service platforms'
      ]
    },
    {
      id: 'containers-answer',
      type: 'answer' as const,
      text: 'Containers (Managed or Orchestrated)',
      icon: 'Box',
      reasoning: 'If you need consistent low latency and more runtime control, containers are often the sweet spot. Use a managed platform to reduce operational load.',
      alternatives: [
        'Kubernetes for advanced scheduling and ecosystem',
        'VMs for full OS control / legacy workloads'
      ]
    },
    {
      id: 'containers-or-vms',
      type: 'answer' as const,
      text: 'Containers or VMs',
      icon: 'Server',
      reasoning: 'Always-on services are often cheaper and simpler on containers/VMs than pure serverless. Use autoscaling + load balancing for resilience.',
      alternatives: [
        'Serverless for async jobs and event handlers',
        'Kubernetes if you need multi-tenant orchestration'
      ]
    }
  ];

  const references = [
    { label: 'AWS Lambda Developer Guide', href: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html' },
    { label: 'Kubernetes Concepts', href: 'https://kubernetes.io/docs/concepts/' }
  ];
</script>

<svelte:head>
  <title>Serverless or Not? - System Design Explorer</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/decisions" class="hover:text-surface-300">Decision Trees</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Serverless or Not?</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Serverless or Not?</h1>
    <p class="text-surface-400 mt-2">
      Use this quick decision tree to pick between serverless functions and always-on compute.
    </p>
  </div>

  <div class="card">
    <DecisionTree
      title=""
      subtitle=""
      {nodes}
      startNode="start"
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

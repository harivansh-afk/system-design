<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import DecisionTree from '$lib/components/diagrams/DecisionTree.svelte';

  const nodes = [
    {
      id: 'start',
      type: 'question' as const,
      text: 'Do you need to broadcast one message to many consumers?',
      description: 'Fanout: many subscribers get the same event.',
      yes: 'pubsub-answer',
      no: 'queue-work'
    },
    {
      id: 'queue-work',
      type: 'question' as const,
      text: 'Is the goal background work (tasks) handled by one worker?',
      description: 'Job queues: resize images, send emails, run async processing.',
      yes: 'simple-queue',
      no: 'streaming'
    },
    {
      id: 'simple-queue',
      type: 'answer' as const,
      text: 'Simple Managed Queue (e.g., SQS)',
      icon: 'ListOrdered',
      reasoning: 'Great default for task queues: reliable, easy ops, DLQs, and autoscaling consumers. Assume at-least-once delivery and handle duplicates.',
      alternatives: [
        'RabbitMQ if you need complex routing/patterns',
        'Kafka if you need replay and long retention'
      ]
    },
    {
      id: 'streaming',
      type: 'question' as const,
      text: 'Do you need to replay events or retain them for days/weeks?',
      description: 'If you need audit trails, reprocessing, or event sourcing, retention matters.',
      yes: 'kafka-answer',
      no: 'broker-answer'
    },
    {
      id: 'kafka-answer',
      type: 'answer' as const,
      text: 'Event Streaming (Kafka-like)',
      icon: 'Activity',
      reasoning: 'Use a log-based streaming platform when replay, ordering per partition, and high throughput are key requirements.',
      alternatives: [
        'Managed Kafka',
        'Kinesis / Pub/Sub equivalents (cloud-native)',
        'RabbitMQ for classic broker patterns'
      ]
    },
    {
      id: 'broker-answer',
      type: 'answer' as const,
      text: 'Message Broker (RabbitMQ-like)',
      icon: 'MessageSquare',
      reasoning: 'Use a broker when you need flexible routing, per-message acknowledgments, and classic messaging patterns.',
      alternatives: [
        'Managed queue for simpler operations',
        'Kafka for retention and reprocessing'
      ]
    },
    {
      id: 'pubsub-answer',
      type: 'answer' as const,
      text: 'Pub/Sub Topic (e.g., SNS)',
      icon: 'Bell',
      reasoning: 'Best for fanout: publish once; subscribers (queues, webhooks, workers) each handle their copy independently.',
      alternatives: [
        'Kafka if you need retention/replay',
        'Event bus products for schema governance'
      ]
    }
  ];

  const references = [
    { label: 'AWS SQS Developer Guide', href: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' },
    { label: 'AWS SNS Developer Guide', href: 'https://docs.aws.amazon.com/sns/latest/dg/welcome.html' }
  ];
</script>

<svelte:head>
  <title>Which Message Queue? - System Design Explorer</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/decisions" class="hover:text-surface-300">Decision Trees</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Which Message Queue?</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Which Message Queue?</h1>
    <p class="text-surface-400 mt-2">
      Decide between queue, pub/sub, broker, and event streaming based on your requirements.
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
    <div class="mt-4 flex flex-wrap gap-3">
      <a href="/compare/kafka-vs-rabbitmq" class="btn-primary">Kafka vs RabbitMQ</a>
    </div>
  </div>
</div>

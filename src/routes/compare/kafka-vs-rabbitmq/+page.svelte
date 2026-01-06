<script lang="ts">
  import ComparisonTable from '$lib/components/diagrams/ComparisonTable.svelte';

  let selectedSystem: 'kafka' | 'rabbitmq' | null = null;

  const comparisonOptions = [
    {
      id: 'kafka',
      name: 'Apache Kafka',
      description: 'Distributed event streaming platform for high-throughput data pipelines',
      whenToUse: [
        'High-throughput event streaming (millions of messages/sec)',
        'Real-time analytics and data pipelines',
        'Event sourcing and audit trails',
        'Log aggregation from multiple sources',
        'Need to replay/reprocess historical messages',
        'Building data lakes and ML pipelines',
        'Long-term message retention (days/weeks)'
      ],
      whenNotToUse: [
        'Simple task queues with low volume',
        'Need complex routing patterns',
        'Request/reply messaging patterns',
        'Low-latency at low throughput more important',
        'Need message priorities',
        'Want simpler operations and setup'
      ]
    },
    {
      id: 'rabbitmq',
      name: 'RabbitMQ',
      description: 'Traditional message broker for reliable delivery and flexible routing',
      whenToUse: [
        'Complex routing patterns (topic, fanout, headers)',
        'Traditional request/reply messaging',
        'Task queues with acknowledgments',
        'Need message priorities',
        'Multiple protocol support (AMQP, MQTT, STOMP)',
        'Microservices communication',
        'Lower volume with guaranteed delivery'
      ],
      whenNotToUse: [
        'Need millions of messages per second',
        'Want to replay old messages',
        'Building real-time analytics pipelines',
        'Long-term message storage required',
        'Event sourcing architecture',
        'Horizontal scaling is critical'
      ]
    }
  ];

  const features = [
    { name: 'Architecture', kafka: 'Distributed log (append-only)', rabbitmq: 'Message broker (queue-based)' },
    { name: 'Delivery Model', kafka: 'Pull (consumers poll)', rabbitmq: 'Push (broker pushes)' },
    { name: 'Message Retention', kafka: 'Time/size based (keeps messages)', rabbitmq: 'Until acknowledged (deletes)' },
    { name: 'Throughput', kafka: 'Millions/sec per broker', rabbitmq: '10K-50K/sec' },
    { name: 'Latency', kafka: '~5ms at scale', rabbitmq: 'Sub-ms at low volume' },
    { name: 'Ordering', kafka: 'Per partition only', rabbitmq: 'Per queue' },
    { name: 'Replay', kafka: 'Yes (offset-based)', rabbitmq: 'No (messages deleted)' },
    { name: 'Routing', kafka: 'Topic-based only', rabbitmq: 'Flexible (exchanges, bindings)' },
    { name: 'Protocol', kafka: 'Kafka protocol (binary)', rabbitmq: 'AMQP, MQTT, STOMP, HTTP' },
    { name: 'Scaling', kafka: 'Horizontal (partitions)', rabbitmq: 'Vertical + clustering' },
    { name: 'Consumer Groups', kafka: 'Built-in (partition-based)', rabbitmq: 'Manual (competing consumers)' }
  ];

  const architectureDiff = {
    kafka: {
      title: 'Distributed Log',
      description: 'Messages are appended to partitioned logs and retained based on time/size policies',
      flow: [
        { label: 'Producer', desc: 'Writes to topic partition' },
        { label: 'Broker', desc: 'Stores in append-only log' },
        { label: 'Consumer', desc: 'Pulls at own pace via offset' }
      ],
      keyPoint: 'Messages persist regardless of consumption - consumers track their own position (offset)'
    },
    rabbitmq: {
      title: 'Message Broker',
      description: 'Messages routed through exchanges to queues and removed once acknowledged',
      flow: [
        { label: 'Producer', desc: 'Sends to exchange' },
        { label: 'Exchange', desc: 'Routes to queue(s)' },
        { label: 'Consumer', desc: 'Receives push, sends ack' }
      ],
      keyPoint: 'Messages deleted after acknowledgment - broker tracks delivery state'
    }
  };
</script>

<svelte:head>
  <title>Kafka vs RabbitMQ</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <h1 class="text-3xl font-bold text-white mb-2">Kafka vs RabbitMQ</h1>
  <p class="text-gray-400 mb-8">Event streaming platform vs traditional message broker - understanding the fundamental differences</p>

  <!-- TL;DR -->
  <section class="mb-12">
    <div class="bg-gradient-to-r from-orange-500/10 to-green-500/10 rounded-xl p-6 border border-gray-700">
      <h2 class="text-lg font-semibold text-white mb-4">TL;DR</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="flex items-start gap-3">
          <div class="w-3 h-3 rounded-full bg-orange-500 mt-1.5"></div>
          <div>
            <span class="text-orange-400 font-medium">Kafka</span>
            <span class="text-gray-300"> = Event streaming. High throughput, message replay, data pipelines.</span>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-3 h-3 rounded-full bg-green-500 mt-1.5"></div>
          <div>
            <span class="text-green-400 font-medium">RabbitMQ</span>
            <span class="text-gray-300"> = Message broker. Complex routing, guaranteed delivery, task queues.</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Architecture Comparison -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Architecture Difference</h2>
    <p class="text-gray-400 mb-6">The fundamental architectural difference explains most of their behavior differences.</p>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Kafka -->
      <div class="bg-gray-800/50 rounded-xl p-6 border border-orange-500/30">
        <h3 class="text-lg font-semibold text-orange-400 mb-2">{architectureDiff.kafka.title}</h3>
        <p class="text-gray-400 text-sm mb-4">{architectureDiff.kafka.description}</p>

        <div class="space-y-3 mb-4">
          {#each architectureDiff.kafka.flow as step, i}
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <div class="text-white font-medium text-sm">{step.label}</div>
                <div class="text-gray-500 text-xs">{step.desc}</div>
              </div>
              {#if i < architectureDiff.kafka.flow.length - 1}
                <div class="flex-1 border-t border-dashed border-orange-500/30"></div>
              {/if}
            </div>
          {/each}
        </div>

        <div class="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <div class="text-orange-300 text-sm">{architectureDiff.kafka.keyPoint}</div>
        </div>
      </div>

      <!-- RabbitMQ -->
      <div class="bg-gray-800/50 rounded-xl p-6 border border-green-500/30">
        <h3 class="text-lg font-semibold text-green-400 mb-2">{architectureDiff.rabbitmq.title}</h3>
        <p class="text-gray-400 text-sm mb-4">{architectureDiff.rabbitmq.description}</p>

        <div class="space-y-3 mb-4">
          {#each architectureDiff.rabbitmq.flow as step, i}
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <div class="text-white font-medium text-sm">{step.label}</div>
                <div class="text-gray-500 text-xs">{step.desc}</div>
              </div>
              {#if i < architectureDiff.rabbitmq.flow.length - 1}
                <div class="flex-1 border-t border-dashed border-green-500/30"></div>
              {/if}
            </div>
          {/each}
        </div>

        <div class="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div class="text-green-300 text-sm">{architectureDiff.rabbitmq.keyPoint}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Message Lifecycle -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Message Lifecycle</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 class="text-lg font-semibold text-orange-400 mb-4">Kafka: Log-Based</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
            <span class="text-2xl">1.</span>
            <div>
              <div class="text-white">Message written to partition</div>
              <div class="text-gray-500 text-sm">Appended to end of log with offset</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
            <span class="text-2xl">2.</span>
            <div>
              <div class="text-white">Consumers read at their offset</div>
              <div class="text-gray-500 text-sm">Multiple consumers can read same message</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
            <span class="text-2xl">3.</span>
            <div>
              <div class="text-white">Retention policy deletes old messages</div>
              <div class="text-gray-500 text-sm">After 7 days or 1GB (configurable)</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 class="text-lg font-semibold text-green-400 mb-4">RabbitMQ: Queue-Based</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
            <span class="text-2xl">1.</span>
            <div>
              <div class="text-white">Message routed to queue(s)</div>
              <div class="text-gray-500 text-sm">Exchange determines destination</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
            <span class="text-2xl">2.</span>
            <div>
              <div class="text-white">Broker pushes to consumer</div>
              <div class="text-gray-500 text-sm">One consumer receives each message</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
            <span class="text-2xl">3.</span>
            <div>
              <div class="text-white">Consumer acknowledges</div>
              <div class="text-gray-500 text-sm">Message deleted from queue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Feature Comparison -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Feature Comparison</h2>

    <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="text-left p-4 text-gray-400 font-medium">Feature</th>
            <th class="text-left p-4 text-orange-400 font-medium">Kafka</th>
            <th class="text-left p-4 text-green-400 font-medium">RabbitMQ</th>
          </tr>
        </thead>
        <tbody>
          {#each features as feature, i}
            <tr class="border-b border-gray-700/50 {i % 2 === 0 ? 'bg-gray-800/30' : ''}">
              <td class="p-4 text-white font-medium">{feature.name}</td>
              <td class="p-4 text-gray-300">{feature.kafka}</td>
              <td class="p-4 text-gray-300">{feature.rabbitmq}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <!-- When to Use -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">When to Use Each</h2>
    <ComparisonTable options={comparisonOptions} />
  </section>

  <!-- Exchange Types (RabbitMQ) -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">RabbitMQ Routing Patterns</h2>
    <p class="text-gray-400 mb-4">RabbitMQ's flexible exchange types enable complex routing scenarios that Kafka cannot do natively.</p>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-green-400 font-semibold mb-2">Direct</div>
        <div class="text-gray-400 text-sm">Route by exact routing key match</div>
        <div class="mt-2 text-xs text-gray-500">order.created to orders queue</div>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-green-400 font-semibold mb-2">Topic</div>
        <div class="text-gray-400 text-sm">Route by pattern matching (*.error)</div>
        <div class="mt-2 text-xs text-gray-500">app.*.error to error-handler</div>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-green-400 font-semibold mb-2">Fanout</div>
        <div class="text-gray-400 text-sm">Broadcast to all bound queues</div>
        <div class="mt-2 text-xs text-gray-500">notification to all subscribers</div>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-green-400 font-semibold mb-2">Headers</div>
        <div class="text-gray-400 text-sm">Route by message headers</div>
        <div class="mt-2 text-xs text-gray-500">x-priority: high to fast queue</div>
      </div>
    </div>
  </section>

  <!-- Kafka Partitions -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Kafka Partitioning</h2>
    <p class="text-gray-400 mb-4">Kafka achieves scalability through partitions - each partition is an ordered, immutable log.</p>

    <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div class="grid md:grid-cols-3 gap-4 mb-6">
        <div class="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
          <div class="text-orange-400 font-semibold mb-1">Partition 0</div>
          <div class="flex gap-1">
            {#each [0, 1, 2, 3, 4] as offset}
              <div class="w-8 h-8 bg-orange-500/30 rounded flex items-center justify-center text-xs text-orange-300">{offset}</div>
            {/each}
          </div>
        </div>
        <div class="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
          <div class="text-orange-400 font-semibold mb-1">Partition 1</div>
          <div class="flex gap-1">
            {#each [0, 1, 2, 3] as offset}
              <div class="w-8 h-8 bg-orange-500/30 rounded flex items-center justify-center text-xs text-orange-300">{offset}</div>
            {/each}
          </div>
        </div>
        <div class="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
          <div class="text-orange-400 font-semibold mb-1">Partition 2</div>
          <div class="flex gap-1">
            {#each [0, 1, 2, 3, 4, 5] as offset}
              <div class="w-8 h-8 bg-orange-500/30 rounded flex items-center justify-center text-xs text-orange-300">{offset}</div>
            {/each}
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <div class="text-white font-medium">Ordering</div>
          <div class="text-gray-400">Guaranteed within partition only</div>
        </div>
        <div>
          <div class="text-white font-medium">Parallelism</div>
          <div class="text-gray-400">Max consumers = number of partitions</div>
        </div>
        <div>
          <div class="text-white font-medium">Key-based routing</div>
          <div class="text-gray-400">Same key always goes to same partition</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Use Case Examples -->
  <section>
    <h2 class="text-xl font-semibold text-white mb-4">Real World Examples</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-gray-800/50 rounded-xl p-6 border border-orange-500/30">
        <h3 class="text-lg font-semibold text-orange-400 mb-4">Kafka Use Cases</h3>
        <div class="space-y-3">
          <div class="p-3 bg-gray-700/50 rounded-lg">
            <div class="text-white font-medium">Real-time Analytics</div>
            <div class="text-gray-400 text-sm">Stream clickstream data to analytics pipeline</div>
          </div>
          <div class="p-3 bg-gray-700/50 rounded-lg">
            <div class="text-white font-medium">Event Sourcing</div>
            <div class="text-gray-400 text-sm">Store all state changes as immutable events</div>
          </div>
          <div class="p-3 bg-gray-700/50 rounded-lg">
            <div class="text-white font-medium">Log Aggregation</div>
            <div class="text-gray-400 text-sm">Centralize logs from thousands of services</div>
          </div>
          <div class="p-3 bg-gray-700/50 rounded-lg">
            <div class="text-white font-medium">CDC Pipelines</div>
            <div class="text-gray-400 text-sm">Stream database changes to data warehouse</div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800/50 rounded-xl p-6 border border-green-500/30">
        <h3 class="text-lg font-semibold text-green-400 mb-4">RabbitMQ Use Cases</h3>
        <div class="space-y-3">
          <div class="p-3 bg-gray-700/50 rounded-lg">
            <div class="text-white font-medium">Task Queues</div>
            <div class="text-gray-400 text-sm">Background job processing with retries</div>
          </div>
          <div class="p-3 bg-gray-700/50 rounded-lg">
            <div class="text-white font-medium">Microservices</div>
            <div class="text-gray-400 text-sm">Async communication between services</div>
          </div>
          <div class="p-3 bg-gray-700/50 rounded-lg">
            <div class="text-white font-medium">IoT Messaging</div>
            <div class="text-gray-400 text-sm">MQTT protocol for device communication</div>
          </div>
          <div class="p-3 bg-gray-700/50 rounded-lg">
            <div class="text-white font-medium">Request/Reply</div>
            <div class="text-gray-400 text-sm">RPC-style communication patterns</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

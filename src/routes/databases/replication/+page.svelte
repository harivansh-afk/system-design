<script lang="ts">
  import ComparisonTable from '$lib/components/diagrams/ComparisonTable.svelte';

  let selectedType: 'sync' | 'async' | null = null;

  const replicationTypes = [
    {
      id: 'leader-follower',
      name: 'Leader-Follower (Primary-Replica)',
      description: 'One leader handles writes, followers replicate and serve reads',
      pros: [
        'Simple to understand and implement',
        'Read scalability (add more followers)',
        'Automatic failover possible'
      ],
      cons: [
        'Single point of failure for writes',
        'Replication lag can cause stale reads',
        'Failover can cause data loss'
      ],
      useCase: 'Most common - PostgreSQL, MySQL, MongoDB'
    },
    {
      id: 'multi-leader',
      name: 'Multi-Leader (Master-Master)',
      description: 'Multiple nodes accept writes, replicate to each other',
      pros: [
        'Write availability in multiple regions',
        'Lower write latency (local writes)',
        'No single point of failure'
      ],
      cons: [
        'Conflict resolution is complex',
        'Harder to reason about consistency',
        'More network traffic'
      ],
      useCase: 'Multi-datacenter deployments, CRDTs'
    },
    {
      id: 'leaderless',
      name: 'Leaderless',
      description: 'Any node can accept reads and writes (quorum-based)',
      pros: [
        'No single point of failure',
        'High availability',
        'Tunable consistency'
      ],
      cons: [
        'Quorum overhead on every write',
        'Complex conflict resolution',
        'Harder to achieve strong consistency'
      ],
      useCase: 'DynamoDB, Cassandra, Riak'
    }
  ];

  const comparisonOptions = [
    {
      id: 'sync',
      name: 'Synchronous Replication',
      description: 'Wait for replica confirmation before acknowledging write',
      whenToUse: [
        'Zero data loss is critical (financial systems)',
        'Strong consistency required',
        'Regulatory compliance (GDPR, SOC2)',
        'Hot standby for instant failover',
        'Replicas in same datacenter (low latency)'
      ],
      whenNotToUse: [
        'Replicas are geographically distant',
        'Write latency is critical',
        'High write throughput needed',
        'Some data loss is acceptable'
      ]
    },
    {
      id: 'async',
      name: 'Asynchronous Replication',
      description: 'Acknowledge write immediately, replicate in background',
      whenToUse: [
        'Geographic distribution (cross-region)',
        'Write performance is priority',
        'Read scaling is the goal',
        'Some data loss on failover is acceptable',
        'Analytics/reporting replicas'
      ],
      whenNotToUse: [
        'Cannot tolerate any data loss',
        'Need strong consistency guarantees',
        'Regulatory requirements for durability',
        'Reads must always be consistent'
      ]
    }
  ];

  const lagMetrics = [
    { name: 'Write Position', desc: 'Where leader has written (WAL/binlog position)' },
    { name: 'Sent Position', desc: 'What has been sent to replica' },
    { name: 'Flush Position', desc: 'What replica has written to disk' },
    { name: 'Replay Position', desc: 'What replica has applied to database' }
  ];
</script>

<svelte:head>
  <title>Database Replication</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <h1 class="text-3xl font-bold text-white mb-2">Database Replication</h1>
  <p class="text-gray-400 mb-8">Understanding replication topologies, sync vs async, and consistency trade-offs</p>

  <!-- Why Replication -->
  <section class="mb-12">
    <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-gray-700">
      <h2 class="text-lg font-semibold text-white mb-4">Why Replicate?</h2>
      <div class="grid md:grid-cols-4 gap-4">
        <div class="p-4 bg-gray-800/50 rounded-lg text-center">
          <div class="text-2xl mb-2">HA</div>
          <div class="text-white font-medium">High Availability</div>
          <div class="text-gray-400 text-sm mt-1">Survive node failures</div>
        </div>
        <div class="p-4 bg-gray-800/50 rounded-lg text-center">
          <div class="text-2xl mb-2">R</div>
          <div class="text-white font-medium">Read Scaling</div>
          <div class="text-gray-400 text-sm mt-1">Distribute read load</div>
        </div>
        <div class="p-4 bg-gray-800/50 rounded-lg text-center">
          <div class="text-2xl mb-2">GEO</div>
          <div class="text-white font-medium">Geographic</div>
          <div class="text-gray-400 text-sm mt-1">Data closer to users</div>
        </div>
        <div class="p-4 bg-gray-800/50 rounded-lg text-center">
          <div class="text-2xl mb-2">DR</div>
          <div class="text-white font-medium">Disaster Recovery</div>
          <div class="text-gray-400 text-sm mt-1">Backup in another region</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Sync vs Async Toggle -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Synchronous vs Asynchronous</h2>

    <div class="flex gap-4 mb-6">
      <button
        class="px-4 py-2 rounded-lg font-medium transition-all
          {selectedType === 'sync' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        on:click={() => selectedType = selectedType === 'sync' ? null : 'sync'}
      >
        Synchronous
      </button>
      <button
        class="px-4 py-2 rounded-lg font-medium transition-all
          {selectedType === 'async' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        on:click={() => selectedType = selectedType === 'async' ? null : 'async'}
      >
        Asynchronous
      </button>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Sync -->
      <div class="bg-gray-800/50 rounded-xl p-6 border {selectedType === 'sync' ? 'border-blue-500' : 'border-gray-700'}">
        <h3 class="text-lg font-semibold text-blue-400 mb-4">Synchronous Replication</h3>

        <div class="space-y-3 mb-6">
          <div class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
            <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
            <div class="flex-1">
              <div class="text-white text-sm">Client writes to leader</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
            <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">2</div>
            <div class="flex-1">
              <div class="text-white text-sm">Leader sends to replica</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <div class="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400 font-bold">3</div>
            <div class="flex-1">
              <div class="text-white text-sm font-medium">WAIT for replica confirmation</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
            <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">4</div>
            <div class="flex-1">
              <div class="text-white text-sm">Acknowledge to client</div>
            </div>
          </div>
        </div>

        <div class="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div class="text-blue-300 text-sm">Guarantee: Data exists on N nodes before success</div>
        </div>
      </div>

      <!-- Async -->
      <div class="bg-gray-800/50 rounded-xl p-6 border {selectedType === 'async' ? 'border-green-500' : 'border-gray-700'}">
        <h3 class="text-lg font-semibold text-green-400 mb-4">Asynchronous Replication</h3>

        <div class="space-y-3 mb-6">
          <div class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
            <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">1</div>
            <div class="flex-1">
              <div class="text-white text-sm">Client writes to leader</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
            <div class="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center text-green-400 font-bold">2</div>
            <div class="flex-1">
              <div class="text-white text-sm font-medium">Acknowledge immediately</div>
            </div>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg opacity-60">
            <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">3</div>
            <div class="flex-1">
              <div class="text-white text-sm">Replicate in background</div>
              <div class="text-gray-500 text-xs">May lag behind leader</div>
            </div>
          </div>
        </div>

        <div class="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
          <div class="text-green-300 text-sm">Trade-off: Faster writes, but possible data loss on failover</div>
        </div>
      </div>
    </div>
  </section>

  <!-- When to Use Each -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">When to Use Each</h2>
    <ComparisonTable options={comparisonOptions} />
  </section>

  <!-- Replication Topologies -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Replication Topologies</h2>

    <div class="space-y-6">
      {#each replicationTypes as type}
        <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white">{type.name}</h3>
              <p class="text-gray-400 text-sm">{type.description}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
              {type.useCase}
            </span>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="text-green-400 font-medium mb-2 text-sm">Pros</h4>
              <ul class="space-y-1">
                {#each type.pros as pro}
                  <li class="text-gray-300 text-sm flex items-start gap-2">
                    <span class="text-green-400">+</span>
                    {pro}
                  </li>
                {/each}
              </ul>
            </div>
            <div>
              <h4 class="text-red-400 font-medium mb-2 text-sm">Cons</h4>
              <ul class="space-y-1">
                {#each type.cons as con}
                  <li class="text-gray-300 text-sm flex items-start gap-2">
                    <span class="text-red-400">-</span>
                    {con}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Replication Lag -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Understanding Replication Lag</h2>

    <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <p class="text-gray-400 mb-6">
        Replication lag is the delay between when data is written to the leader and when it appears on replicas.
        Multiple metrics help pinpoint where the lag is occurring.
      </p>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {#each lagMetrics as metric, i}
          <div class="p-4 bg-gray-700/50 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">{i + 1}</div>
              <span class="text-white font-medium text-sm">{metric.name}</span>
            </div>
            <p class="text-gray-400 text-xs">{metric.desc}</p>
          </div>
        {/each}
      </div>

      <div class="bg-gray-700/50 rounded-lg p-4">
        <h4 class="text-white font-medium mb-2">PostgreSQL: Check Replication Lag</h4>
        <pre class="text-sm text-gray-300 overflow-x-auto"><code>SELECT client_addr, state,
  pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes,
  replay_lag
FROM pg_stat_replication;</code></pre>
      </div>
    </div>
  </section>

  <!-- Failover -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Failover Considerations</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30">
        <h3 class="text-yellow-400 font-semibold mb-4">Automatic Failover</h3>
        <p class="text-gray-400 text-sm mb-4">
          System automatically promotes replica when leader fails. Fast recovery but risks split-brain.
        </p>
        <ul class="space-y-2 text-sm">
          <li class="flex items-start gap-2 text-gray-300">
            <span class="text-yellow-400">!</span>
            Requires proper fencing to prevent split-brain
          </li>
          <li class="flex items-start gap-2 text-gray-300">
            <span class="text-yellow-400">!</span>
            May lose uncommitted transactions (async)
          </li>
          <li class="flex items-start gap-2 text-gray-300">
            <span class="text-yellow-400">!</span>
            Applications may need reconnection logic
          </li>
        </ul>
      </div>

      <div class="bg-gray-800/50 rounded-xl p-6 border border-blue-500/30">
        <h3 class="text-blue-400 font-semibold mb-4">Manual Failover</h3>
        <p class="text-gray-400 text-sm mb-4">
          Operator manually promotes replica after verifying state. Slower but safer.
        </p>
        <ul class="space-y-2 text-sm">
          <li class="flex items-start gap-2 text-gray-300">
            <span class="text-blue-400">-</span>
            Verify replica is fully caught up
          </li>
          <li class="flex items-start gap-2 text-gray-300">
            <span class="text-blue-400">-</span>
            Stop writes to old leader first
          </li>
          <li class="flex items-start gap-2 text-gray-300">
            <span class="text-blue-400">-</span>
            Update DNS/connection strings
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Common Patterns -->
  <section>
    <h2 class="text-xl font-semibold text-white mb-4">Common Patterns</h2>

    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-blue-400 font-semibold mb-2">Read Replicas</div>
        <p class="text-gray-400 text-sm">Route reads to replicas, writes to leader. Scale read capacity horizontally.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-green-400 font-semibold mb-2">Hot Standby</div>
        <p class="text-gray-400 text-sm">Sync replica ready for instant failover. Zero data loss guarantee.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-purple-400 font-semibold mb-2">Delayed Replica</div>
        <p class="text-gray-400 text-sm">Intentionally lag behind. Protection against accidental deletes.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-orange-400 font-semibold mb-2">Cascading Replication</div>
        <p class="text-gray-400 text-sm">Replicas replicate to other replicas. Reduce load on leader.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-red-400 font-semibold mb-2">Cross-Region Replica</div>
        <p class="text-gray-400 text-sm">Async replica in another region. Disaster recovery and local reads.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-cyan-400 font-semibold mb-2">Logical Replication</div>
        <p class="text-gray-400 text-sm">Replicate specific tables/databases. Schema changes, version upgrades.</p>
      </div>
    </div>
  </section>
</div>

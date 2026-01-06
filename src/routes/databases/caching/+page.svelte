<script lang="ts">
  import GuidedWalkthrough from '$lib/components/diagrams/GuidedWalkthrough.svelte';

  let selectedPattern: string | null = null;

  const patterns = [
    {
      id: 'cache-aside',
      name: 'Cache-Aside (Lazy Loading)',
      description: 'Application manages the cache - loads data on cache miss',
      color: 'blue',
      steps: [
        'Application checks cache for data',
        'If cache hit: return cached data',
        'If cache miss: query database',
        'Store result in cache',
        'Return data to caller'
      ],
      pros: [
        'Only caches what is actually used',
        'Simple to implement',
        'Cache failure does not break the app',
        'Works with any database'
      ],
      cons: [
        'First request always slow (cache miss)',
        'Data can become stale',
        'Application must handle cache logic'
      ],
      useCase: 'Read-heavy workloads with infrequent updates'
    },
    {
      id: 'write-through',
      name: 'Write-Through',
      description: 'Data written to cache and database simultaneously',
      color: 'green',
      steps: [
        'Application writes data',
        'Write to cache first',
        'Write to database',
        'Both writes must succeed',
        'Return success to caller'
      ],
      pros: [
        'Cache always has fresh data',
        'No stale data issues',
        'Simple mental model'
      ],
      cons: [
        'Write latency increased (two writes)',
        'Cache may have unused data',
        'Risk of inconsistency if one write fails'
      ],
      useCase: 'Data that is read immediately after writing'
    },
    {
      id: 'write-behind',
      name: 'Write-Behind (Write-Back)',
      description: 'Write to cache immediately, async write to database later',
      color: 'purple',
      steps: [
        'Application writes data',
        'Write to cache immediately',
        'Return success to caller',
        'Async: batch writes to database',
        'Confirm persistence'
      ],
      pros: [
        'Fastest write performance',
        'Batches database writes',
        'Reduces database load'
      ],
      cons: [
        'Risk of data loss if cache fails',
        'Complex to implement correctly',
        'Eventual consistency'
      ],
      useCase: 'Write-heavy workloads where some data loss is acceptable'
    },
    {
      id: 'read-through',
      name: 'Read-Through',
      description: 'Cache automatically fetches from database on miss',
      color: 'orange',
      steps: [
        'Application requests data from cache',
        'Cache checks if data exists',
        'If miss: cache fetches from database',
        'Cache stores and returns data',
        'Subsequent reads served from cache'
      ],
      pros: [
        'Simpler application code',
        'Cache handles all logic',
        'Consistent caching behavior'
      ],
      cons: [
        'Cache must understand data source',
        'First request still slow',
        'Less flexible than cache-aside'
      ],
      useCase: 'When you want caching logic abstracted from application'
    },
    {
      id: 'refresh-ahead',
      name: 'Refresh-Ahead (Pre-fetching)',
      description: 'Proactively refresh cache before expiration',
      color: 'pink',
      steps: [
        'Cache tracks TTL of entries',
        'Before TTL expires, trigger refresh',
        'Fetch fresh data from database',
        'Update cache in background',
        'Users always get cached data'
      ],
      pros: [
        'No cache miss latency',
        'Always fresh data',
        'Predictable performance'
      ],
      cons: [
        'Complex to implement',
        'May refresh unused data',
        'Higher database load'
      ],
      useCase: 'Hot data that must always be fast and fresh'
    }
  ];

  const evictionStrategies = [
    {
      name: 'LRU (Least Recently Used)',
      description: 'Evict the item that has not been accessed for the longest time',
      best: 'General purpose, most common'
    },
    {
      name: 'LFU (Least Frequently Used)',
      description: 'Evict the item with the fewest accesses',
      best: 'When access frequency matters more than recency'
    },
    {
      name: 'FIFO (First In, First Out)',
      description: 'Evict the oldest item regardless of access pattern',
      best: 'Simple, predictable behavior'
    },
    {
      name: 'TTL (Time To Live)',
      description: 'Evict when time expires, regardless of space',
      best: 'Data that becomes stale over time'
    },
    {
      name: 'Random',
      description: 'Evict a random item',
      best: 'When access patterns are unpredictable'
    }
  ];

  const cacheAsideWalkthrough = {
    title: 'Cache-Aside Pattern Flow',
    steps: [
      {
        id: 'cache-aside-1',
        title: 'Application Requests Data',
        description: 'User requests user profile for user_id=123',
        details: 'The application receives a request that needs data from the database.',
        tip: 'Common entry point: API endpoint, service method.'
      },
      {
        id: 'cache-aside-2',
        title: 'Check Cache First',
        description: 'GET user:123 from Redis',
        details: 'Application checks if the data exists in cache before hitting the database.',
        tip: 'Use consistent key naming: entity:id. Handle cache connection failures gracefully.'
      },
      {
        id: 'cache-aside-3',
        title: 'Cache Hit - Return Immediately',
        description: 'Data found! Return cached user profile',
        details: 'If data is in cache, return it immediately. This is the fast path.',
        tip: 'Typical cache hit latency: < 1ms. Log cache hits for monitoring.'
      },
      {
        id: 'cache-aside-4',
        title: 'Cache Miss - Query Database',
        description: 'SELECT * FROM users WHERE id = 123',
        details: 'If cache miss, query the primary database for the data.',
        tip: 'This is the slow path. Consider query optimization.'
      },
      {
        id: 'cache-aside-5',
        title: 'Store in Cache',
        description: 'SET user:123 with TTL 3600 seconds',
        details: 'After getting data from DB, store it in cache for future requests.',
        tip: 'Always set a TTL to prevent stale data. Consider cache size limits.'
      },
      {
        id: 'cache-aside-6',
        title: 'Return Data to Caller',
        description: 'Return user profile to client',
        details: 'Finally return the data. Next request will hit the cache.',
        tip: 'Monitor cache hit rate. Aim for > 90% hit rate.'
      }
    ]
  };
</script>

<svelte:head>
  <title>Caching Patterns</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <h1 class="text-3xl font-bold text-surface-100 mb-2">Caching Patterns</h1>
  <p class="text-surface-400 mb-8">Understanding different caching strategies and when to use each</p>

  <!-- Overview -->
  <section class="mb-12">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-4">Why Caching Matters</h2>
      <div class="grid md:grid-cols-4 gap-4 text-center">
        <div class="p-4 bg-surface-800/60 border border-surface-800 rounded-lg">
          <div class="text-3xl font-bold text-blue-400">10-100x</div>
          <div class="text-surface-400 text-sm">Faster than database</div>
        </div>
        <div class="p-4 bg-surface-800/60 border border-surface-800 rounded-lg">
          <div class="text-3xl font-bold text-green-400">&lt;1ms</div>
          <div class="text-surface-400 text-sm">Cache read latency</div>
        </div>
        <div class="p-4 bg-surface-800/60 border border-surface-800 rounded-lg">
          <div class="text-3xl font-bold text-purple-400">90%+</div>
          <div class="text-surface-400 text-sm">Target hit rate</div>
        </div>
        <div class="p-4 bg-surface-800/60 border border-surface-800 rounded-lg">
          <div class="text-3xl font-bold text-orange-400">$$$</div>
          <div class="text-surface-400 text-sm">Reduced DB costs</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Pattern Cards -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Caching Patterns</h2>

    <div class="grid gap-6">
      {#each patterns as pattern}
        <div
          class="bg-surface-900 rounded-xl border border-surface-800 overflow-hidden cursor-pointer transition-colors hover:border-surface-700"
          class:border-blue-500={selectedPattern === pattern.id && pattern.color === 'blue'}
          class:border-green-500={selectedPattern === pattern.id && pattern.color === 'green'}
          class:border-purple-500={selectedPattern === pattern.id && pattern.color === 'purple'}
          class:border-orange-500={selectedPattern === pattern.id && pattern.color === 'orange'}
          class:border-pink-500={selectedPattern === pattern.id && pattern.color === 'pink'}
          on:click={() => selectedPattern = selectedPattern === pattern.id ? null : pattern.id}
          on:keydown={(e) => e.key === 'Enter' && (selectedPattern = selectedPattern === pattern.id ? null : pattern.id)}
          role="button"
          tabindex="0"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-surface-100">{pattern.name}</h3>
                <p class="text-surface-400 text-sm">{pattern.description}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium
                {pattern.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : ''}
                {pattern.color === 'green' ? 'bg-green-500/20 text-green-400' : ''}
                {pattern.color === 'purple' ? 'bg-purple-500/20 text-purple-400' : ''}
                {pattern.color === 'orange' ? 'bg-orange-500/20 text-orange-400' : ''}
                {pattern.color === 'pink' ? 'bg-pink-500/20 text-pink-400' : ''}">
                {pattern.useCase}
              </span>
            </div>

            <!-- Flow Steps -->
            <div class="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              {#each pattern.steps as step, i}
                <div class="flex items-center">
                  <div class="px-3 py-2 bg-surface-800/60 border border-surface-800 rounded-lg text-sm text-surface-300 whitespace-nowrap">
                    {step}
                  </div>
                  {#if i < pattern.steps.length - 1}
                    <span class="mx-2 text-surface-600">-></span>
                  {/if}
                </div>
              {/each}
            </div>

            {#if selectedPattern === pattern.id}
              <div class="grid md:grid-cols-2 gap-4 pt-4 border-t border-surface-800">
                <div>
                  <h4 class="text-green-400 font-medium mb-2">Pros</h4>
                  <ul class="space-y-1">
                    {#each pattern.pros as pro}
                      <li class="text-surface-300 text-sm flex items-start gap-2">
                        <span class="text-green-400">+</span>
                        {pro}
                      </li>
                    {/each}
                  </ul>
                </div>
                <div>
                  <h4 class="text-red-400 font-medium mb-2">Cons</h4>
                  <ul class="space-y-1">
                    {#each pattern.cons as con}
                      <li class="text-surface-300 text-sm flex items-start gap-2">
                        <span class="text-red-400">-</span>
                        {con}
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Cache-Aside Walkthrough -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Cache-Aside in Detail</h2>
    <p class="text-surface-400 mb-6">The most common caching pattern - walk through each step.</p>
    <GuidedWalkthrough {...cacheAsideWalkthrough} />
  </section>

  <!-- Eviction Strategies -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Eviction Strategies</h2>
    <p class="text-surface-400 mb-6">When cache is full, which items should be removed?</p>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each evictionStrategies as strategy}
        <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
          <h3 class="text-surface-100 font-semibold mb-2">{strategy.name}</h3>
          <p class="text-surface-400 text-sm mb-3">{strategy.description}</p>
          <div class="text-xs text-blue-400">Best for: {strategy.best}</div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Common Issues -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Common Caching Problems</h2>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="card border-red-500/30">
        <h3 class="text-red-400 font-semibold mb-3">Cache Stampede</h3>
        <p class="text-surface-400 text-sm mb-4">
          Many requests hit an expired cache key simultaneously, all querying the database at once.
        </p>
        <div class="p-3 bg-surface-800/60 border border-surface-800 rounded-lg">
          <div class="text-green-400 text-sm font-medium mb-1">Solutions:</div>
          <ul class="text-surface-300 text-sm space-y-1">
            <li>- Lock/mutex on cache refresh</li>
            <li>- Staggered TTLs</li>
            <li>- Background refresh</li>
          </ul>
        </div>
      </div>

      <div class="card border-yellow-500/30">
        <h3 class="text-yellow-400 font-semibold mb-3">Stale Data</h3>
        <p class="text-surface-400 text-sm mb-4">
          Cache contains outdated data that does not reflect current database state.
        </p>
        <div class="p-3 bg-surface-800/60 border border-surface-800 rounded-lg">
          <div class="text-green-400 text-sm font-medium mb-1">Solutions:</div>
          <ul class="text-surface-300 text-sm space-y-1">
            <li>- Appropriate TTL values</li>
            <li>- Cache invalidation on writes</li>
            <li>- Write-through pattern</li>
          </ul>
        </div>
      </div>

      <div class="card border-orange-500/30">
        <h3 class="text-orange-400 font-semibold mb-3">Cache Penetration</h3>
        <p class="text-surface-400 text-sm mb-4">
          Requests for non-existent data bypass cache and always hit the database.
        </p>
        <div class="p-3 bg-surface-800/60 border border-surface-800 rounded-lg">
          <div class="text-green-400 text-sm font-medium mb-1">Solutions:</div>
          <ul class="text-surface-300 text-sm space-y-1">
            <li>- Cache negative results</li>
            <li>- Bloom filter for existence check</li>
            <li>- Input validation</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Redis vs Memcached -->
  <section>
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Redis vs Memcached</h2>

    <div class="bg-surface-900 rounded-xl border border-surface-800 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-surface-800">
            <th class="text-left p-4 text-surface-400 font-medium">Feature</th>
            <th class="text-left p-4 text-red-400 font-medium">Redis</th>
            <th class="text-left p-4 text-green-400 font-medium">Memcached</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-surface-800">
            <td class="p-4 text-surface-100">Data Structures</td>
            <td class="p-4 text-surface-300">Strings, Lists, Sets, Hashes, Sorted Sets</td>
            <td class="p-4 text-surface-300">Strings only</td>
          </tr>
          <tr class="border-b border-surface-800 bg-surface-950/40">
            <td class="p-4 text-surface-100">Persistence</td>
            <td class="p-4 text-surface-300">Yes (RDB, AOF)</td>
            <td class="p-4 text-surface-300">No</td>
          </tr>
          <tr class="border-b border-surface-800">
            <td class="p-4 text-surface-100">Replication</td>
            <td class="p-4 text-surface-300">Built-in</td>
            <td class="p-4 text-surface-300">No</td>
          </tr>
          <tr class="border-b border-surface-800 bg-surface-950/40">
            <td class="p-4 text-surface-100">Pub/Sub</td>
            <td class="p-4 text-surface-300">Yes</td>
            <td class="p-4 text-surface-300">No</td>
          </tr>
          <tr class="border-b border-surface-800">
            <td class="p-4 text-surface-100">Lua Scripting</td>
            <td class="p-4 text-surface-300">Yes</td>
            <td class="p-4 text-surface-300">No</td>
          </tr>
          <tr class="border-b border-surface-800 bg-surface-950/40">
            <td class="p-4 text-surface-100">Memory Efficiency</td>
            <td class="p-4 text-surface-300">Good</td>
            <td class="p-4 text-surface-300">Better (simpler)</td>
          </tr>
          <tr>
            <td class="p-4 text-surface-100">Best For</td>
            <td class="p-4 text-surface-300">Feature-rich caching, sessions, queues</td>
            <td class="p-4 text-surface-300">Simple, high-throughput key-value cache</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</div>

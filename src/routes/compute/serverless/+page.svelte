<script lang="ts">
  import GuidedWalkthrough from '$lib/components/diagrams/GuidedWalkthrough.svelte';

  let showColdStart = true;

  const coldStartPhases = [
    { name: 'Container Provisioning', duration: '~100ms', desc: 'Allocate compute resources based on memory config' },
    { name: 'Runtime Init', duration: '~50-200ms', desc: 'Load language runtime (Node.js, Python, Java)' },
    { name: 'Code Loading', duration: 'Variable', desc: 'Download and unpack function code' },
    { name: 'Dependency Init', duration: 'Variable', desc: 'Load libraries and initialize connections' }
  ];

  const optimizations = [
    {
      category: 'Code Optimization',
      items: [
        { name: 'Minimize package size', desc: 'Remove unused dependencies, use tree shaking', impact: 'High' },
        { name: 'Use lightweight libraries', desc: 'Choose smaller alternatives (e.g., date-fns over moment)', impact: 'Medium' },
        { name: 'Lazy load dependencies', desc: 'Only import modules when needed', impact: 'Medium' },
        { name: 'Use compiled languages', desc: 'Rust, Go have faster cold starts than Java', impact: 'High' }
      ]
    },
    {
      category: 'AWS Features',
      items: [
        { name: 'Provisioned Concurrency', desc: 'Pre-warm instances that are always ready', impact: 'Eliminates' },
        { name: 'SnapStart (Java/Python/.NET)', desc: 'Snapshot initialized state for faster restore', impact: 'High' },
        { name: 'Increase memory', desc: 'More memory = more CPU = faster init', impact: 'Medium' },
        { name: 'Use ARM (Graviton)', desc: 'Better price/performance ratio', impact: 'Low' }
      ]
    },
    {
      category: 'Architecture',
      items: [
        { name: 'Keep functions warm', desc: 'Schedule periodic invocations', impact: 'Medium' },
        { name: 'Avoid VPC when possible', desc: 'VPC adds ENI setup time', impact: 'Medium' },
        { name: 'Connection pooling', desc: 'Reuse DB connections across invocations', impact: 'Medium' },
        { name: 'Smaller functions', desc: 'Split large functions into focused units', impact: 'Medium' }
      ]
    }
  ];

  const runtimeComparison = [
    { runtime: 'Python', coldStart: '~200-400ms', warmStart: '~1-5ms', notes: 'Fast init, good for most use cases' },
    { runtime: 'Node.js', coldStart: '~200-400ms', warmStart: '~1-5ms', notes: 'Fast init, large ecosystem' },
    { runtime: 'Go', coldStart: '~100-200ms', warmStart: '<1ms', notes: 'Compiled, very fast' },
    { runtime: 'Rust', coldStart: '~100-200ms', warmStart: '<1ms', notes: 'Compiled, fastest cold starts' },
    { runtime: 'Java', coldStart: '~1-3s', warmStart: '~5-20ms', notes: 'JVM warmup, use SnapStart' },
    { runtime: '.NET', coldStart: '~500ms-1s', warmStart: '~5-10ms', notes: 'CLR init, improving with AOT' }
  ];

  const coldStartWalkthrough = {
    title: 'Lambda Cold Start Flow',
    steps: [
      {
        title: 'Invocation Request',
        content: 'API Gateway triggers Lambda function',
        details: 'A request arrives but no warm execution environment is available.',
        tips: ['Cold starts affect ~1% of requests', 'More common during traffic spikes']
      },
      {
        title: 'Container Provisioning',
        content: 'Lambda allocates compute resources',
        details: 'AWS provisions a micro-VM with the configured memory. More memory = more CPU.',
        tips: ['Memory range: 128MB - 10GB', 'CPU scales proportionally with memory']
      },
      {
        title: 'Runtime Initialization',
        content: 'Load Python/Node.js/Java runtime',
        details: 'The language runtime is loaded and initialized in the container.',
        tips: ['Python/Node.js: ~100-200ms', 'Java: ~500ms-1s (JVM startup)']
      },
      {
        title: 'Function Code Loading',
        content: 'Download and extract deployment package',
        details: 'Your code is downloaded from S3 and extracted. Larger packages take longer.',
        tips: ['Keep deployment package small', 'Use Lambda Layers for shared code']
      },
      {
        title: 'Static Initialization',
        content: 'Run code outside handler (global scope)',
        details: 'Code at module level runs once per container. Initialize DB connections here.',
        tips: ['Initialize SDK clients outside handler', 'This code runs once per container lifecycle']
      },
      {
        title: 'Handler Execution',
        content: 'Your function code runs',
        details: 'Finally, your handler function executes. Container is now "warm".',
        tips: ['Subsequent invocations skip steps 1-5', 'Warm container reused for ~15 minutes']
      }
    ]
  };
</script>

<svelte:head>
  <title>Serverless - Cold & Warm Starts</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <h1 class="text-3xl font-bold text-white mb-2">Serverless Computing</h1>
  <p class="text-gray-400 mb-8">Understanding cold starts, warm starts, and optimization strategies</p>

  <!-- Cold vs Warm Visual -->
  <section class="mb-12">
    <div class="flex gap-4 mb-6">
      <button
        class="px-4 py-2 rounded-lg font-medium transition-all
          {showColdStart ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        on:click={() => showColdStart = true}
      >
        Cold Start
      </button>
      <button
        class="px-4 py-2 rounded-lg font-medium transition-all
          {!showColdStart ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        on:click={() => showColdStart = false}
      >
        Warm Start
      </button>
    </div>

    <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      {#if showColdStart}
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-blue-400 mb-2">Cold Start</h3>
          <p class="text-gray-400">No existing execution environment - must provision new container</p>
        </div>

        <!-- Cold Start Timeline -->
        <div class="relative">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/30 rounded"></div>
          <div class="space-y-4 pl-8">
            {#each coldStartPhases as phase, i}
              <div class="relative">
                <div class="absolute -left-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-gray-800"></div>
                <div class="bg-gray-700/50 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-white font-medium">{phase.name}</span>
                    <span class="text-blue-400 text-sm font-mono">{phase.duration}</span>
                  </div>
                  <p class="text-gray-400 text-sm">{phase.desc}</p>
                </div>
              </div>
            {/each}
            <div class="relative">
              <div class="absolute -left-8 w-4 h-4 rounded-full bg-green-500 border-4 border-gray-800"></div>
              <div class="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-white font-medium">Handler Execution</span>
                  <span class="text-green-400 text-sm font-mono">Your code</span>
                </div>
                <p class="text-gray-400 text-sm">Finally, your function handler runs</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div class="text-blue-300 font-medium">Total Cold Start: 200ms - 3s+</div>
          <div class="text-gray-400 text-sm mt-1">Depends on runtime, package size, and dependencies</div>
        </div>
      {:else}
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-green-400 mb-2">Warm Start</h3>
          <p class="text-gray-400">Reuses existing execution environment - skips initialization</p>
        </div>

        <div class="relative">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-gray-600 rounded"></div>
          <div class="space-y-4 pl-8">
            {#each coldStartPhases as phase}
              <div class="relative opacity-40">
                <div class="absolute -left-8 w-4 h-4 rounded-full bg-gray-600 border-4 border-gray-800"></div>
                <div class="bg-gray-700/30 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500 font-medium line-through">{phase.name}</span>
                    <span class="text-gray-600 text-sm">SKIPPED</span>
                  </div>
                </div>
              </div>
            {/each}
            <div class="relative">
              <div class="absolute -left-8 w-4 h-4 rounded-full bg-green-500 border-4 border-gray-800"></div>
              <div class="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-white font-medium">Handler Execution</span>
                  <span class="text-green-400 text-sm font-mono">~1-5ms</span>
                </div>
                <p class="text-gray-400 text-sm">Jump straight to your code!</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <div class="text-green-300 font-medium">Total Warm Start: 1-5ms</div>
          <div class="text-gray-400 text-sm mt-1">Container reused for ~5-15 minutes of inactivity</div>
        </div>
      {/if}
    </div>
  </section>

  <!-- Cold Start Walkthrough -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Cold Start Deep Dive</h2>
    <GuidedWalkthrough {...coldStartWalkthrough} />
  </section>

  <!-- Runtime Comparison -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Runtime Comparison</h2>
    <p class="text-gray-400 mb-6">Cold start times vary significantly by language runtime</p>

    <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="text-left p-4 text-gray-400 font-medium">Runtime</th>
            <th class="text-left p-4 text-blue-400 font-medium">Cold Start</th>
            <th class="text-left p-4 text-green-400 font-medium">Warm Start</th>
            <th class="text-left p-4 text-gray-400 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {#each runtimeComparison as rt, i}
            <tr class="border-b border-gray-700/50 {i % 2 === 0 ? 'bg-gray-800/30' : ''}">
              <td class="p-4 text-white font-medium">{rt.runtime}</td>
              <td class="p-4 text-blue-300 font-mono">{rt.coldStart}</td>
              <td class="p-4 text-green-300 font-mono">{rt.warmStart}</td>
              <td class="p-4 text-gray-400 text-sm">{rt.notes}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Optimization Strategies -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Optimization Strategies</h2>

    <div class="space-y-6">
      {#each optimizations as category}
        <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 class="text-lg font-semibold text-white mb-4">{category.category}</h3>
          <div class="grid md:grid-cols-2 gap-4">
            {#each category.items as item}
              <div class="p-4 bg-gray-700/30 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-white font-medium">{item.name}</span>
                  <span class="px-2 py-0.5 rounded text-xs font-medium
                    {item.impact === 'Eliminates' ? 'bg-green-500/20 text-green-400' : ''}
                    {item.impact === 'High' ? 'bg-blue-500/20 text-blue-400' : ''}
                    {item.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    {item.impact === 'Low' ? 'bg-gray-500/20 text-gray-400' : ''}">
                    {item.impact} impact
                  </span>
                </div>
                <p class="text-gray-400 text-sm">{item.desc}</p>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Provisioned Concurrency vs SnapStart -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Provisioned Concurrency vs SnapStart</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
        <h3 class="text-lg font-semibold text-purple-400 mb-4">Provisioned Concurrency</h3>
        <p class="text-gray-400 text-sm mb-4">
          Pre-initialize a specified number of execution environments that are always ready.
        </p>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-green-400">+</span>
            <span class="text-gray-300">Eliminates cold starts completely</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-green-400">+</span>
            <span class="text-gray-300">Works with any runtime</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-red-400">-</span>
            <span class="text-gray-300">Costs money even when idle</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-red-400">-</span>
            <span class="text-gray-300">Must estimate concurrency needs</span>
          </div>
        </div>
        <div class="p-3 bg-purple-500/10 rounded-lg">
          <div class="text-purple-300 text-sm">Best for: Consistent, predictable traffic patterns</div>
        </div>
      </div>

      <div class="bg-gray-800/50 rounded-xl p-6 border border-orange-500/30">
        <h3 class="text-lg font-semibold text-orange-400 mb-4">SnapStart</h3>
        <p class="text-gray-400 text-sm mb-4">
          Snapshot initialized state and restore from cache instead of re-initializing.
        </p>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-green-400">+</span>
            <span class="text-gray-300">Up to 10x faster cold starts</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-green-400">+</span>
            <span class="text-gray-300">No additional cost</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-red-400">-</span>
            <span class="text-gray-300">Only Java, Python, .NET</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-red-400">-</span>
            <span class="text-gray-300">May need code changes for uniqueness</span>
          </div>
        </div>
        <div class="p-3 bg-orange-500/10 rounded-lg">
          <div class="text-orange-300 text-sm">Best for: Java/.NET with variable traffic</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Best Practices -->
  <section>
    <h2 class="text-xl font-semibold text-white mb-4">Best Practices</h2>

    <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-green-400 font-medium mb-3">DO</h4>
          <ul class="space-y-2">
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-green-400 mt-0.5">+</span>
              Initialize SDK clients outside the handler (global scope)
            </li>
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-green-400 mt-0.5">+</span>
              Reuse database connections across invocations
            </li>
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-green-400 mt-0.5">+</span>
              Use Lambda Layers for shared dependencies
            </li>
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-green-400 mt-0.5">+</span>
              Monitor INIT duration in CloudWatch
            </li>
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-green-400 mt-0.5">+</span>
              Use ARM architecture for cost savings
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-red-400 font-medium mb-3">DON'T</h4>
          <ul class="space-y-2">
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-red-400 mt-0.5">-</span>
              Create new connections on every invocation
            </li>
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-red-400 mt-0.5">-</span>
              Bundle unnecessary dependencies
            </li>
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-red-400 mt-0.5">-</span>
              Use VPC unless you need private resources
            </li>
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-red-400 mt-0.5">-</span>
              Ignore cold start metrics in production
            </li>
            <li class="flex items-start gap-2 text-gray-300 text-sm">
              <span class="text-red-400 mt-0.5">-</span>
              Use Java without SnapStart for user-facing APIs
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</div>

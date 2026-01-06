<script lang="ts">
  import ComparisonTable from '$lib/components/diagrams/ComparisonTable.svelte';

  let selectedLayer: 'l4' | 'l7' | null = null;
  let showOsiModel = true;

  const osiLayers = [
    { num: 7, name: 'Application', protocols: 'HTTP, HTTPS, gRPC', lb: 'ALB' },
    { num: 6, name: 'Presentation', protocols: 'SSL/TLS', lb: '-' },
    { num: 5, name: 'Session', protocols: 'Sockets', lb: '-' },
    { num: 4, name: 'Transport', protocols: 'TCP, UDP', lb: 'NLB' },
    { num: 3, name: 'Network', protocols: 'IP', lb: 'GLB' },
    { num: 2, name: 'Data Link', protocols: 'Ethernet', lb: '-' },
    { num: 1, name: 'Physical', protocols: 'Cables', lb: '-' }
  ];

  const comparisonOptions = [
    {
      id: 'l4',
      name: 'Layer 4 (NLB)',
      description: 'Transport layer load balancing based on IP and port',
      whenToUse: [
        'High-performance, low-latency requirements (gaming, trading)',
        'Non-HTTP protocols (databases, custom TCP/UDP)',
        'Need for static IP addresses',
        'Simple round-robin or hash-based distribution',
        'TLS passthrough without termination',
        'Millions of connections per second'
      ],
      whenNotToUse: [
        'Need content-based routing (URL paths, headers)',
        'Require sticky sessions based on cookies',
        'Want to inspect or modify HTTP traffic',
        'Need Web Application Firewall (WAF) integration',
        'Microservices with path-based routing'
      ]
    },
    {
      id: 'l7',
      name: 'Layer 7 (ALB)',
      description: 'Application layer load balancing with content inspection',
      whenToUse: [
        'HTTP/HTTPS web applications',
        'Microservices with path-based routing (/api, /web)',
        'Content-based routing (headers, cookies, query strings)',
        'SSL termination at the load balancer',
        'WebSocket support',
        'Integration with WAF for security'
      ],
      whenNotToUse: [
        'Non-HTTP protocols (databases, gaming servers)',
        'Ultra-low latency requirements',
        'Need static IP addresses',
        'Simple TCP/UDP load balancing',
        'Want to avoid SSL termination overhead'
      ]
    }
  ];

  const features = [
    { name: 'OSI Layer', l4: 'Layer 4 (Transport)', l7: 'Layer 7 (Application)' },
    { name: 'Protocols', l4: 'TCP, UDP, TLS', l7: 'HTTP, HTTPS, gRPC, WebSocket' },
    { name: 'Routing Decision', l4: 'IP + Port (5-tuple)', l7: 'URL path, headers, cookies' },
    { name: 'SSL/TLS', l4: 'Passthrough or terminate', l7: 'Always terminates' },
    { name: 'Performance', l4: 'Millions req/sec, microseconds', l7: 'Lower throughput, milliseconds' },
    { name: 'Connection', l4: 'Preserves client connection', l7: 'Terminates and creates new' },
    { name: 'Algorithm', l4: 'Flow hash', l7: 'Round robin, least connections' },
    { name: 'Static IP', l4: 'Yes (per AZ)', l7: 'No (DNS-based)' },
    { name: 'Health Checks', l4: 'TCP/UDP port check', l7: 'HTTP status codes' },
    { name: 'WAF Support', l4: 'No', l7: 'Yes' }
  ];

  const awsServices = [
    { name: 'ALB', layer: 'L7', use: 'Web apps, microservices, APIs' },
    { name: 'NLB', layer: 'L4', use: 'High performance, TCP/UDP, static IPs' },
    { name: 'GLB', layer: 'L3/L4', use: 'Network appliances, firewalls, inspection' },
    { name: 'CLB', layer: 'L4/L7', use: 'Legacy (deprecated)' }
  ];
</script>

<svelte:head>
  <title>Load Balancing - L4 vs L7</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <h1 class="text-3xl font-bold text-surface-100 mb-2">Load Balancing</h1>
  <p class="text-surface-400 mb-8">Understanding Layer 4 vs Layer 7 load balancers and when to use each</p>

  <!-- OSI Model Visual -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">OSI Model & Load Balancer Layers</h2>
    <p class="text-surface-400 mb-6">Load balancers operate at different OSI layers, determining what information they can see and use for routing decisions.</p>

    <div class="card">
      <div class="grid gap-2">
        {#each osiLayers as layer}
          <div
            class="flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer border border-surface-800 bg-surface-900
              {layer.num === 7 ? 'bg-blue-500/20 border border-blue-500/50' : ''}
              {layer.num === 4 ? 'bg-purple-500/20 border border-purple-500/50' : ''}
              {layer.num === 3 ? 'bg-orange-500/20 border border-orange-500/50' : ''}
              "
            on:click={() => {
              if (layer.num === 7) selectedLayer = 'l7';
              else if (layer.num === 4) selectedLayer = 'l4';
            }}
            on:keydown={(e) => e.key === 'Enter' && (layer.num === 7 ? selectedLayer = 'l7' : layer.num === 4 ? selectedLayer = 'l4' : null)}
            role="button"
            tabindex="0"
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold
              {layer.num === 7 ? 'bg-blue-500 text-white' : ''}
              {layer.num === 4 ? 'bg-purple-500 text-white' : ''}
              {layer.num === 3 ? 'bg-orange-500 text-white' : ''}
              {layer.num !== 7 && layer.num !== 4 && layer.num !== 3 ? 'bg-surface-800 text-surface-300' : ''}">
              {layer.num}
            </div>
            <div class="flex-1">
              <span class="text-surface-100 font-medium">{layer.name}</span>
              <span class="text-surface-500 ml-2">- {layer.protocols}</span>
            </div>
            {#if layer.lb !== '-'}
              <span class="px-3 py-1 rounded-full text-sm font-medium
                {layer.num === 7 ? 'bg-blue-500/30 text-blue-300' : ''}
                {layer.num === 4 ? 'bg-purple-500/30 text-purple-300' : ''}
                {layer.num === 3 ? 'bg-orange-500/30 text-orange-300' : ''}">
                {layer.lb}
              </span>
            {/if}
          </div>
        {/each}
      </div>

      <div class="mt-6 grid grid-cols-3 gap-4 text-center">
        <div class="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div class="text-blue-400 font-semibold">Layer 7 (ALB)</div>
          <div class="text-surface-400 text-sm mt-1">Sees HTTP content</div>
        </div>
        <div class="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <div class="text-purple-400 font-semibold">Layer 4 (NLB)</div>
          <div class="text-surface-400 text-sm mt-1">Sees IP + Port</div>
        </div>
        <div class="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <div class="text-orange-400 font-semibold">Layer 3 (GLB)</div>
          <div class="text-surface-400 text-sm mt-1">Network gateway</div>
        </div>
      </div>
    </div>
  </section>

  <!-- How They Work -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">How They Work</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- L4 -->
      <div class="card border-purple-500/30">
        <h3 class="text-lg font-semibold text-purple-400 mb-4">Layer 4 Load Balancer</h3>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">1</div>
            <div>
              <div class="text-surface-100 font-medium">Extract 5-tuple</div>
              <div class="text-surface-400 text-sm">Source IP, Source Port, Dest IP, Dest Port, Protocol</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">2</div>
            <div>
              <div class="text-surface-100 font-medium">Apply hash algorithm</div>
              <div class="text-surface-400 text-sm">Deterministic routing based on connection info</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">3</div>
            <div>
              <div class="text-surface-100 font-medium">Forward entire connection</div>
              <div class="text-surface-400 text-sm">All packets in session go to same backend</div>
            </div>
          </div>
        </div>
        <div class="mt-4 p-3 bg-purple-500/10 rounded-lg">
          <div class="text-purple-300 text-sm font-medium">Key insight:</div>
          <div class="text-surface-400 text-sm">Cannot see inside the packet payload - only network headers</div>
        </div>
      </div>

      <!-- L7 -->
      <div class="card border-blue-500/30">
        <h3 class="text-lg font-semibold text-blue-400 mb-4">Layer 7 Load Balancer</h3>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">1</div>
            <div>
              <div class="text-surface-100 font-medium">Terminate connection</div>
              <div class="text-surface-400 text-sm">Client connects to LB, LB connects to backend</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">2</div>
            <div>
              <div class="text-surface-100 font-medium">Parse HTTP request</div>
              <div class="text-surface-400 text-sm">Read URL path, headers, cookies, body</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">3</div>
            <div>
              <div class="text-surface-100 font-medium">Apply routing rules</div>
              <div class="text-surface-400 text-sm">/api/* to API servers, /static/* to CDN</div>
            </div>
          </div>
        </div>
        <div class="mt-4 p-3 bg-blue-500/10 rounded-lg">
          <div class="text-blue-300 text-sm font-medium">Key insight:</div>
          <div class="text-surface-400 text-sm">Full visibility into application data - can route by content</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Feature Comparison Table -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Feature Comparison</h2>

    <div class="bg-surface-900 rounded-xl border border-surface-800 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-surface-800">
            <th class="text-left p-4 text-surface-400 font-medium">Feature</th>
            <th class="text-left p-4 text-purple-400 font-medium">Layer 4 (NLB)</th>
            <th class="text-left p-4 text-blue-400 font-medium">Layer 7 (ALB)</th>
          </tr>
        </thead>
        <tbody>
          {#each features as feature, i}
            <tr class="border-b border-surface-800 {i % 2 === 0 ? 'bg-surface-950/40' : ''}">
              <td class="p-4 text-surface-100 font-medium">{feature.name}</td>
              <td class="p-4 text-surface-300">{feature.l4}</td>
              <td class="p-4 text-surface-300">{feature.l7}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <!-- When to Use -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">When to Use Each</h2>
    <ComparisonTable options={comparisonOptions} />
  </section>

  <!-- AWS Services -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">AWS Load Balancer Types</h2>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each awsServices as service}
        <div class="bg-surface-900 rounded-xl p-4 border border-surface-800 hover:border-surface-700 transition-colors">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg font-bold text-surface-100">{service.name}</span>
            <span class="px-2 py-0.5 rounded text-xs font-medium
              {service.layer === 'L7' ? 'bg-blue-500/20 text-blue-400' : ''}
              {service.layer === 'L4' ? 'bg-purple-500/20 text-purple-400' : ''}
              {service.layer === 'L3/L4' ? 'bg-orange-500/20 text-orange-400' : ''}
              {service.layer === 'L4/L7' ? 'bg-surface-700/40 text-surface-300' : ''}">
              {service.layer}
            </span>
          </div>
          <p class="text-surface-400 text-sm">{service.use}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Decision Guide -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Quick Decision Guide</h2>

    <div class="card">
      <div class="space-y-4">
        <div class="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <div class="text-2xl">1M+</div>
          <div>
            <div class="text-surface-100 font-medium">Need millions of requests/second?</div>
            <div class="text-surface-400 text-sm">Use NLB (Layer 4) - designed for extreme performance</div>
          </div>
        </div>

        <div class="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div class="text-2xl">/api</div>
          <div>
            <div class="text-surface-100 font-medium">Need path-based routing?</div>
            <div class="text-surface-400 text-sm">Use ALB (Layer 7) - can route by URL, headers, cookies</div>
          </div>
        </div>

        <div class="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <div class="text-2xl">IP</div>
          <div>
            <div class="text-surface-100 font-medium">Need static IP addresses?</div>
            <div class="text-surface-400 text-sm">Use NLB (Layer 4) - provides static IPs per AZ</div>
          </div>
        </div>

        <div class="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div class="text-2xl">WAF</div>
          <div>
            <div class="text-surface-100 font-medium">Need WAF or advanced security?</div>
            <div class="text-surface-400 text-sm">Use ALB (Layer 7) - integrates with AWS WAF</div>
          </div>
        </div>

        <div class="flex items-center gap-4 p-4 bg-surface-800/60 rounded-lg border border-surface-800">
          <div class="text-2xl">DB</div>
          <div>
            <div class="text-surface-100 font-medium">Load balancing databases or non-HTTP?</div>
            <div class="text-surface-400 text-sm">Use NLB (Layer 4) - protocol agnostic</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Real World Examples -->
  <section>
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Real World Examples</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="text-lg font-semibold text-surface-100 mb-3">E-commerce Platform</h3>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">ALB</span>
            <span class="text-surface-300">/api/* to API servers</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">ALB</span>
            <span class="text-surface-300">/static/* to static content servers</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">ALB</span>
            <span class="text-surface-300">Sticky sessions for shopping cart</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold text-surface-100 mb-3">Gaming Server</h3>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">NLB</span>
            <span class="text-surface-300">UDP game traffic (low latency)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">NLB</span>
            <span class="text-surface-300">TCP matchmaking servers</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">NLB</span>
            <span class="text-surface-300">Static IPs for firewall rules</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

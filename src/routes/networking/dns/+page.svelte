<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import GuidedWalkthrough from '$lib/components/diagrams/GuidedWalkthrough.svelte';

  const dnsSteps = [
    {
      id: 'step1',
      title: 'User Types URL',
      description: 'You type "example.com" into your browser. The browser needs to find the IP address of this domain to connect to it.',
      icon: 'Globe',
      details: 'The browser first checks its own cache. If you visited this site recently, it may already know the IP address.',
      tip: 'Browser caches typically last a few minutes to hours, depending on the TTL (Time To Live) set by the domain.'
    },
    {
      id: 'step2',
      title: 'Check OS Cache',
      description: 'If not in browser cache, the OS (Operating System) cache is checked. Your computer maintains its own DNS cache.',
      icon: 'Monitor',
      details: 'On macOS: "dscacheutil -q host -a name example.com". On Windows: "ipconfig /displaydns". On Linux: check systemd-resolved.',
      tip: 'You can flush your OS DNS cache if you need to force a fresh lookup.'
    },
    {
      id: 'step3',
      title: 'Query Recursive Resolver',
      description: 'If still not found, your computer asks the Recursive DNS Resolver (usually your ISP or a service like 8.8.8.8).',
      icon: 'Search',
      details: 'The recursive resolver is like a librarian - it will do all the work to find the answer for you. Popular resolvers: Google (8.8.8.8), Cloudflare (1.1.1.1), OpenDNS.',
      tip: 'Using a different DNS resolver can improve speed and privacy. Cloudflare 1.1.1.1 is known for speed, while 9.9.9.9 (Quad9) blocks malicious domains.'
    },
    {
      id: 'step4',
      title: 'Query Root Nameserver',
      description: 'The resolver asks a Root Nameserver: "Who knows about .com domains?" There are 13 root server clusters worldwide.',
      icon: 'Server',
      details: 'Root servers don\'t know specific domains - they only know which servers handle each TLD (.com, .org, .net, etc.). They respond with the address of the TLD nameserver.',
      tip: 'The 13 root server clusters (A through M) are actually hundreds of servers using Anycast to appear as one.'
    },
    {
      id: 'step5',
      title: 'Query TLD Nameserver',
      description: 'The resolver asks the .com TLD Nameserver: "Who knows about example.com?" It responds with the authoritative nameserver.',
      icon: 'Building',
      details: 'TLD (Top Level Domain) servers are managed by registries. Verisign manages .com and .net. Different organizations manage country codes like .uk, .de, etc.',
      tip: 'When you buy a domain, your registrar tells the TLD servers which nameservers are authoritative for your domain.'
    },
    {
      id: 'step6',
      title: 'Query Authoritative Nameserver',
      description: 'The resolver asks the Authoritative Nameserver: "What is the IP address of example.com?" This server has the actual answer.',
      icon: 'Database',
      details: 'The authoritative nameserver is typically run by your DNS provider (Cloudflare, Route53, etc.) or hosting provider. It contains the actual DNS records you configured.',
      tip: 'This is where your A records, CNAME records, MX records, and TXT records live. Changes here propagate based on TTL.'
    },
    {
      id: 'step7',
      title: 'Return IP Address',
      description: 'The authoritative nameserver responds with the IP address (e.g., 93.184.216.34). The resolver caches this and returns it to your browser.',
      icon: 'ArrowDown',
      details: 'The response includes a TTL (Time To Live) - how long this answer can be cached. Typical TTLs range from 5 minutes to 24 hours.',
      tip: 'Lower TTL = faster propagation of changes but more DNS queries. Higher TTL = better caching but slower updates.'
    },
    {
      id: 'step8',
      title: 'Browser Connects',
      description: 'Your browser now has the IP address and can establish a TCP connection to the web server and load the page.',
      icon: 'Wifi',
      details: 'The entire DNS lookup typically takes 20-120ms. After that, the browser opens a TCP connection (another round trip) and sends the HTTP request.',
      tip: 'This whole process happens every time you visit a new domain. Caching at multiple levels makes repeat visits much faster.'
    }
  ];

  const recordTypes = [
    {
      type: 'A',
      description: 'Maps domain to IPv4 address',
      example: 'example.com -> 93.184.216.34',
      useCase: 'Primary record for websites'
    },
    {
      type: 'AAAA',
      description: 'Maps domain to IPv6 address',
      example: 'example.com -> 2606:2800:220:1:248:1893:25c8:1946',
      useCase: 'IPv6 support'
    },
    {
      type: 'CNAME',
      description: 'Alias pointing to another domain',
      example: 'www.example.com -> example.com',
      useCase: 'Subdomains, CDN integration'
    },
    {
      type: 'MX',
      description: 'Mail server for the domain',
      example: 'example.com -> mail.example.com (priority 10)',
      useCase: 'Email routing'
    },
    {
      type: 'TXT',
      description: 'Arbitrary text data',
      example: 'v=spf1 include:_spf.google.com ~all',
      useCase: 'SPF, DKIM, domain verification'
    },
    {
      type: 'NS',
      description: 'Nameservers for the domain',
      example: 'example.com -> ns1.cloudflare.com',
      useCase: 'Delegate DNS authority'
    }
  ];
</script>

<svelte:head>
  <title>DNS - How it Works - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <!-- Header -->
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/networking" class="hover:text-surface-300">Networking</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">DNS</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">DNS: Domain Name System</h1>
    <p class="text-surface-400 mt-2">
      The internet's phonebook - translating human-readable domain names to IP addresses.
    </p>
  </div>

  <!-- Quick Summary -->
  <div class="grid md:grid-cols-3 gap-4">
    <div class="card text-center">
      <div class="w-12 h-12 mx-auto rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
        <Icons.Globe class="w-6 h-6 text-blue-400" />
      </div>
      <h3 class="font-medium text-surface-200">What</h3>
      <p class="text-sm text-surface-400 mt-1">Translates domain names to IP addresses</p>
    </div>
    <div class="card text-center">
      <div class="w-12 h-12 mx-auto rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
        <Icons.Zap class="w-6 h-6 text-green-400" />
      </div>
      <h3 class="font-medium text-surface-200">Speed</h3>
      <p class="text-sm text-surface-400 mt-1">20-120ms for uncached lookups</p>
    </div>
    <div class="card text-center">
      <div class="w-12 h-12 mx-auto rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
        <Icons.Layers class="w-6 h-6 text-purple-400" />
      </div>
      <h3 class="font-medium text-surface-200">Layers</h3>
      <p class="text-sm text-surface-400 mt-1">Multiple caching layers for efficiency</p>
    </div>
  </div>

  <!-- Walkthrough -->
  <GuidedWalkthrough
    title="How DNS Resolution Works"
    subtitle="Follow a DNS query from your browser to the answer"
    steps={dnsSteps}
    autoPlay={false}
  />

  <!-- DNS Record Types -->
  <div class="card">
    <h3 class="text-lg font-semibold text-surface-100 mb-4">DNS Record Types</h3>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-surface-700">
            <th class="text-left p-3 text-surface-400 font-medium">Type</th>
            <th class="text-left p-3 text-surface-400 font-medium">Description</th>
            <th class="text-left p-3 text-surface-400 font-medium">Example</th>
            <th class="text-left p-3 text-surface-400 font-medium">Use Case</th>
          </tr>
        </thead>
        <tbody>
          {#each recordTypes as record}
            <tr class="border-b border-surface-800 hover:bg-surface-800/50">
              <td class="p-3">
                <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-mono text-sm">
                  {record.type}
                </span>
              </td>
              <td class="p-3 text-surface-300 text-sm">{record.description}</td>
              <td class="p-3 text-surface-400 text-sm font-mono">{record.example}</td>
              <td class="p-3 text-surface-400 text-sm">{record.useCase}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- A vs CNAME -->
  <div class="card">
    <h3 class="text-lg font-semibold text-surface-100 mb-4">A Record vs CNAME: When to Use Each</h3>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-bold">A</span>
          <span class="font-medium text-surface-200">Direct IP Mapping</span>
        </div>
        <ul class="space-y-2 text-sm">
          <li class="flex items-start gap-2 text-surface-300">
            <Icons.Check class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            Use for root domain (example.com)
          </li>
          <li class="flex items-start gap-2 text-surface-300">
            <Icons.Check class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            Slightly faster (no extra lookup)
          </li>
          <li class="flex items-start gap-2 text-surface-300">
            <Icons.X class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            Must update if IP changes
          </li>
          <li class="flex items-start gap-2 text-surface-300">
            <Icons.X class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            Can't point to another domain
          </li>
        </ul>
      </div>
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 font-bold">CNAME</span>
          <span class="font-medium text-surface-200">Alias to Another Domain</span>
        </div>
        <ul class="space-y-2 text-sm">
          <li class="flex items-start gap-2 text-surface-300">
            <Icons.Check class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            Use for subdomains (www.example.com)
          </li>
          <li class="flex items-start gap-2 text-surface-300">
            <Icons.Check class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            Great for CDNs and load balancers
          </li>
          <li class="flex items-start gap-2 text-surface-300">
            <Icons.Check class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            Target can change IP without updating
          </li>
          <li class="flex items-start gap-2 text-surface-300">
            <Icons.X class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            Cannot use at root domain (usually)
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Popular DNS Providers -->
  <div class="card">
    <h3 class="text-lg font-semibold text-surface-100 mb-4">DNS Providers Comparison</h3>
    <div class="grid md:grid-cols-3 gap-4">
      {#each [
        {
          name: 'Cloudflare',
          icon: 'Cloud',
          pros: ['Free tier', 'Fast propagation', 'DDoS protection'],
          bestFor: 'Most websites'
        },
        {
          name: 'Route 53',
          icon: 'Compass',
          pros: ['AWS integration', 'Health checks', 'Geo-routing'],
          bestFor: 'AWS infrastructure'
        },
        {
          name: 'Cloud DNS',
          icon: 'Cloud',
          pros: ['GCP integration', '100% SLA', 'Global anycast'],
          bestFor: 'GCP infrastructure'
        }
      ] as provider}
        <div class="bg-surface-800 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-3">
            <Icons.Cloud class="w-5 h-5 text-surface-300" />
            <span class="font-medium text-surface-200">{provider.name}</span>
          </div>
          <ul class="space-y-1 mb-3">
            {#each provider.pros as pro}
              <li class="text-sm text-surface-400 flex items-center gap-2">
                <Icons.Check class="w-3 h-3 text-green-400" />
                {pro}
              </li>
            {/each}
          </ul>
          <div class="text-xs text-surface-500">Best for: {provider.bestFor}</div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex justify-between items-center pt-4 border-t border-surface-800">
    <a href="/networking" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" />
      All Networking
    </a>
    <a href="/networking/load-balancing" class="btn-primary flex items-center gap-2">
      Next: Load Balancing
      <Icons.ArrowRight class="w-4 h-4" />
    </a>
  </div>
</div>

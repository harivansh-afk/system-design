<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const benefits = [
    { title: 'Lower latency', desc: 'Serve content from edge locations closer to users.' },
    { title: 'Offload origin', desc: 'Cache static content and reduce traffic to your core services.' },
    { title: 'DDoS absorption', desc: 'Edge networks can absorb and filter abuse before it reaches your origin.' },
    { title: 'TLS at the edge', desc: 'Terminate TLS close to users and centralize cert management.' }
  ] as const;

  const references = [
    { label: 'Amazon CloudFront Developer Guide', href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' }
  ];
</script>

<svelte:head>
  <title>CDN - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/networking" class="hover:text-surface-300">Networking</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">CDN</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">CDN (Content Delivery Network)</h1>
    <p class="text-surface-400 mt-2">
      A globally distributed caching layer that accelerates content delivery and protects your origin.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    {#each benefits as b}
      <div class="card">
        <h2 class="text-lg font-semibold text-surface-100">{b.title}</h2>
        <p class="text-sm text-surface-400 mt-2">{b.desc}</p>
      </div>
    {/each}
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


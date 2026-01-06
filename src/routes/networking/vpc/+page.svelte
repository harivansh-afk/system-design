<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import GuidedWalkthrough from '$lib/components/diagrams/GuidedWalkthrough.svelte';

  const steps = [
    {
      id: 'cidr',
      title: 'Pick a CIDR range',
      description: 'Choose an IP space large enough for future growth (and to avoid overlaps).',
      icon: 'Map'
    },
    {
      id: 'subnets',
      title: 'Create subnets',
      description: 'Split the VPC into subnets (often per availability zone). Use public for edge, private for services.',
      icon: 'Grid'
    },
    {
      id: 'routing',
      title: 'Add routing',
      description: 'Route tables decide where traffic goes: to an internet gateway, NAT, VPN, or internal targets.',
      icon: 'Route'
    },
    {
      id: 'security',
      title: 'Apply security controls',
      description: 'Use security groups / network ACLs to restrict traffic; expose only what’s needed.',
      icon: 'Shield'
    }
  ];

  const references = [
    { label: 'AWS VPC User Guide', href: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html' }
  ];
</script>

<svelte:head>
  <title>VPC & Subnets - System Design Explorer</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/networking" class="hover:text-surface-300">Networking</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">VPC & Subnets</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">VPC & Subnets</h1>
    <p class="text-surface-400 mt-2">
      A private network boundary for your workloads: address space, segmentation, and routing.
    </p>
  </div>

  <GuidedWalkthrough title="A simple VPC mental model" subtitle="The minimum you should be able to explain in an interview" {steps} />

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

  <div class="flex justify-between">
    <a href="/networking" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" /> Networking
    </a>
    <a href="/networking/dns" class="btn-primary flex items-center gap-2">
      DNS <Icons.ArrowRight class="w-4 h-4" />
    </a>
  </div>
</div>

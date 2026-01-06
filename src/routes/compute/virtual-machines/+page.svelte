<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import GuidedWalkthrough from '$lib/components/diagrams/GuidedWalkthrough.svelte';

  const steps = [
    {
      id: 'provision',
      title: 'Provision a VM',
      description: 'Allocate a virtual machine with CPU/RAM/disk from a cloud or hypervisor.',
      icon: 'Server',
      details: 'You manage the OS, patches, package installs, and runtime configuration.',
      tip: 'Bake an image (AMI) and use autoscaling groups for repeatability.'
    },
    {
      id: 'deploy',
      title: 'Deploy your app',
      description: 'Install your service, configure env vars, and run a process manager (systemd, supervisord).',
      icon: 'Upload',
      details: 'You’re responsible for rollouts, health checks, and restarts.'
    },
    {
      id: 'scale',
      title: 'Scale with replicas',
      description: 'Add more VMs and put them behind a load balancer.',
      icon: 'Layers',
      details: 'Stateful components (DB, disks, sessions) often become the scaling bottleneck.',
      tip: 'Prefer stateless services + externalized state (DB/cache/object storage).'
    },
    {
      id: 'operate',
      title: 'Operate & secure',
      description: 'Monitoring, patching, hardening, backups, and incident response are on you.',
      icon: 'Shield',
      details: 'You own the OS and network surface area.'
    }
  ];

  const references = [
    { label: 'AWS EC2 Instances', href: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Instances.html' },
    { label: 'Kubernetes (for comparison)', href: 'https://kubernetes.io/docs/concepts/' }
  ];
</script>

<svelte:head>
  <title>Virtual Machines - System Design Explorer</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/compute" class="hover:text-surface-300">Compute</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Virtual Machines</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Virtual Machines</h1>
    <p class="text-surface-400 mt-2">
      A VM gives you an isolated OS environment—max control, max operational responsibility.
    </p>
  </div>

  <GuidedWalkthrough
    title="How VM-based deployment typically works"
    subtitle="A pragmatic mental model for system design interviews and real systems"
    {steps}
  />

  <div class="grid md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">When VMs shine</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Legacy apps that expect full OS control</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Specialized kernel / drivers / networking</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Long-running services with predictable load</li>
      </ul>
    </div>
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Common pitfalls</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Config drift without automation (IaC + images)</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Snowflake servers (manual fixes)</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Slow patching and inconsistent security posture</li>
      </ul>
    </div>
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

  <div class="flex justify-between">
    <a href="/compute" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" /> Compute
    </a>
    <a href="/compute/containers" class="btn-primary flex items-center gap-2">
      Containers <Icons.ArrowRight class="w-4 h-4" />
    </a>
  </div>
</div>

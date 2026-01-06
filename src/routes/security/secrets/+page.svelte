<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const references = [
    { label: 'AWS Secrets Manager User Guide', href: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html' }
  ];
</script>

<svelte:head>
  <title>Secrets Management - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/security" class="hover:text-surface-300">Security</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Secrets Management</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Secrets Management</h1>
    <p class="text-surface-400 mt-2">
      Store and rotate credentials safely. Prefer short-lived credentials and least privilege over static keys.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Do</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Centralize secrets and audit access</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Rotate automatically and regularly</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Use workload identity where possible</li>
      </ul>
    </div>
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Avoid</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Hardcoding secrets in code or images</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Long-lived access keys with broad permissions</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Sharing credentials across environments</li>
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
</div>


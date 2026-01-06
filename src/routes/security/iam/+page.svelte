<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const references = [
    { label: 'AWS IAM User Guide', href: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html' }
  ];
</script>

<svelte:head>
  <title>IAM - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/security" class="hover:text-surface-300">Security</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">IAM</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">IAM (Identity & Access Management)</h1>
    <p class="text-surface-400 mt-2">
      Define who can do what on which resources. Start with least privilege and strong auditability.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Core building blocks</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Identities: users, roles, workloads</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Policies: allow/deny rules</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Authentication vs authorization</li>
        <li class="flex gap-2"><Icons.Check class="w-4 h-4 mt-0.5 text-surface-400" />Audit logs and rotation</li>
      </ul>
    </div>
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">Pitfalls to avoid</h2>
      <ul class="space-y-2 text-surface-300">
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Over-broad permissions (“*:*”)</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />Long-lived secrets instead of short-lived tokens</li>
        <li class="flex gap-2"><Icons.AlertTriangle class="w-4 h-4 mt-0.5 text-surface-400" />No separation between prod and non-prod</li>
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


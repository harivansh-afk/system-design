<script lang="ts">
  import * as Icons from 'lucide-svelte';

  const references = [
    { label: 'AWS KMS Developer Guide', href: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html' }
  ];
</script>

<svelte:head>
  <title>Encryption - System Design Explorer</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/security" class="hover:text-surface-300">Security</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Encryption</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Encryption</h1>
    <p class="text-surface-400 mt-2">
      Protect data in transit and at rest. The hard part is key management and access control—not the cipher.
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">In transit</h2>
      <p class="text-surface-300 text-sm">
        Use TLS everywhere (client→edge, edge→service, service→service). Rotate certificates and enforce modern ciphers.
      </p>
    </div>
    <div class="card">
      <h2 class="text-lg font-semibold text-surface-100 mb-3">At rest</h2>
      <p class="text-surface-300 text-sm">
        Encrypt disks, databases, and object storage. Centralize keys, control access, and log usage.
      </p>
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


<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/ui/Sidebar.svelte';
  import { sidebarOpen } from '$lib/stores/navigation';

  let { children } = $props();
</script>

<div class="min-h-screen bg-surface-950">
  <Sidebar />
  
  <main 
    class="transition-all duration-300 min-h-screen"
    class:ml-64={$sidebarOpen}
    class:ml-16={!$sidebarOpen}
  >
    <div class="p-8">
      {@render children()}
    </div>
  </main>
</div>

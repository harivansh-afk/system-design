<script lang="ts">
  let selectedComponent: string | null = null;

  const controlPlaneComponents = [
    {
      id: 'api-server',
      name: 'kube-apiserver',
      description: 'Front door to the cluster - all communication goes through here',
      details: [
        'Exposes the Kubernetes API (REST)',
        'Validates and processes API requests',
        'Only component that talks to etcd',
        'Handles authentication and authorization'
      ],
      color: 'blue'
    },
    {
      id: 'etcd',
      name: 'etcd',
      description: 'Distributed key-value store - the source of truth for cluster state',
      details: [
        'Stores all cluster configuration',
        'Highly available (Raft consensus)',
        'Only accessed by API server',
        'Critical - backup regularly!'
      ],
      color: 'purple'
    },
    {
      id: 'scheduler',
      name: 'kube-scheduler',
      description: 'Decides which node runs each pod',
      details: [
        'Watches for unscheduled pods',
        'Evaluates node resources and constraints',
        'Considers affinity/anti-affinity rules',
        'Assigns pod to best-fit node'
      ],
      color: 'green'
    },
    {
      id: 'controller-manager',
      name: 'kube-controller-manager',
      description: 'Runs control loops that maintain desired state',
      details: [
        'Node Controller - monitors node health',
        'Deployment Controller - manages rollouts',
        'ReplicaSet Controller - ensures pod count',
        'Job Controller - runs one-off tasks'
      ],
      color: 'orange'
    },
    {
      id: 'cloud-controller',
      name: 'cloud-controller-manager',
      description: 'Integrates with cloud provider APIs',
      details: [
        'Creates load balancers for Services',
        'Provisions cloud storage volumes',
        'Manages node lifecycle in cloud',
        'Only present in cloud deployments'
      ],
      color: 'cyan'
    }
  ];

  const nodeComponents = [
    {
      id: 'kubelet',
      name: 'kubelet',
      description: 'Agent on each node - ensures containers are running',
      details: [
        'Receives pod specs from API server',
        'Manages container lifecycle via CRI',
        'Reports node and pod status',
        'Handles liveness/readiness probes'
      ],
      color: 'yellow'
    },
    {
      id: 'kube-proxy',
      name: 'kube-proxy',
      description: 'Network proxy - implements Service networking',
      details: [
        'Maintains iptables/IPVS rules',
        'Routes traffic to correct pods',
        'Handles ClusterIP, NodePort, LoadBalancer',
        'Can be replaced by CNI plugins'
      ],
      color: 'pink'
    },
    {
      id: 'container-runtime',
      name: 'Container Runtime',
      description: 'Actually runs containers (containerd, CRI-O)',
      details: [
        'Pulls container images',
        'Creates and runs containers',
        'Manages container lifecycle',
        'Implements Container Runtime Interface (CRI)'
      ],
      color: 'gray'
    }
  ];

  const podLifecycle = [
    { phase: 'Pending', desc: 'Pod accepted but not yet scheduled', color: 'yellow' },
    { phase: 'Scheduled', desc: 'Scheduler assigned pod to a node', color: 'blue' },
    { phase: 'ContainerCreating', desc: 'Pulling images, creating containers', color: 'purple' },
    { phase: 'Running', desc: 'All containers started', color: 'green' },
    { phase: 'Succeeded/Failed', desc: 'All containers terminated', color: 'gray' }
  ];

  const requestFlow = [
    { step: 1, title: 'kubectl apply', desc: 'User submits manifest to API server' },
    { step: 2, title: 'Validation', desc: 'API server validates and stores in etcd' },
    { step: 3, title: 'Scheduling', desc: 'Scheduler picks optimal node for pod' },
    { step: 4, title: 'Kubelet notified', desc: 'Node kubelet sees new pod assignment' },
    { step: 5, title: 'Container creation', desc: 'Kubelet tells runtime to start containers' },
    { step: 6, title: 'Running', desc: 'Pod running, kube-proxy sets up networking' }
  ];

  const accent = {
    blue: { badge: 'bg-blue-500/20 text-blue-300', dot: 'bg-blue-500', text: 'text-blue-400', panel: 'bg-blue-500/20 border border-blue-500/30' },
    purple: { badge: 'bg-purple-500/20 text-purple-300', dot: 'bg-purple-500', text: 'text-purple-400', panel: 'bg-purple-500/20 border border-purple-500/30' },
    green: { badge: 'bg-green-500/20 text-green-300', dot: 'bg-green-500', text: 'text-green-400', panel: 'bg-green-500/20 border border-green-500/30' },
    orange: { badge: 'bg-orange-500/20 text-orange-300', dot: 'bg-orange-500', text: 'text-orange-400', panel: 'bg-orange-500/20 border border-orange-500/30' },
    cyan: { badge: 'bg-cyan-500/20 text-cyan-300', dot: 'bg-cyan-500', text: 'text-cyan-400', panel: 'bg-cyan-500/20 border border-cyan-500/30' },
    yellow: { badge: 'bg-yellow-500/20 text-yellow-300', dot: 'bg-yellow-500', text: 'text-yellow-400', panel: 'bg-yellow-500/20 border border-yellow-500/30' },
    pink: { badge: 'bg-pink-500/20 text-pink-300', dot: 'bg-pink-500', text: 'text-pink-400', panel: 'bg-pink-500/20 border border-pink-500/30' },
    gray: { badge: 'bg-surface-800 text-surface-300 border border-surface-700', dot: 'bg-surface-600', text: 'text-surface-300', panel: 'bg-surface-800/60 border border-surface-800' }
  } as const;

  type AccentKey = keyof typeof accent;

  function getAccent(color: string): (typeof accent)[AccentKey] {
    return accent[(color in accent ? color : 'gray') as AccentKey];
  }
</script>

<svelte:head>
  <title>Kubernetes Architecture</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <h1 class="text-3xl font-bold text-surface-100 mb-2">Kubernetes Architecture</h1>
  <p class="text-surface-400 mb-8">Understanding the control plane, worker nodes, and how they work together</p>

  <!-- Overview Diagram -->
  <section class="mb-12">
    <div class="card">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Control Plane -->
        <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <h3 class="text-lg font-semibold text-blue-400 mb-4 text-center">Control Plane</h3>
          <p class="text-surface-400 text-sm text-center mb-4">The brain - makes decisions about the cluster</p>

          <div class="grid grid-cols-2 gap-3">
            {#each controlPlaneComponents.slice(0, 4) as component}
              <button
                class="p-3 rounded-lg bg-surface-900 border border-surface-800 hover:border-surface-700 transition-colors text-left"
                class:border-blue-500={selectedComponent === component.id}
                on:click={() => selectedComponent = selectedComponent === component.id ? null : component.id}
              >
                <div class="text-surface-100 font-medium text-sm">{component.name}</div>
                <div class="text-surface-500 text-xs mt-1 line-clamp-2">{component.description}</div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Worker Nodes -->
        <div class="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <h3 class="text-lg font-semibold text-green-400 mb-4 text-center">Worker Nodes</h3>
          <p class="text-surface-400 text-sm text-center mb-4">The muscle - runs your actual workloads</p>

          <div class="space-y-3">
            {#each nodeComponents as component}
              <button
                class="w-full p-3 rounded-lg bg-surface-900 border border-surface-800 hover:border-surface-700 transition-colors text-left"
                class:border-green-500={selectedComponent === component.id}
                on:click={() => selectedComponent = selectedComponent === component.id ? null : component.id}
              >
                <div class="text-surface-100 font-medium text-sm">{component.name}</div>
                <div class="text-surface-500 text-xs mt-1">{component.description}</div>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Selected Component Details -->
      {#if selectedComponent}
        {@const allComponents = [...controlPlaneComponents, ...nodeComponents]}
        {@const component = allComponents.find(c => c.id === selectedComponent)}
        {#if component}
          <div class="mt-6 p-4 bg-surface-800/60 rounded-lg border border-surface-800">
            <h4 class="text-surface-100 font-semibold mb-3">{component.name}</h4>
            <ul class="grid md:grid-cols-2 gap-2">
              {#each component.details as detail}
                <li class="flex items-start gap-2 text-surface-300 text-sm">
                  <span class="text-surface-500 mt-0.5">-</span>
                  {detail}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      {/if}
    </div>
  </section>

  <!-- Control Plane Deep Dive -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Control Plane Components</h2>

    <div class="space-y-4">
      {#each controlPlaneComponents as component}
        <div class="card">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-surface-100">{component.name}</h3>
              <p class="text-surface-400 text-sm">{component.description}</p>
            </div>
            <span class={"px-3 py-1 rounded-full text-xs font-medium " + getAccent(component.color).badge}>
              Control Plane
            </span>
          </div>
          <div class="grid md:grid-cols-2 gap-3">
            {#each component.details as detail}
              <div class="flex items-center gap-2 p-2 bg-surface-800/40 border border-surface-800 rounded-lg text-sm text-surface-300">
                <span class={"w-2 h-2 rounded-full " + getAccent(component.color).dot}></span>
                {detail}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Request Flow -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">How a Pod Gets Scheduled</h2>
    <p class="text-surface-400 mb-6">Follow the journey from kubectl apply to running pod</p>

    <div class="card">
      <div class="relative">
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-500/30"></div>
        <div class="space-y-6">
          {#each requestFlow as step}
            <div class="relative pl-16">
              <div class="absolute left-0 w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 font-bold">
                {step.step}
              </div>
              <div class="bg-surface-800/60 border border-surface-800 rounded-lg p-4">
                <div class="text-surface-100 font-medium">{step.title}</div>
                <div class="text-surface-400 text-sm mt-1">{step.desc}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Pod Lifecycle -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Pod Lifecycle</h2>

    <div class="card">
      <div class="flex flex-wrap items-center justify-center gap-4">
        {#each podLifecycle as phase, i}
          <div class="flex items-center">
            <div class={"p-3 rounded-lg text-center min-w-[120px] " + getAccent(phase.color).panel}>
              <div class={getAccent(phase.color).text + " font-semibold text-sm"}>{phase.phase}</div>
              <div class="text-surface-500 text-xs mt-1">{phase.desc}</div>
            </div>
            {#if i < podLifecycle.length - 1}
              <div class="mx-2 text-surface-600">-></div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Key Concepts -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Key Kubernetes Objects</h2>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
        <div class="text-blue-400 font-semibold mb-2">Pod</div>
        <p class="text-surface-400 text-sm">Smallest deployable unit. One or more containers that share network/storage.</p>
      </div>
      <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
        <div class="text-green-400 font-semibold mb-2">Deployment</div>
        <p class="text-surface-400 text-sm">Manages ReplicaSets. Handles rolling updates and rollbacks.</p>
      </div>
      <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
        <div class="text-purple-400 font-semibold mb-2">Service</div>
        <p class="text-surface-400 text-sm">Stable network endpoint for pods. ClusterIP, NodePort, LoadBalancer.</p>
      </div>
      <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
        <div class="text-orange-400 font-semibold mb-2">ConfigMap</div>
        <p class="text-surface-400 text-sm">Non-sensitive configuration data. Injected as env vars or files.</p>
      </div>
      <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
        <div class="text-red-400 font-semibold mb-2">Secret</div>
        <p class="text-surface-400 text-sm">Sensitive data like passwords, tokens. Base64 encoded (not encrypted!).</p>
      </div>
      <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
        <div class="text-yellow-400 font-semibold mb-2">Ingress</div>
        <p class="text-surface-400 text-sm">HTTP routing rules. Path-based routing to Services.</p>
      </div>
      <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
        <div class="text-cyan-400 font-semibold mb-2">StatefulSet</div>
        <p class="text-surface-400 text-sm">For stateful apps. Stable network identity and persistent storage.</p>
      </div>
      <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
        <div class="text-pink-400 font-semibold mb-2">DaemonSet</div>
        <p class="text-surface-400 text-sm">Run pod on every node. Used for logging, monitoring agents.</p>
      </div>
      <div class="bg-surface-900 rounded-xl p-4 border border-surface-800">
        <div class="text-indigo-400 font-semibold mb-2">HPA</div>
        <p class="text-surface-400 text-sm">Horizontal Pod Autoscaler. Scale pods based on CPU/memory/custom metrics.</p>
      </div>
    </div>
  </section>

  <!-- Networking -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Kubernetes Networking Model</h2>

    <div class="card">
      <div class="grid md:grid-cols-3 gap-6">
        <div class="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <h4 class="text-blue-400 font-semibold mb-2">Pod-to-Pod</h4>
          <p class="text-surface-400 text-sm mb-2">Every pod gets a unique IP. Pods can communicate directly without NAT.</p>
          <div class="text-xs text-surface-500">Implemented by CNI plugin (Calico, Cilium, etc.)</div>
        </div>
        <div class="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <h4 class="text-green-400 font-semibold mb-2">Pod-to-Service</h4>
          <p class="text-surface-400 text-sm mb-2">Services provide stable virtual IPs (ClusterIP). kube-proxy routes to pods.</p>
          <div class="text-xs text-surface-500">Uses iptables or IPVS rules</div>
        </div>
        <div class="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <h4 class="text-purple-400 font-semibold mb-2">External-to-Service</h4>
          <p class="text-surface-400 text-sm mb-2">NodePort, LoadBalancer, or Ingress expose services externally.</p>
          <div class="text-xs text-surface-500">Ingress for HTTP, LoadBalancer for TCP/UDP</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Common Patterns -->
  <section>
    <h2 class="text-xl font-semibold text-surface-100 mb-4">Production Best Practices</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="card">
        <h4 class="text-green-400 font-medium mb-3">DO</h4>
        <ul class="space-y-2">
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-green-400">+</span>
            Set resource requests and limits on all pods
          </li>
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-green-400">+</span>
            Use liveness and readiness probes
          </li>
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-green-400">+</span>
            Run multiple replicas with anti-affinity
          </li>
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-green-400">+</span>
            Use namespaces for isolation
          </li>
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-green-400">+</span>
            Backup etcd regularly
          </li>
        </ul>
      </div>
      <div class="card">
        <h4 class="text-red-400 font-medium mb-3">DON'T</h4>
        <ul class="space-y-2">
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-red-400">-</span>
            Run workloads on control plane nodes
          </li>
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-red-400">-</span>
            Use :latest image tags in production
          </li>
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-red-400">-</span>
            Store secrets in ConfigMaps
          </li>
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-red-400">-</span>
            Skip pod disruption budgets
          </li>
          <li class="flex items-start gap-2 text-surface-300 text-sm">
            <span class="text-red-400">-</span>
            Ignore resource quotas in multi-tenant clusters
          </li>
        </ul>
      </div>
    </div>
  </section>
</div>

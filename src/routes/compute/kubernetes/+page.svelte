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
</script>

<svelte:head>
  <title>Kubernetes Architecture</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <h1 class="text-3xl font-bold text-white mb-2">Kubernetes Architecture</h1>
  <p class="text-gray-400 mb-8">Understanding the control plane, worker nodes, and how they work together</p>

  <!-- Overview Diagram -->
  <section class="mb-12">
    <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Control Plane -->
        <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <h3 class="text-lg font-semibold text-blue-400 mb-4 text-center">Control Plane</h3>
          <p class="text-gray-400 text-sm text-center mb-4">The brain - makes decisions about the cluster</p>

          <div class="grid grid-cols-2 gap-3">
            {#each controlPlaneComponents.slice(0, 4) as component}
              <button
                class="p-3 rounded-lg bg-gray-800/50 border border-gray-600 hover:border-gray-400 transition-all text-left"
                class:border-blue-500={selectedComponent === component.id}
                on:click={() => selectedComponent = selectedComponent === component.id ? null : component.id}
              >
                <div class="text-white font-medium text-sm">{component.name}</div>
                <div class="text-gray-500 text-xs mt-1 line-clamp-2">{component.description}</div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Worker Nodes -->
        <div class="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <h3 class="text-lg font-semibold text-green-400 mb-4 text-center">Worker Nodes</h3>
          <p class="text-gray-400 text-sm text-center mb-4">The muscle - runs your actual workloads</p>

          <div class="space-y-3">
            {#each nodeComponents as component}
              <button
                class="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 hover:border-gray-400 transition-all text-left"
                class:border-green-500={selectedComponent === component.id}
                on:click={() => selectedComponent = selectedComponent === component.id ? null : component.id}
              >
                <div class="text-white font-medium text-sm">{component.name}</div>
                <div class="text-gray-500 text-xs mt-1">{component.description}</div>
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
          <div class="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <h4 class="text-white font-semibold mb-3">{component.name}</h4>
            <ul class="grid md:grid-cols-2 gap-2">
              {#each component.details as detail}
                <li class="flex items-start gap-2 text-gray-300 text-sm">
                  <span class="text-blue-400 mt-0.5">-</span>
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
    <h2 class="text-xl font-semibold text-white mb-4">Control Plane Components</h2>

    <div class="space-y-4">
      {#each controlPlaneComponents as component}
        <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white">{component.name}</h3>
              <p class="text-gray-400 text-sm">{component.description}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-{component.color}-500/20 text-{component.color}-400">
              Control Plane
            </span>
          </div>
          <div class="grid md:grid-cols-2 gap-3">
            {#each component.details as detail}
              <div class="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg text-sm text-gray-300">
                <span class="w-2 h-2 rounded-full bg-{component.color}-500"></span>
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
    <h2 class="text-xl font-semibold text-white mb-4">How a Pod Gets Scheduled</h2>
    <p class="text-gray-400 mb-6">Follow the journey from kubectl apply to running pod</p>

    <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div class="relative">
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-500/30"></div>
        <div class="space-y-6">
          {#each requestFlow as step}
            <div class="relative pl-16">
              <div class="absolute left-0 w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 font-bold">
                {step.step}
              </div>
              <div class="bg-gray-700/50 rounded-lg p-4">
                <div class="text-white font-medium">{step.title}</div>
                <div class="text-gray-400 text-sm mt-1">{step.desc}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Pod Lifecycle -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Pod Lifecycle</h2>

    <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div class="flex flex-wrap items-center justify-center gap-4">
        {#each podLifecycle as phase, i}
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-{phase.color}-500/20 border border-{phase.color}-500/30 text-center min-w-[120px]">
              <div class="text-{phase.color}-400 font-semibold text-sm">{phase.phase}</div>
              <div class="text-gray-500 text-xs mt-1">{phase.desc}</div>
            </div>
            {#if i < podLifecycle.length - 1}
              <div class="mx-2 text-gray-500">-></div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Key Concepts -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Key Kubernetes Objects</h2>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-blue-400 font-semibold mb-2">Pod</div>
        <p class="text-gray-400 text-sm">Smallest deployable unit. One or more containers that share network/storage.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-green-400 font-semibold mb-2">Deployment</div>
        <p class="text-gray-400 text-sm">Manages ReplicaSets. Handles rolling updates and rollbacks.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-purple-400 font-semibold mb-2">Service</div>
        <p class="text-gray-400 text-sm">Stable network endpoint for pods. ClusterIP, NodePort, LoadBalancer.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-orange-400 font-semibold mb-2">ConfigMap</div>
        <p class="text-gray-400 text-sm">Non-sensitive configuration data. Injected as env vars or files.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-red-400 font-semibold mb-2">Secret</div>
        <p class="text-gray-400 text-sm">Sensitive data like passwords, tokens. Base64 encoded (not encrypted!).</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-yellow-400 font-semibold mb-2">Ingress</div>
        <p class="text-gray-400 text-sm">HTTP routing rules. Path-based routing to Services.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-cyan-400 font-semibold mb-2">StatefulSet</div>
        <p class="text-gray-400 text-sm">For stateful apps. Stable network identity and persistent storage.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-pink-400 font-semibold mb-2">DaemonSet</div>
        <p class="text-gray-400 text-sm">Run pod on every node. Used for logging, monitoring agents.</p>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div class="text-indigo-400 font-semibold mb-2">HPA</div>
        <p class="text-gray-400 text-sm">Horizontal Pod Autoscaler. Scale pods based on CPU/memory/custom metrics.</p>
      </div>
    </div>
  </section>

  <!-- Networking -->
  <section class="mb-12">
    <h2 class="text-xl font-semibold text-white mb-4">Kubernetes Networking Model</h2>

    <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div class="grid md:grid-cols-3 gap-6">
        <div class="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <h4 class="text-blue-400 font-semibold mb-2">Pod-to-Pod</h4>
          <p class="text-gray-400 text-sm mb-2">Every pod gets a unique IP. Pods can communicate directly without NAT.</p>
          <div class="text-xs text-gray-500">Implemented by CNI plugin (Calico, Cilium, etc.)</div>
        </div>
        <div class="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <h4 class="text-green-400 font-semibold mb-2">Pod-to-Service</h4>
          <p class="text-gray-400 text-sm mb-2">Services provide stable virtual IPs (ClusterIP). kube-proxy routes to pods.</p>
          <div class="text-xs text-gray-500">Uses iptables or IPVS rules</div>
        </div>
        <div class="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <h4 class="text-purple-400 font-semibold mb-2">External-to-Service</h4>
          <p class="text-gray-400 text-sm mb-2">NodePort, LoadBalancer, or Ingress expose services externally.</p>
          <div class="text-xs text-gray-500">Ingress for HTTP, LoadBalancer for TCP/UDP</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Common Patterns -->
  <section>
    <h2 class="text-xl font-semibold text-white mb-4">Production Best Practices</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h4 class="text-green-400 font-medium mb-3">DO</h4>
        <ul class="space-y-2">
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-green-400">+</span>
            Set resource requests and limits on all pods
          </li>
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-green-400">+</span>
            Use liveness and readiness probes
          </li>
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-green-400">+</span>
            Run multiple replicas with anti-affinity
          </li>
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-green-400">+</span>
            Use namespaces for isolation
          </li>
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-green-400">+</span>
            Backup etcd regularly
          </li>
        </ul>
      </div>
      <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h4 class="text-red-400 font-medium mb-3">DON'T</h4>
        <ul class="space-y-2">
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-red-400">-</span>
            Run workloads on control plane nodes
          </li>
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-red-400">-</span>
            Use :latest image tags in production
          </li>
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-red-400">-</span>
            Store secrets in ConfigMaps
          </li>
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-red-400">-</span>
            Skip pod disruption budgets
          </li>
          <li class="flex items-start gap-2 text-gray-300 text-sm">
            <span class="text-red-400">-</span>
            Ignore resource quotas in multi-tenant clusters
          </li>
        </ul>
      </div>
    </div>
  </section>
</div>

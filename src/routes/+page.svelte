<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import { navigationItems } from '$lib/stores/navigation';

  const categories = [
    {
      id: 'fundamentals',
      title: 'Fundamentals',
      description: 'Core distributed systems concepts: CAP theorem, consistency, scaling',
      icon: 'BookOpen',
      href: '/fundamentals/cap-theorem'
    },
    {
      id: 'compute',
      title: 'Compute',
      description: 'VMs, serverless, containers, and Kubernetes',
      icon: 'Cpu',
      href: '/compute/virtual-machines'
    },
    {
      id: 'databases',
      title: 'Databases',
      description: 'SQL, NoSQL, caching, replication patterns',
      icon: 'Database',
      href: '/databases/sql'
    },
    {
      id: 'networking',
      title: 'Networking',
      description: 'VPC, DNS, load balancing, CDN',
      icon: 'Network',
      href: '/networking/vpc'
    },
    {
      id: 'messaging',
      title: 'Messaging',
      description: 'Message queues, pub/sub, event-driven architecture',
      icon: 'MessageSquare',
      href: '/messaging/queues'
    },
    {
      id: 'decisions',
      title: 'Decision Trees',
      description: 'Interactive guides: which database? serverless or not?',
      icon: 'GitBranch',
      href: '/decisions/which-database'
    }
  ];

  const quickLinks = [
    { label: 'SQL vs NoSQL', href: '/compare/sql-vs-nosql', icon: 'GitCompare' },
    { label: 'Kafka vs RabbitMQ', href: '/compare/kafka-vs-rabbitmq', icon: 'GitCompare' },
    { label: 'REST vs GraphQL vs gRPC', href: '/compare/api-design', icon: 'GitCompare' },
    { label: 'Which Database?', href: '/decisions/which-database', icon: 'HelpCircle' }
  ];

  function getIcon(iconName: string) {
    return (Icons as Record<string, typeof Icons.Box>)[iconName] || Icons.Box;
  }
</script>

<svelte:head>
  <title>System Design Explorer</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-12">
  <!-- Hero Section -->
  <div class="text-center space-y-6 py-8">
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-900 border border-surface-800 text-surface-300 text-sm">
      <Icons.Sparkles class="w-4 h-4" />
      Interactive Visual Learning
    </div>
    
    <h1 class="text-4xl md:text-5xl font-bold text-surface-100">
      Master System Design
    </h1>
    
    <p class="text-lg text-surface-400 max-w-2xl mx-auto">
      Learn cloud infrastructure, distributed systems, and architecture patterns through 
      interactive diagrams, visual comparisons, and decision-guided walkthroughs.
    </p>

    <div class="flex justify-center gap-4">
      <a href="/fundamentals/cap-theorem" class="btn-primary flex items-center gap-2">
        <Icons.Play class="w-4 h-4" />
        Start Learning
      </a>
      <a href="/decisions/which-database" class="btn-secondary flex items-center gap-2">
        <Icons.GitBranch class="w-4 h-4" />
        Try Decision Tree
      </a>
    </div>
  </div>

  <!-- Category Cards -->
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each categories as category}
      {@const Icon = getIcon(category.icon)}
      <a 
        href={category.href}
        class="card-hover group"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center flex-shrink-0 group-hover:border-surface-600 transition-colors duration-200">
            <Icon class="w-6 h-6 text-surface-200" />
          </div>
          <div>
            <h3 class="font-semibold text-surface-100 group-hover:text-white transition-colors">
              {category.title}
            </h3>
            <p class="text-sm text-surface-400 mt-1">{category.description}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-surface-400 group-hover:text-surface-200">
          <span>Explore</span>
          <Icons.ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </a>
    {/each}
  </div>

  <!-- Quick Comparisons -->
  <div class="card">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center">
        <Icons.Scale class="w-5 h-5 text-surface-300" />
      </div>
      <div>
        <h2 class="font-semibold text-surface-100">Quick Comparisons</h2>
        <p class="text-sm text-surface-400">Side-by-side analysis with "when to use" guidance</p>
      </div>
    </div>
    
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {#each quickLinks as link}
        {@const Icon = getIcon(link.icon)}
        <a 
          href={link.href}
          class="flex items-center gap-3 p-3 rounded-lg bg-surface-800 hover:bg-surface-700 transition-colors"
        >
          <Icon class="w-5 h-5 text-surface-400" />
          <span class="text-sm text-surface-200">{link.label}</span>
        </a>
      {/each}
    </div>
  </div>

  <!-- Cloud Providers Section -->
  <div class="grid md:grid-cols-2 gap-6">
    <!-- AWS -->
    <div class="card border-aws-orange/30">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-lg bg-aws-orange/20 flex items-center justify-center">
          <Icons.Cloud class="w-5 h-5 text-aws-orange" />
        </div>
        <div>
          <h3 class="font-semibold text-surface-100">Amazon Web Services</h3>
          <p class="text-xs text-surface-500">EC2, S3, Lambda, RDS, EKS, and more</p>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2">
        {#each ['EC2', 'S3', 'Lambda', 'RDS', 'EKS', 'SQS'] as service}
          <div class="px-2 py-1 rounded bg-aws-orange/10 text-aws-orange text-xs text-center">
            {service}
          </div>
        {/each}
      </div>
    </div>

    <!-- GCP -->
    <div class="card border-gcp-blue/30">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-lg bg-gcp-blue/20 flex items-center justify-center">
          <Icons.Cloud class="w-5 h-5 text-gcp-blue" />
        </div>
        <div>
          <h3 class="font-semibold text-surface-100">Google Cloud Platform</h3>
          <p class="text-xs text-surface-500">Compute Engine, Cloud Storage, GKE, and more</p>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2">
        {#each ['Compute', 'Storage', 'GKE', 'Cloud SQL', 'Pub/Sub', 'BigQuery'] as service}
          <div class="px-2 py-1 rounded bg-gcp-blue/10 text-gcp-blue text-xs text-center">
            {service}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Key Concepts Preview -->
  <div class="card">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center">
        <Icons.Lightbulb class="w-5 h-5 text-surface-300" />
      </div>
      <div>
        <h2 class="font-semibold text-surface-100">Key Concepts You'll Learn</h2>
        <p class="text-sm text-surface-400">Each with interactive diagrams and real-world examples</p>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each [
        { name: 'CAP Theorem', desc: 'Consistency, Availability, Partition Tolerance trade-offs' },
        { name: 'Load Balancing', desc: 'L4 vs L7, algorithms, health checks' },
        { name: 'Database Sharding', desc: 'Horizontal scaling, partition strategies' },
        { name: 'Caching Patterns', desc: 'Cache-aside, write-through, invalidation' },
        { name: 'Message Queues', desc: 'When to use Kafka vs RabbitMQ vs SQS' },
        { name: 'Kubernetes', desc: 'Pods, services, deployments, scaling' }
      ] as concept}
        <div class="p-4 rounded-lg bg-surface-800/50 border border-surface-700">
          <h4 class="font-medium text-surface-200">{concept.name}</h4>
          <p class="text-xs text-surface-500 mt-1">{concept.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</div>

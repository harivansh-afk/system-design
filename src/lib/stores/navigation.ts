import { writable } from 'svelte/store';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  children?: NavItem[];
}

export const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Overview',
    icon: 'Home',
    href: '/'
  },
  {
    id: 'fundamentals',
    label: 'Fundamentals',
    icon: 'BookOpen',
    href: '/fundamentals',
    children: [
      { id: 'cap-theorem', label: 'CAP Theorem', icon: 'Triangle', href: '/fundamentals/cap-theorem' },
      { id: 'consistency', label: 'Consistency Models', icon: 'RefreshCw', href: '/fundamentals/consistency' },
      { id: 'scaling', label: 'Scaling', icon: 'TrendingUp', href: '/fundamentals/scaling' },
      { id: 'latency', label: 'Latency vs Throughput', icon: 'Gauge', href: '/fundamentals/latency' }
    ]
  },
  {
    id: 'compute',
    label: 'Compute',
    icon: 'Cpu',
    href: '/compute',
    children: [
      { id: 'vms', label: 'Virtual Machines', icon: 'Server', href: '/compute/virtual-machines' },
      { id: 'serverless', label: 'Serverless', icon: 'Zap', href: '/compute/serverless' },
      { id: 'containers', label: 'Containers', icon: 'Box', href: '/compute/containers' },
      { id: 'kubernetes', label: 'Kubernetes', icon: 'Boxes', href: '/compute/kubernetes' }
    ]
  },
  {
    id: 'storage',
    label: 'Storage',
    icon: 'HardDrive',
    href: '/storage',
    children: [
      { id: 'object', label: 'Object Storage', icon: 'File', href: '/storage/object' },
      { id: 'block', label: 'Block Storage', icon: 'Database', href: '/storage/block' },
      { id: 'file', label: 'File Storage', icon: 'Folder', href: '/storage/file' }
    ]
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: 'Database',
    href: '/databases',
    children: [
      { id: 'sql', label: 'SQL Databases', icon: 'Table', href: '/databases/sql' },
      { id: 'nosql', label: 'NoSQL Databases', icon: 'FileJson', href: '/databases/nosql' },
      { id: 'cache', label: 'Caching', icon: 'Layers', href: '/databases/caching' },
      { id: 'replication', label: 'Replication', icon: 'Copy', href: '/databases/replication' }
    ]
  },
  {
    id: 'networking',
    label: 'Networking',
    icon: 'Network',
    href: '/networking',
    children: [
      { id: 'vpc', label: 'VPC & Subnets', icon: 'Globe', href: '/networking/vpc' },
      { id: 'dns', label: 'DNS', icon: 'Link', href: '/networking/dns' },
      { id: 'load-balancing', label: 'Load Balancing', icon: 'Scale', href: '/networking/load-balancing' },
      { id: 'cdn', label: 'CDN', icon: 'Radio', href: '/networking/cdn' }
    ]
  },
  {
    id: 'messaging',
    label: 'Messaging',
    icon: 'MessageSquare',
    href: '/messaging',
    children: [
      { id: 'queues', label: 'Message Queues', icon: 'ListOrdered', href: '/messaging/queues' },
      { id: 'pubsub', label: 'Pub/Sub', icon: 'Bell', href: '/messaging/pubsub' },
      { id: 'event-driven', label: 'Event-Driven', icon: 'Activity', href: '/messaging/event-driven' }
    ]
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'Shield',
    href: '/security',
    children: [
      { id: 'iam', label: 'IAM', icon: 'Key', href: '/security/iam' },
      { id: 'encryption', label: 'Encryption', icon: 'Lock', href: '/security/encryption' },
      { id: 'secrets', label: 'Secrets Management', icon: 'KeyRound', href: '/security/secrets' }
    ]
  },
  {
    id: 'compare',
    label: 'Compare',
    icon: 'GitCompare',
    href: '/compare',
    children: [
      { id: 'sql-vs-nosql', label: 'SQL vs NoSQL', icon: 'GitCompare', href: '/compare/sql-vs-nosql' },
      { id: 'kafka-vs-rabbitmq', label: 'Kafka vs RabbitMQ', icon: 'GitCompare', href: '/compare/kafka-vs-rabbitmq' },
      { id: 'rest-vs-graphql', label: 'REST vs GraphQL vs gRPC', icon: 'GitCompare', href: '/compare/api-design' }
    ]
  },
  {
    id: 'decisions',
    label: 'Decision Trees',
    icon: 'GitBranch',
    href: '/decisions',
    children: [
      { id: 'which-database', label: 'Which Database?', icon: 'HelpCircle', href: '/decisions/which-database' },
      { id: 'serverless-or-not', label: 'Serverless or Not?', icon: 'HelpCircle', href: '/decisions/serverless' },
      { id: 'which-queue', label: 'Which Message Queue?', icon: 'HelpCircle', href: '/decisions/which-queue' }
    ]
  }
];

export const sidebarOpen = writable(true);
export const activeSection = writable('home');
export const expandedSections = writable<Set<string>>(new Set(['fundamentals']));

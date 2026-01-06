<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import DecisionTree from '$lib/components/diagrams/DecisionTree.svelte';

  const nodes = [
    // Start
    {
      id: 'start',
      type: 'question' as const,
      text: 'Do you need complex queries with JOINs across multiple tables?',
      description: 'Think about your main query patterns. Will you frequently combine data from different sources?',
      yes: 'acid-needed',
      no: 'data-structure'
    },
    // SQL Path
    {
      id: 'acid-needed',
      type: 'question' as const,
      text: 'Do you need ACID transactions?',
      description: 'Atomicity, Consistency, Isolation, Durability - critical for financial data, inventory, bookings',
      yes: 'sql-answer',
      no: 'read-heavy'
    },
    {
      id: 'read-heavy',
      type: 'question' as const,
      text: 'Is your workload read-heavy with complex analytics?',
      description: 'Reporting, dashboards, aggregations across large datasets',
      yes: 'sql-analytics',
      no: 'sql-general'
    },
    {
      id: 'sql-answer',
      type: 'answer' as const,
      text: 'PostgreSQL',
      icon: 'Database',
      reasoning: 'You need JOINs AND ACID transactions. PostgreSQL is the gold standard - it handles complex queries, has excellent ACID support, JSON support for flexibility, and scales well with read replicas.',
      alternatives: [
        'MySQL - If you need simpler replication',
        'CockroachDB - If you need global distribution',
        'Cloud SQL / RDS - For managed hosting'
      ]
    },
    {
      id: 'sql-analytics',
      type: 'answer' as const,
      text: 'PostgreSQL + Analytics DB',
      icon: 'BarChart',
      reasoning: 'For heavy analytics, consider PostgreSQL for OLTP (transactions) plus a specialized analytics database like ClickHouse or BigQuery for OLAP (analytics). Replicate data between them.',
      alternatives: [
        'TimescaleDB - If time-series analytics',
        'Redshift/BigQuery - For massive data warehousing',
        'DuckDB - For embedded analytics'
      ]
    },
    {
      id: 'sql-general',
      type: 'answer' as const,
      text: 'PostgreSQL (or MySQL)',
      icon: 'Table',
      reasoning: 'You need JOINs but not strict ACID. PostgreSQL still works great here, or MySQL if your team knows it better. Both are excellent general-purpose relational databases.',
      alternatives: [
        'MySQL - Wide adoption, simpler',
        'MariaDB - MySQL fork with more features',
        'SQLite - For embedded/local use'
      ]
    },
    // NoSQL Path
    {
      id: 'data-structure',
      type: 'question' as const,
      text: 'Is your data hierarchical or document-like (JSON)?',
      description: 'Think: user profiles, product catalogs, content with varying attributes',
      yes: 'schema-flexibility',
      no: 'access-pattern'
    },
    {
      id: 'schema-flexibility',
      type: 'question' as const,
      text: 'Does your schema change frequently?',
      description: 'Adding new fields often? Different documents have different structures?',
      yes: 'document-answer',
      no: 'document-consistency'
    },
    {
      id: 'document-consistency',
      type: 'question' as const,
      text: 'Do you need strong consistency?',
      description: 'Every read must return the latest write, no stale data acceptable',
      yes: 'document-strong',
      no: 'document-answer'
    },
    {
      id: 'document-answer',
      type: 'answer' as const,
      text: 'MongoDB',
      icon: 'FileJson',
      reasoning: 'Flexible document structure, great for evolving schemas. Handles JSON-like data naturally. Good balance of flexibility and features.',
      alternatives: [
        'Firestore - If using Firebase/GCP',
        'CouchDB - If you need offline sync',
        'DocumentDB - AWS managed MongoDB-compatible'
      ]
    },
    {
      id: 'document-strong',
      type: 'answer' as const,
      text: 'MongoDB or Firestore',
      icon: 'FileJson',
      reasoning: 'Both support configurable consistency levels. MongoDB with "majority" write concern and read concern gives you strong consistency. Firestore provides strong consistency by default.',
      alternatives: [
        'FaunaDB - Strong consistency by design',
        'PostgreSQL with JSONB - Best of both worlds'
      ]
    },
    // Key-Value/Cache Path
    {
      id: 'access-pattern',
      type: 'question' as const,
      text: 'Is your primary access pattern key-based lookups?',
      description: 'GET by ID, SET by ID - simple operations at high speed',
      yes: 'persistence-needed',
      no: 'time-series-check'
    },
    {
      id: 'persistence-needed',
      type: 'question' as const,
      text: 'Do you need data persistence (survive restarts)?',
      description: 'Or is this for caching/sessions that can be rebuilt?',
      yes: 'distributed-keyvalue',
      no: 'cache-answer'
    },
    {
      id: 'cache-answer',
      type: 'answer' as const,
      text: 'Redis',
      icon: 'Zap',
      reasoning: 'Lightning-fast in-memory storage. Perfect for caching, sessions, leaderboards, rate limiting. Supports TTL for automatic expiration. Can persist to disk if needed.',
      alternatives: [
        'Memcached - Simpler, multi-threaded',
        'KeyDB - Redis fork, multi-threaded',
        'Dragonfly - Modern Redis alternative'
      ]
    },
    {
      id: 'distributed-keyvalue',
      type: 'question' as const,
      text: 'Do you need global distribution and auto-scaling?',
      description: 'Multiple regions, managed infrastructure, serverless scaling',
      yes: 'dynamo-answer',
      no: 'redis-persistent'
    },
    {
      id: 'dynamo-answer',
      type: 'answer' as const,
      text: 'DynamoDB',
      icon: 'Cloud',
      reasoning: 'Fully managed, globally distributed, auto-scaling key-value store. Pay per request. Excellent for serverless architectures. Single-digit millisecond latency at any scale.',
      alternatives: [
        'Cosmos DB - If on Azure',
        'Cloud Spanner - If need SQL with global distribution',
        'ScyllaDB - Self-hosted Cassandra-compatible'
      ]
    },
    {
      id: 'redis-persistent',
      type: 'answer' as const,
      text: 'Redis with Persistence',
      icon: 'Database',
      reasoning: 'Redis with AOF (Append-Only File) or RDB snapshots gives you persistence. Great for primary key-value storage with backup. Consider Redis Cluster for horizontal scaling.',
      alternatives: [
        'Valkey - Redis fork (open source)',
        'KeyDB - Multi-threaded Redis',
        'Managed: ElastiCache, MemoryDB'
      ]
    },
    // Time-Series/Wide-Column Path
    {
      id: 'time-series-check',
      type: 'question' as const,
      text: 'Is your data time-series or event-based?',
      description: 'IoT sensors, metrics, logs, events with timestamps',
      yes: 'time-series-scale',
      no: 'graph-check'
    },
    {
      id: 'time-series-scale',
      type: 'question' as const,
      text: 'Do you need massive write throughput (millions/sec)?',
      description: 'IoT at scale, real-time analytics, high-frequency data',
      yes: 'widecolumn-answer',
      no: 'timeseries-answer'
    },
    {
      id: 'timeseries-answer',
      type: 'answer' as const,
      text: 'TimescaleDB or InfluxDB',
      icon: 'LineChart',
      reasoning: 'Purpose-built for time-series data. TimescaleDB extends PostgreSQL (familiar SQL). InfluxDB is pure time-series with its own query language. Both handle time-based queries efficiently.',
      alternatives: [
        'QuestDB - Faster ingestion',
        'Prometheus - For metrics specifically',
        'ClickHouse - For analytics on time-series'
      ]
    },
    {
      id: 'widecolumn-answer',
      type: 'answer' as const,
      text: 'Cassandra or ScyllaDB',
      icon: 'LayoutGrid',
      reasoning: 'Designed for massive write throughput across many nodes. Wide-column stores excel at time-series at scale. ScyllaDB is a faster C++ rewrite of Cassandra.',
      alternatives: [
        'Bigtable - GCP managed',
        'HBase - Hadoop ecosystem',
        'ClickHouse - For analytics focus'
      ]
    },
    // Graph Path
    {
      id: 'graph-check',
      type: 'question' as const,
      text: 'Do you need to query complex relationships?',
      description: 'Social networks, recommendations, fraud detection, knowledge graphs',
      yes: 'graph-answer',
      no: 'search-check'
    },
    {
      id: 'graph-answer',
      type: 'answer' as const,
      text: 'Neo4j',
      icon: 'Share2',
      reasoning: 'Native graph database - relationships are first-class citizens. Cypher query language makes traversing connections intuitive. Perfect for "friends of friends" or "shortest path" queries.',
      alternatives: [
        'Neptune - AWS managed',
        'ArangoDB - Multi-model (graph + document)',
        'Dgraph - Distributed graph'
      ]
    },
    // Search Path
    {
      id: 'search-check',
      type: 'question' as const,
      text: 'Do you need full-text search or fuzzy matching?',
      description: 'Search boxes, autocomplete, finding documents by content',
      yes: 'search-answer',
      no: 'fallback-answer'
    },
    {
      id: 'search-answer',
      type: 'answer' as const,
      text: 'Elasticsearch or Meilisearch',
      icon: 'Search',
      reasoning: 'Elasticsearch is the industry standard for full-text search, logging, and analytics. Meilisearch is simpler and faster for typical search use cases.',
      alternatives: [
        'OpenSearch - Open-source Elasticsearch',
        'Algolia - Managed search service',
        'Typesense - Simple, fast alternative'
      ]
    },
    // Fallback
    {
      id: 'fallback-answer',
      type: 'answer' as const,
      text: 'Start with PostgreSQL',
      icon: 'Database',
      reasoning: 'When in doubt, PostgreSQL is a safe choice. It handles JSON (document-like), has full-text search, and scales well. You can always add specialized databases later when you identify specific needs.',
      alternatives: [
        'SQLite - For embedded/local',
        'Supabase - Managed PostgreSQL + extras',
        'PlanetScale - Managed MySQL'
      ]
    }
  ];
</script>

<svelte:head>
  <title>Which Database? - System Design Explorer</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-8">
  <!-- Header -->
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/decisions" class="hover:text-surface-300">Decision Trees</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">Which Database?</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">Which Database Should I Use?</h1>
    <p class="text-surface-400 mt-2">
      Answer a few questions about your use case, and we'll recommend the best database for your needs.
    </p>
  </div>

  <!-- Decision Tree -->
  <DecisionTree
    title=""
    subtitle=""
    {nodes}
    startNode="start"
  />

  <!-- Quick Reference -->
  <div class="card">
    <h3 class="text-lg font-semibold text-surface-100 mb-4">Quick Reference</h3>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-surface-400 uppercase tracking-wide">By Use Case</h4>
        {#each [
          { case: 'E-commerce orders', db: 'PostgreSQL' },
          { case: 'User profiles', db: 'MongoDB' },
          { case: 'Session caching', db: 'Redis' },
          { case: 'IoT sensor data', db: 'TimescaleDB' },
          { case: 'Social graph', db: 'Neo4j' }
        ] as item}
          <div class="flex items-center justify-between p-2 bg-surface-800 rounded-lg">
            <span class="text-sm text-surface-300">{item.case}</span>
            <span class="text-sm font-medium text-surface-200">{item.db}</span>
          </div>
        {/each}
      </div>
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-surface-400 uppercase tracking-wide">By Data Type</h4>
        {#each [
          { type: 'Relational', db: 'PostgreSQL/MySQL' },
          { type: 'Documents', db: 'MongoDB/Firestore' },
          { type: 'Key-Value', db: 'Redis/DynamoDB' },
          { type: 'Time-Series', db: 'TimescaleDB/InfluxDB' },
          { type: 'Graph', db: 'Neo4j/Neptune' }
        ] as item}
          <div class="flex items-center justify-between p-2 bg-surface-800 rounded-lg">
            <span class="text-sm text-surface-300">{item.type}</span>
            <span class="text-sm font-medium text-surface-200">{item.db}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex justify-between items-center pt-4 border-t border-surface-800">
    <a href="/decisions" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" />
      All Decision Trees
    </a>
    <a href="/compare/sql-vs-nosql" class="btn-primary flex items-center gap-2">
      Compare SQL vs NoSQL
      <Icons.GitCompare class="w-4 h-4" />
    </a>
  </div>
</div>

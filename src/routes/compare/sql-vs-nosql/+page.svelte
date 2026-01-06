<script lang="ts">
  import * as Icons from 'lucide-svelte';
  import ComparisonTable from '$lib/components/diagrams/ComparisonTable.svelte';

  const options = [
    {
      id: 'sql',
      name: 'SQL (Relational)',
      color: '#3B82F6',
      icon: 'Table',
      whenToUse: [
        'Complex queries with JOINs across multiple tables',
        'ACID compliance is required (financial transactions)',
        'Data has clear relationships and fixed schema',
        'Strong data integrity and consistency needed',
        'Reporting and analytics with complex aggregations'
      ],
      whenNotToUse: [
        'Rapidly changing or unknown schema',
        'Massive horizontal scaling requirements',
        'Simple key-value lookups at extreme scale',
        'Hierarchical or document-like data',
        'Write-heavy workloads at massive scale'
      ],
      realWorldExample: 'E-commerce order management: Orders, customers, products, and inventory have clear relationships. You need to JOIN tables to show "all orders for customer X with product details" and ensure inventory counts are accurate with ACID transactions.'
    },
    {
      id: 'nosql-document',
      name: 'NoSQL (Document)',
      color: '#22C55E',
      icon: 'FileJson',
      whenToUse: [
        'Flexible, evolving schema',
        'Hierarchical or nested data (JSON-like)',
        'Rapid development with changing requirements',
        'Content management and user profiles',
        'Each document is largely self-contained'
      ],
      whenNotToUse: [
        'Heavy relational queries (many JOINs)',
        'Strong consistency is critical',
        'Complex transactions across documents',
        'Data has clear tabular structure',
        'Strict schema enforcement needed'
      ],
      realWorldExample: 'Product catalog: Each product can have different attributes (electronics vs clothing). Schema evolves as you add new product types. MongoDB stores each product as a document with flexible fields.'
    },
    {
      id: 'nosql-keyvalue',
      name: 'NoSQL (Key-Value)',
      color: '#EAB308',
      icon: 'Key',
      whenToUse: [
        'Session storage and caching',
        'Simple lookups by key at extreme speed',
        'Leaderboards and counters',
        'Shopping carts and temporary data',
        'Real-time data with TTL (expiration)'
      ],
      whenNotToUse: [
        'Complex queries beyond key lookup',
        'Relational data with JOINs',
        'Full-text search requirements',
        'Data needs to be queried by multiple fields',
        'Complex data structures'
      ],
      realWorldExample: 'Session storage in Redis: User logs in, you store session data with key "session:user123". Lightning-fast lookups. Automatic expiration after 30 minutes. Perfect for caching database query results.'
    },
    {
      id: 'nosql-widecolumn',
      name: 'NoSQL (Wide-Column)',
      color: '#EC4899',
      icon: 'LayoutGrid',
      whenToUse: [
        'Time-series data (IoT, metrics, logs)',
        'Massive write throughput needed',
        'Data partitioned by time or ID',
        'Distributed across many nodes',
        'Write-heavy with sequential reads'
      ],
      whenNotToUse: [
        'Ad-hoc queries on any column',
        'Complex JOINs or aggregations',
        'Small datasets (overkill)',
        'Strong consistency requirements',
        'Frequent schema changes'
      ],
      realWorldExample: 'IoT sensor data in Cassandra: Millions of sensors writing data every second. Partition by sensor_id and cluster by timestamp. Query pattern: "get all readings for sensor X in the last hour."'
    }
  ];

  const features = [
    {
      feature: 'Schema',
      description: 'How data structure is defined',
      values: {
        sql: 'Fixed, predefined schema',
        'nosql-document': 'Flexible, dynamic schema',
        'nosql-keyvalue': 'Schema-less (key-value pairs)',
        'nosql-widecolumn': 'Flexible columns per row'
      }
    },
    {
      feature: 'Data Model',
      description: 'How data is organized',
      values: {
        sql: 'Tables with rows and columns',
        'nosql-document': 'JSON-like documents',
        'nosql-keyvalue': 'Simple key-value pairs',
        'nosql-widecolumn': 'Column families'
      }
    },
    {
      feature: 'Scaling',
      description: 'How to handle growth',
      values: {
        sql: 'Vertical (bigger server)',
        'nosql-document': 'Horizontal (more servers)',
        'nosql-keyvalue': 'Horizontal (more servers)',
        'nosql-widecolumn': 'Horizontal (more servers)'
      }
    },
    {
      feature: 'ACID Transactions',
      description: 'Atomicity, Consistency, Isolation, Durability',
      values: {
        sql: true,
        'nosql-document': 'Partial (single document)',
        'nosql-keyvalue': false,
        'nosql-widecolumn': 'Partial (row-level)'
      }
    },
    {
      feature: 'JOINs',
      description: 'Combining data from multiple sources',
      values: {
        sql: true,
        'nosql-document': false,
        'nosql-keyvalue': false,
        'nosql-widecolumn': false
      }
    },
    {
      feature: 'Query Language',
      description: 'How you retrieve data',
      values: {
        sql: 'SQL (standardized)',
        'nosql-document': 'Proprietary (varies)',
        'nosql-keyvalue': 'GET/SET operations',
        'nosql-widecolumn': 'CQL (SQL-like)'
      }
    },
    {
      feature: 'Consistency',
      description: 'Data accuracy guarantees',
      values: {
        sql: 'Strong consistency',
        'nosql-document': 'Tunable (eventual to strong)',
        'nosql-keyvalue': 'Eventual consistency',
        'nosql-widecolumn': 'Tunable consistency'
      }
    },
    {
      feature: 'Read Performance',
      values: {
        sql: 'Good (with indexes)',
        'nosql-document': 'Excellent (by _id)',
        'nosql-keyvalue': 'Excellent (by key)',
        'nosql-widecolumn': 'Good (by partition key)'
      }
    },
    {
      feature: 'Write Performance',
      values: {
        sql: 'Good',
        'nosql-document': 'Excellent',
        'nosql-keyvalue': 'Excellent',
        'nosql-widecolumn': 'Excellent'
      }
    },
    {
      feature: 'Examples',
      values: {
        sql: 'PostgreSQL, MySQL, SQL Server',
        'nosql-document': 'MongoDB, Firestore, CouchDB',
        'nosql-keyvalue': 'Redis, DynamoDB, Memcached',
        'nosql-widecolumn': 'Cassandra, Bigtable, ScyllaDB'
      }
    }
  ];
</script>

<svelte:head>
  <title>SQL vs NoSQL - System Design Explorer</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-8">
  <!-- Header -->
  <div>
    <div class="flex items-center gap-2 text-surface-500 text-sm mb-2">
      <a href="/compare" class="hover:text-surface-300">Compare</a>
      <Icons.ChevronRight class="w-4 h-4" />
      <span class="text-surface-300">SQL vs NoSQL</span>
    </div>
    <h1 class="text-3xl font-bold text-surface-100">SQL vs NoSQL Databases</h1>
    <p class="text-surface-400 mt-2">
      Understanding when to use relational vs non-relational databases for your use case.
    </p>
  </div>

  <!-- Quick Summary Cards -->
  <div class="grid md:grid-cols-2 gap-4">
    <div class="card border-blue-500/30">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Icons.Table class="w-5 h-5 text-blue-400" />
        </div>
        <span class="font-semibold text-surface-100">SQL in a Nutshell</span>
      </div>
      <p class="text-sm text-surface-400">
        Structured data in tables with relationships. Strong consistency, ACID transactions, 
        complex queries with JOINs. Scale vertically. Best when data structure is known and 
        relationships matter.
      </p>
    </div>

    <div class="card border-green-500/30">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Icons.FileJson class="w-5 h-5 text-green-400" />
        </div>
        <span class="font-semibold text-surface-100">NoSQL in a Nutshell</span>
      </div>
      <p class="text-sm text-surface-400">
        Flexible schemas, horizontal scaling, eventual consistency. Different types for 
        different needs: documents, key-value, wide-column, graph. Best for scale, 
        flexibility, and specific access patterns.
      </p>
    </div>
  </div>

  <!-- Comparison Table -->
  <ComparisonTable 
    title="Feature Comparison"
    subtitle="Click on a column header to see detailed guidance"
    {options}
    {features}
  />

  <!-- The Real Question -->
  <div class="card">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center flex-shrink-0">
        <Icons.Lightbulb class="w-5 h-5 text-surface-300" />
      </div>
      <div>
        <h3 class="font-semibold text-surface-100 mb-2">The Real Question to Ask</h3>
        <p class="text-surface-300 text-sm mb-4">
          Instead of "SQL or NoSQL?", ask yourself these questions:
        </p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex items-start gap-2">
              <Icons.HelpCircle class="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span class="text-sm text-surface-300">What are my query patterns? (JOINs? Key lookups?)</span>
            </div>
            <div class="flex items-start gap-2">
              <Icons.HelpCircle class="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span class="text-sm text-surface-300">How important is consistency vs availability?</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-start gap-2">
              <Icons.HelpCircle class="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span class="text-sm text-surface-300">Will my schema evolve frequently?</span>
            </div>
            <div class="flex items-start gap-2">
              <Icons.HelpCircle class="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span class="text-sm text-surface-300">What scale do I need to handle?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Common Patterns -->
  <div class="card">
    <h3 class="text-lg font-semibold text-surface-100 mb-4">Common Patterns in Production</h3>
    <div class="space-y-4">
      <div class="flex items-start gap-4 p-4 bg-surface-800 rounded-lg">
        <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-blue-400">1</span>
        </div>
        <div>
          <h4 class="font-medium text-surface-200">Polyglot Persistence</h4>
          <p class="text-sm text-surface-400 mt-1">
            Use multiple databases for different needs. PostgreSQL for transactions, Redis for caching, 
            Elasticsearch for search, MongoDB for flexible data. Match the database to the use case.
          </p>
        </div>
      </div>

      <div class="flex items-start gap-4 p-4 bg-surface-800 rounded-lg">
        <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-green-400">2</span>
        </div>
        <div>
          <h4 class="font-medium text-surface-200">Start with SQL, Add NoSQL Later</h4>
          <p class="text-sm text-surface-400 mt-1">
            Begin with PostgreSQL - it's versatile, well-understood, and handles most use cases. 
            Add specialized databases when you hit specific scaling or performance needs.
          </p>
        </div>
      </div>

      <div class="flex items-start gap-4 p-4 bg-surface-800 rounded-lg">
        <div class="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-yellow-400">3</span>
        </div>
        <div>
          <h4 class="font-medium text-surface-200">Cache Hot Data</h4>
          <p class="text-sm text-surface-400 mt-1">
            Use Redis in front of your primary database. Most apps have hot data (frequently accessed) 
            and cold data. Cache the hot data for massive performance gains without changing your primary DB.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex justify-between items-center pt-4 border-t border-surface-800">
    <a href="/compare" class="btn-secondary flex items-center gap-2">
      <Icons.ArrowLeft class="w-4 h-4" />
      All Comparisons
    </a>
    <a href="/decisions/which-database" class="btn-primary flex items-center gap-2">
      Try Decision Tree
      <Icons.GitBranch class="w-4 h-4" />
    </a>
  </div>
</div>

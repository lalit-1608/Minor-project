// Detailed Course Syllabus, Units, Chapters, and Practical Labs
// Formatted in student-friendly language with clean module breakdown.

export const COURSE_CURRICULA = {
  // --- COMPUTER SCIENCE & ENGINEERING ---
  'sub-cs701': {
    code: 'CS701',
    name: 'Machine Learning',
    credits: '4 Credits (3L + 1T + 2P)',
    type: 'Professional Core',
    totalHours: '45 Lecture Hours + 30 Lab Hours',
    description: 'Learn how computers learn patterns from real-world data without being explicitly programmed. Covers modern machine learning algorithms from regression and neural networks to clustering and reinforcement learning.',
    prerequisites: 'Python Programming, Linear Algebra, Probability & Statistics',
    gradingScheme: [
      { component: 'Midterm Examination', weight: 20, description: 'Theory exam on Units 1 & 2' },
      { component: 'Practical Lab & Viva', weight: 25, description: 'Coding assignments in Python & Scikit-Learn' },
      { component: 'Class Quizzes & Assignments', weight: 15, description: 'Doubt clearing checks and trap questions' },
      { component: 'Final University Exam', weight: 40, description: 'Comprehensive theory examination' }
    ],
    books: {
      primary: 'Pattern Recognition and Machine Learning — Christopher M. Bishop',
      reference: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow — Aurélien Géron'
    },
    learningOutcomes: [
      'Build, train, and evaluate supervised and unsupervised machine learning models.',
      'Understand the mathematical intuition behind gradient descent, cost functions, and backpropagation.',
      'Diagnose and fix model overfitting, underfitting, and high-variance bottlenecks.'
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Unit 1: Foundations & Supervised Linear Models',
        duration: '9 Hours',
        summary: 'Core machine learning setup, hypothesis functions, and regression basics.',
        chapters: [
          'Chapter 1: Introduction to Machine Learning (Supervised vs Unsupervised vs Reinforcement)',
          'Chapter 2: Univariate Linear Regression, Hypothesis Function, and Mean Squared Error',
          'Chapter 3: Gradient Descent Optimization, Learning Rate Tuning & Convergence',
          'Chapter 4: Multivariate Regression, Feature Scaling, and Normal Equation'
        ],
        keyConcepts: ['Cost Function', 'Gradient Descent', 'Feature Scaling', 'Normal Equation'],
        labPractice: 'Lab 1: Implement univariate Linear Regression and Batch Gradient Descent from scratch in NumPy.'
      },
      {
        unitNumber: 2,
        title: 'Unit 2: Classification & Regularization',
        duration: '10 Hours',
        summary: 'Predicting discrete categories, decision boundaries, and preventing overfitting.',
        chapters: [
          'Chapter 5: Logistic Regression & Sigmoid Hypothesis Function',
          'Chapter 6: Decision Boundaries & Multi-Class Classification (One-vs-Rest)',
          'Chapter 7: The Overfitting Problem: High Bias vs High Variance Trade-off',
          'Chapter 8: Regularization Techniques: Ridge (L2) & Lasso (L1) Penalty'
        ],
        keyConcepts: ['Sigmoid Function', 'Cross-Entropy Loss', 'Overfitting', 'L1/L2 Regularization'],
        labPractice: 'Lab 2: Classify handwritten digits (MNIST dataset) using Logistic Regression with L2 Regularization.'
      },
      {
        unitNumber: 3,
        title: 'Unit 3: Deep Neural Networks & Backpropagation',
        duration: '10 Hours',
        summary: 'Multi-layer perceptrons, forward propagation, and calculus-based gradient backprop.',
        chapters: [
          'Chapter 9: Biological vs Artificial Neurons and Activation Functions (ReLU, Sigmoid, Tanh)',
          'Chapter 10: Multi-Layer Perceptrons (MLP) & Forward Propagation Matrix Operations',
          'Chapter 11: Vector Calculus Foundations of Backpropagation & Computational Graphs',
          'Chapter 12: Optimization Algorithms: SGD, Momentum, RMSprop, and Adam Optimizer'
        ],
        keyConcepts: ['Perceptrons', 'ReLU Activation', 'Backpropagation', 'Adam Optimizer'],
        labPractice: 'Lab 3: Build a 2-layer Neural Network with Backpropagation from scratch and visualize decision boundary.'
      },
      {
        unitNumber: 4,
        title: 'Unit 4: Tree-Based Models & Support Vector Machines',
        duration: '8 Hours',
        summary: 'Non-linear decision making, hyperplanes, and ensemble bagging/boosting.',
        chapters: [
          'Chapter 13: Support Vector Machines (SVM): Maximum Margin Hyperplanes & Slack Variables',
          'Chapter 14: The Kernel Trick: Polynomial and Radial Basis Function (RBF) Kernels',
          'Chapter 15: Decision Trees: Information Gain, Entropy, and Gini Impurity Split Criteria',
          'Chapter 16: Ensemble Learning: Random Forests (Bagging) & XGBoost / AdaBoost (Boosting)'
        ],
        keyConcepts: ['Support Vectors', 'Kernel Trick', 'Gini Impurity', 'Random Forest'],
        labPractice: 'Lab 4: Train an XGBoost model on tabular customer churn data and compare against Random Forest.'
      },
      {
        unitNumber: 5,
        title: 'Unit 5: Unsupervised Learning & Real-World ML Ops',
        duration: '8 Hours',
        summary: 'Finding hidden structure without labels and deploying models.',
        chapters: [
          'Chapter 17: Clustering Algorithms: K-Means, Elbow Method, and Hierarchical Clustering',
          'Chapter 18: Dimensionality Reduction: Principal Component Analysis (PCA) & Eigenvectors',
          'Chapter 19: Anomaly Detection with Gaussian Distribution Modeling',
          'Chapter 20: ML Model Evaluation Metrics (ROC-AUC, Precision-Recall) & Deployment Pipeline'
        ],
        keyConcepts: ['K-Means', 'PCA Dimensionality Reduction', 'ROC Curve', 'Pipeline Deployment'],
        labPractice: 'Lab 5: Compress high-dimensional image dataset using PCA and cluster user profiles with K-Means.'
      }
    ]
  },

  'sub-cs501': {
    code: 'CS501',
    name: 'Database Management Systems',
    credits: '4 Credits (3L + 1T + 2P)',
    type: 'Core Theory & Practical',
    totalHours: '45 Lecture Hours + 30 Lab Hours',
    description: 'Learn how modern databases store, organize, query, and protect mission-critical information. Covers relational algebra, SQL optimization, schema design, transactions, and NoSQL.',
    prerequisites: 'Data Structures, Discrete Mathematics',
    gradingScheme: [
      { component: 'Midterm Examination', weight: 20, description: 'Theory exam on Units 1 & 2' },
      { component: 'Practical Lab & Viva', weight: 25, description: 'SQL query writing, schema design & profiling' },
      { component: 'Continuous Assessment', weight: 15, description: 'Weekly schema assignments & quizzes' },
      { component: 'Final University Exam', weight: 40, description: 'Comprehensive theory examination' }
    ],
    books: {
      primary: 'Database System Concepts — Silberschatz, Korth, and Sudarshan',
      reference: 'Fundamentals of Database Systems — Elmasri and Navathe'
    },
    learningOutcomes: [
      'Design clean, normalized database schemas using Entity-Relationship (ER) modeling.',
      'Write advanced SQL queries with complex joins, aggregation, and subqueries.',
      'Understand transaction safety (ACID properties), index optimization, and concurrency control.'
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Unit 1: Database Architecture & ER Modeling',
        duration: '9 Hours',
        summary: 'Database system architecture, data models, and designing Entity-Relationship diagrams.',
        chapters: [
          'Chapter 1: Purpose of Database Systems vs Traditional File Processing Systems',
          'Chapter 2: Three-Schema Architecture, Data Independence, and Data Abstraction',
          'Chapter 3: Entity Types, Weak Entities, Attributes, Relationships, and Cardinality Constraints',
          'Chapter 4: Converting Conceptual ER Diagrams into Relational Database Tables'
        ],
        keyConcepts: ['Three-Schema Architecture', 'ER Diagram', 'Foreign Keys', 'Cardinality'],
        labPractice: 'Lab 1: Design an ER Diagram for a University Enrollment System and write table creation DDL.'
      },
      {
        unitNumber: 2,
        title: 'Unit 2: Relational Algebra & Advanced SQL',
        duration: '10 Hours',
        summary: 'Mathematical foundations of relational data and writing production SQL queries.',
        chapters: [
          'Chapter 5: Relational Algebra Operators: Select, Project, Cartesian Product, Join, and Division',
          'Chapter 6: SQL Data Definition (DDL) and Data Manipulation (DML) Commands',
          'Chapter 7: Complex SQL Queries: Nested Subqueries, Correlated Queries, and Set Operations',
          'Chapter 8: Aggregate Functions, GROUP BY, HAVING, and Window Functions (OVER, PARTITION BY)'
        ],
        keyConcepts: ['Relational Algebra', 'Inner & Outer Joins', 'Window Functions', 'Subqueries'],
        labPractice: 'Lab 2: Write complex SQL queries answering multi-table analytics on an e-commerce database.'
      },
      {
        unitNumber: 3,
        title: 'Unit 3: Schema Normalization & Functional Dependencies',
        duration: '9 Hours',
        summary: 'Eliminating data redundancy and update anomalies to build robust schemas.',
        chapters: [
          'Chapter 9: Database Anomalies: Insertion, Deletion, and Modification Anomalies',
          'Chapter 10: Functional Dependencies, Armstrong’s Axioms, and Attribute Closure Algorithm',
          'Chapter 11: Normal Forms: 1NF, 2NF, and Third Normal Form (3NF)',
          'Chapter 12: Boyce-Codd Normal Form (BCNF), Dependency Preservation & Lossless Join Decomposition'
        ],
        keyConcepts: ['Functional Dependency', 'Attribute Closure', '3NF vs BCNF', 'Lossless Join'],
        labPractice: 'Lab 3: Analyze un-normalized company records, compute closures, and decompose into BCNF.'
      },
      {
        unitNumber: 4,
        title: 'Unit 4: Transaction Processing & Concurrency Control',
        duration: '9 Hours',
        summary: 'Ensuring reliable data during crashes and high-traffic simultaneous access.',
        chapters: [
          'Chapter 13: Transaction Concepts & The ACID Properties (Atomicity, Consistency, Isolation, Durability)',
          'Chapter 14: Serializability: Conflict Serializability and Precedence Graphs',
          'Chapter 15: Concurrency Control Protocols: Two-Phase Locking (2PL) and Strict 2PL',
          'Chapter 16: Deadlock Prevention, Detection, Wait-Die, and Wound-Wait Schemes'
        ],
        keyConcepts: ['ACID Properties', 'Serializability', 'Two-Phase Locking (2PL)', 'Deadlock Handling'],
        labPractice: 'Lab 4: Simulate concurrent bank transfers in PostgreSQL and analyze locking/deadlock behavior.'
      },
      {
        unitNumber: 5,
        title: 'Unit 5: Query Optimization, Indexing & NoSQL Systems',
        duration: '8 Hours',
        summary: 'Making queries run fast with indexes and modern non-relational database systems.',
        chapters: [
          'Chapter 17: Storage Organization: B-Trees and B+ Trees Index Structures',
          'Chapter 18: Query Processing & Cost Estimation (EXPLAIN ANALYZE)',
          'Chapter 19: Database Recovery: Write-Ahead Logging (WAL) and Checkpointing',
          'Chapter 20: Overview of NoSQL Paradigms: Key-Value, Document (MongoDB), and CAP Theorem'
        ],
        keyConcepts: ['B+ Trees', 'EXPLAIN Query Plan', 'Write-Ahead Log', 'Document Stores'],
        labPractice: 'Lab 5: Benchmark query execution time with and without B+ Tree indexes using EXPLAIN ANALYZE.'
      }
    ]
  },

  'sub-cs301': {
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    credits: '4 Credits (3L + 1T + 2P)',
    type: 'Core Foundation',
    totalHours: '45 Lecture Hours + 30 Lab Hours',
    description: 'The foundation of all software engineering. Learn how to store data efficiently and write high-performance algorithms using arrays, linked lists, trees, graphs, and dynamic programming.',
    prerequisites: 'C / C++ or Java Programming',
    gradingScheme: [
      { component: 'Midterm Exam', weight: 20, description: 'Asymptotic notation, lists, stacks & trees' },
      { component: 'Practical Lab & Coding Viva', weight: 25, description: 'Implementing algorithms in C++/Java' },
      { component: 'Assignments & Weekly Quizzes', weight: 15, description: 'LeetCode-style problem solving' },
      { component: 'Final University Exam', weight: 40, description: 'Comprehensive theoretical & problem exam' }
    ],
    books: {
      primary: 'Introduction to Algorithms (CLRS) — Cormen, Leiserson, Rivest, and Stein',
      reference: 'Data Structures and Algorithm Analysis in C++ — Mark Allen Weiss'
    },
    learningOutcomes: [
      'Analyze time and space complexity of algorithms using Big-O, Big-Omega, and Big-Theta notation.',
      'Implement fundamental linear and non-linear data structures from scratch.',
      'Apply dynamic programming, divide-and-conquer, and greedy paradigms to solve complex computational problems.'
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Unit 1: Algorithm Analysis, Arrays & Linked Lists',
        duration: '9 Hours',
        summary: 'Big-O notation, memory layout, singly and doubly linked lists.',
        chapters: [
          'Chapter 1: Asymptotic Notations (Big-O, Omega, Theta) & Best/Worst/Average Case Analysis',
          'Chapter 2: Array Memory Layout, Pointer Arithmetic, Dynamic Memory Allocation',
          'Chapter 3: Singly Linked List, Doubly Linked List, and Circular Linked List Implementation',
          'Chapter 4: Algorithmic Operations: Inverting a List, Cycle Detection (Floyd’s Tortoise & Hare)'
        ],
        keyConcepts: ['Big-O Notation', 'Pointer Memory', 'Linked Lists', 'Floyd’s Cycle Algorithm'],
        labPractice: 'Lab 1: Implement Singly & Doubly Linked Lists with reverse and cycle detection routines.'
      },
      {
        unitNumber: 2,
        title: 'Unit 2: Stacks, Queues & Recursion',
        duration: '8 Hours',
        summary: 'LIFO & FIFO linear abstract data types and recursive problem solving.',
        chapters: [
          'Chapter 5: Stack Abstract Data Type, Array & Linked List Implementation',
          'Chapter 6: Applications of Stacks: Infix to Postfix Conversion and Expression Evaluation',
          'Chapter 7: Queues: Linear Queue, Circular Queue, and Priority Queue using Heaps',
          'Chapter 8: Recursion Fundamentals, Call Stack Memory Behavior, and Divide & Conquer'
        ],
        keyConcepts: ['Stack ADT', 'Infix to Postfix', 'Circular Queue', 'Call Stack Frames'],
        labPractice: 'Lab 2: Implement an expression evaluator converting infix mathematical expressions to postfix.'
      },
      {
        unitNumber: 3,
        title: 'Unit 3: Trees, Binary Search Trees & Balanced Trees',
        duration: '10 Hours',
        summary: 'Hierarchical structures, tree traversals, and self-balancing BSTs.',
        chapters: [
          'Chapter 9: Tree Terminology, Binary Trees, and Tree Traversals (Inorder, Preorder, Postorder, Level-order)',
          'Chapter 10: Binary Search Tree (BST) Properties, Insertion, Deletion, and Search',
          'Chapter 11: Balanced Search Trees: AVL Trees and Rotation Operations (LL, RR, LR, RL)',
          'Chapter 12: Binary Heaps: Min-Heap, Max-Heap, Heapify Algorithm, and HeapSort'
        ],
        keyConcepts: ['Binary Trees', 'BST Deletion', 'AVL Tree Rotations', 'HeapSort'],
        labPractice: 'Lab 3: Build an AVL Tree that maintains self-balancing through rotations upon node insertion.'
      },
      {
        unitNumber: 4,
        title: 'Unit 4: Graph Algorithms & Traversals',
        duration: '10 Hours',
        summary: 'Network representations, pathfinding, and spanning trees.',
        chapters: [
          'Chapter 13: Graph Representations: Adjacency Matrix vs Adjacency List',
          'Chapter 14: Graph Traversals: Breadth-First Search (BFS) and Depth-First Search (DFS)',
          'Chapter 15: Minimum Spanning Trees: Kruskal’s Algorithm (Disjoint Set Union) & Prim’s Algorithm',
          'Chapter 16: Shortest Path Algorithms: Dijkstra’s Single-Source Shortest Path & Bellman-Ford'
        ],
        keyConcepts: ['BFS & DFS', 'Minimum Spanning Tree', 'Dijkstra Algorithm', 'Disjoint Sets'],
        labPractice: 'Lab 4: Implement Dijkstra’s Algorithm using a Min-Heap to find shortest paths on a road network.'
      },
      {
        unitNumber: 5,
        title: 'Unit 5: Sorting, Searching & Dynamic Programming',
        duration: '8 Hours',
        summary: 'High-speed sorting, hashing techniques, and memoization.',
        chapters: [
          'Chapter 17: Divide-and-Conquer Sorting: MergeSort, QuickSort (Pivot Strategies & Partitioning)',
          'Chapter 18: Hash Tables: Hash Functions, Collision Resolution (Chaining vs Open Addressing)',
          'Chapter 19: Introduction to Dynamic Programming: Overlapping Subproblems & Optimal Substructure',
          'Chapter 20: Classic DP Problems: 0/1 Knapsack, Longest Common Subsequence (LCS)'
        ],
        keyConcepts: ['QuickSort', 'Hash Collisions', 'Memoization', '0/1 Knapsack'],
        labPractice: 'Lab 5: Solve the 0/1 Knapsack problem using both Top-Down Memoization and Bottom-Up Tabulation.'
      }
    ]
  },

  'sub-cs601': {
    code: 'CS601',
    name: 'Compiler Design',
    credits: '4 Credits (3L + 1T + 0P)',
    type: 'Core Theory',
    totalHours: '45 Lecture Hours',
    description: 'Discover how high-level programming code is translated into ultra-fast machine code through lexical analysis, syntax parsing, semantic type checking, and code generation.',
    prerequisites: 'Theory of Computation, Data Structures',
    gradingScheme: [
      { component: 'Midterm Exam', weight: 20, description: 'Lexical analysis & parsing algorithms' },
      { component: 'Mini-Project / Compiler Tooling', weight: 25, description: 'Lex / Yacc grammar parser project' },
      { component: 'Assignments', weight: 15, description: 'Grammar derivation & syntax tree problems' },
      { component: 'Final University Exam', weight: 40, description: 'Full syllabus theory exam' }
    ],
    books: {
      primary: 'Compilers: Principles, Techniques, and Tools (Dragon Book) — Aho, Lam, Sethi, Ullman',
      reference: 'Engineering a Compiler — Keith Cooper & Linda Torczon'
    },
    learningOutcomes: [
      'Understand the multi-stage compiler pipeline from source code to executable machine instructions.',
      'Construct lexical analyzers and parsers using regular expressions and context-free grammars.',
      'Generate intermediate code (Three-Address Code) and apply control-flow optimization techniques.'
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Unit 1: Introduction to Compilers & Lexical Analysis',
        duration: '9 Hours',
        summary: 'Compiler phases, lexers, regular expressions, and finite automata.',
        chapters: [
          'Chapter 1: Multi-Pass Architecture of Modern Compilers (Analysis vs Synthesis Phase)',
          'Chapter 2: Role of Lexical Analyzer, Tokens, Patterns, and Lexemes',
          'Chapter 3: Regular Expressions to Non-Deterministic Finite Automata (Thompson’s Construction)',
          'Chapter 4: DFA Minimization (Hopcroft’s Algorithm) and Lexer Generators (Flex)'
        ],
        keyConcepts: ['Tokens & Lexemes', 'Thompson Construction', 'DFA Minimization', 'Flex Lexer'],
        labPractice: 'Lab 1: Write a Lex / Flex specification to tokenize a subset of the C programming language.'
      },
      {
        unitNumber: 2,
        title: 'Unit 2: Syntax Analysis & Top-Down Parsing',
        duration: '10 Hours',
        summary: 'Context-free grammars, removing ambiguity, and predictive LL(1) parsers.',
        chapters: [
          'Chapter 5: Context-Free Grammars, Derivations, Parse Trees, and Grammar Ambiguity',
          'Chapter 6: Eliminating Left Recursion and Left Factoring Grammars',
          'Chapter 7: Computing FIRST and FOLLOW Sets for Grammars',
          'Chapter 8: Non-Recursive Predictive LL(1) Parsing Table Construction and Error Recovery'
        ],
        keyConcepts: ['Context-Free Grammars', 'Left Recursion', 'FIRST & FOLLOW', 'LL(1) Parsing'],
        labPractice: 'Lab 2: Implement a Recursive Descent Parser for arithmetic expressions with operator precedence.'
      },
      {
        unitNumber: 3,
        title: 'Unit 3: Bottom-Up Parsing (LR Parsers)',
        duration: '10 Hours',
        summary: 'Shift-reduce parsers, LR(0), SLR(1), and LALR(1) parser generators.',
        chapters: [
          'Chapter 9: Bottom-Up Shift-Reduce Parsing & Handle Pruning',
          'Chapter 10: Simple LR (SLR) Parsing: LR(0) Items and Closure / GOTO Operations',
          'Chapter 11: Canonical LR(1) and Lookahead LR (LALR) Parser Table Construction',
          'Chapter 12: Ambiguous Grammars in LR Parsing & Parser Generators (Bison / Yacc)'
        ],
        keyConcepts: ['Shift-Reduce', 'LR(0) Items', 'LALR Parsing Table', 'Bison / Yacc'],
        labPractice: 'Lab 3: Build a complete parser for variable declarations and control structures using Yacc.'
      },
      {
        unitNumber: 4,
        title: 'Unit 4: Syntax-Directed Translation & Type Checking',
        duration: '8 Hours',
        summary: 'Semantic analysis, attribute grammars, and Intermediate Representation (IR).',
        chapters: [
          'Chapter 13: Syntax-Directed Definitions (SDD): Synthesized vs Inherited Attributes',
          'Chapter 14: Evaluation Orders for SDDs and S-Attributed vs L-Attributed Definitions',
          'Chapter 15: Type Systems, Type Checking Rules, and Symbol Table Management',
          'Chapter 16: Intermediate Code Generation: Three-Address Code (TAC), Quadruples, and Triples'
        ],
        keyConcepts: ['Synthesized Attributes', 'Symbol Tables', 'Type Checking', 'Three-Address Code'],
        labPractice: 'Lab 4: Generate Three-Address Code (TAC) for assignment statements and conditional branches.'
      },
      {
        unitNumber: 5,
        title: 'Unit 5: Code Optimization & Machine Code Generation',
        duration: '8 Hours',
        summary: 'Basic blocks, dead code elimination, and target machine instruction selection.',
        chapters: [
          'Chapter 17: Principal Sources of Optimization: Common Subexpression Elimination, Loop Invariant Code Motion',
          'Chapter 18: Basic Blocks and Flow Graphs, Directed Acyclic Graph (DAG) Representation',
          'Chapter 19: Register Allocation and Assignment (Graph Coloring Algorithm)',
          'Chapter 20: Target Machine Code Generation and Peephole Optimization'
        ],
        keyConcepts: ['Basic Blocks', 'Flow Graphs', 'Graph Coloring Register Allocation', 'Peephole Optimization'],
        labPractice: 'Lab 5: Construct basic blocks and DAGs for intermediate code and apply dead-code elimination.'
      }
    ]
  },

  // --- INFORMATION TECHNOLOGY ---
  'sub-it601': {
    code: 'IT601',
    name: 'Cloud Computing Architecture',
    credits: '4 Credits (3L + 1T + 2P)',
    type: 'Core Theory & Practical',
    totalHours: '45 Lecture Hours + 30 Lab Hours',
    description: 'Learn modern distributed cloud infrastructure including AWS/GCP, Docker microservices, Kubernetes container orchestration, and serverless computing.',
    prerequisites: 'Computer Networks, Operating Systems',
    gradingScheme: [
      { component: 'Midterm Examination', weight: 20, description: 'Cloud models, virtualization & storage' },
      { component: 'Hands-on Cloud Lab', weight: 25, description: 'Docker containerization & AWS deployment' },
      { component: 'Quizzes & Assignments', weight: 15, description: 'Cloud architecture design case studies' },
      { component: 'Final University Exam', weight: 40, description: 'Comprehensive examination' }
    ],
    books: {
      primary: 'Cloud Computing: Concepts, Technology & Architecture — Thomas Erl',
      reference: 'Architecting for the Cloud: AWS Best Practices — Amazon Web Services'
    },
    learningOutcomes: [
      'Design fault-tolerant, auto-scaling cloud architectures on public cloud platforms.',
      'Deploy containerized microservices using Docker and Kubernetes.',
      'Implement cloud security, IAM policies, and cost-effective serverless workflows.'
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Unit 1: Cloud Models & Virtualization Fundamentals',
        duration: '9 Hours',
        summary: 'IaaS, PaaS, SaaS delivery models, hypervisors, and resource elasticity.',
        chapters: [
          'Chapter 1: NIST Cloud Computing Reference Architecture & Essential Characteristics',
          'Chapter 2: Service Models: Infrastructure as a Service (IaaS), PaaS, and SaaS',
          'Chapter 3: Virtualization Technologies: Type-1 (Bare Metal) vs Type-2 Hypervisors',
          'Chapter 4: Hardware Virtualization, CPU & Memory Overcommit, and Resource Elasticity'
        ],
        keyConcepts: ['IaaS/PaaS/SaaS', 'Hypervisors', 'Resource Elasticity', 'Virtual Machines'],
        labPractice: 'Lab 1: Launch and configure an Amazon EC2 Linux instance with secure SSH keys and security groups.'
      },
      {
        unitNumber: 2,
        title: 'Unit 2: Cloud Storage & Virtual Networks',
        duration: '9 Hours',
        summary: 'Block, file, and object storage alongside Virtual Private Clouds (VPC).',
        chapters: [
          'Chapter 5: Cloud Storage Paradigms: Block Storage (EBS), Object Storage (S3), and Network File Systems',
          'Chapter 6: Virtual Private Cloud (VPC) Architecture: Subnets, Route Tables, and Internet Gateways',
          'Chapter 7: Network Access Control Lists (NACLs) vs Stateful Security Groups',
          'Chapter 8: Load Balancing (ALB/NLB) and Auto-Scaling Groups for High Availability'
        ],
        keyConcepts: ['Object Storage (S3)', 'VPC Subnets', 'Application Load Balancer', 'Auto-Scaling'],
        labPractice: 'Lab 2: Host a static web portal on Amazon S3 with CloudFront CDN distribution and custom domain routing.'
      },
      {
        unitNumber: 3,
        title: 'Unit 3: Containers & Kubernetes Orchestration',
        duration: '10 Hours',
        summary: 'Docker containers, namespaces, cgroups, and multi-node Kubernetes clusters.',
        chapters: [
          'Chapter 9: Virtual Machines vs Containers: Linux Namespaces and Control Groups (cgroups)',
          'Chapter 10: Docker Engine Architecture, Dockerfile Best Practices, and Image Layering',
          'Chapter 11: Kubernetes Core Architecture: Control Plane, Nodes, Pods, and Services',
          'Chapter 12: Deployments, ConfigMaps, Secrets, Ingress Controllers, and Rolling Updates'
        ],
        keyConcepts: ['Docker Containers', 'Kubernetes Pods', 'Cluster Autoscaler', 'Ingress Routing'],
        labPractice: 'Lab 3: Containerize a Node.js/Python API with Docker and deploy to a local Kubernetes (Minikube) cluster.'
      },
      {
        unitNumber: 4,
        title: 'Unit 4: Serverless Computing & Cloud Microservices',
        duration: '9 Hours',
        summary: 'Function-as-a-Service (AWS Lambda), event-driven architectures, and API Gateways.',
        chapters: [
          'Chapter 13: Serverless Computing Paradigm: Function as a Service (FaaS) vs Long-Running Servers',
          'Chapter 14: Event-Driven Architectures: Message Queues (SQS), Pub/Sub (SNS), and EventBridge',
          'Chapter 15: RESTful Cloud APIs: API Gateway Configuration, Rate Limiting, and CORS',
          'Chapter 16: Microservices Communication Patterns and Distributed Tracing'
        ],
        keyConcepts: ['Serverless FaaS', 'AWS Lambda', 'Event-Driven SQS/SNS', 'API Gateway'],
        labPractice: 'Lab 4: Create a serverless thumbnail generator using AWS Lambda triggered by image uploads to S3.'
      },
      {
        unitNumber: 5,
        title: 'Unit 5: Cloud Security, IAM & Cost Optimization',
        duration: '8 Hours',
        summary: 'Shared responsibility model, IAM policies, encryption, and FinOps.',
        chapters: [
          'Chapter 17: Cloud Security Shared Responsibility Model between Provider and Customer',
          'Chapter 18: Identity & Access Management (IAM): Users, Roles, Policies, and Least Privilege Principle',
          'Chapter 19: Data Encryption in Transit (TLS) and at Rest (KMS Key Management)',
          'Chapter 20: Cloud FinOps: Cost Management, Reserved Instances, and Well-Architected Framework'
        ],
        keyConcepts: ['Shared Responsibility', 'IAM Least Privilege', 'KMS Encryption', 'FinOps Cost Tuning'],
        labPractice: 'Lab 5: Audit cloud security posture using IAM policy simulators and automated compliance scanners.'
      }
    ]
  },

  'sub-it401': {
    code: 'IT401',
    name: 'Web Application Development',
    credits: '4 Credits (3L + 1T + 2P)',
    type: 'Core Practical',
    totalHours: '45 Lecture Hours + 30 Lab Hours',
    description: 'Master full-stack modern web engineering: HTML5/CSS3, responsive UI frameworks, JavaScript ES6+, React single page applications, Node.js backend APIs, and database integration.',
    prerequisites: 'Basic Programming',
    gradingScheme: [
      { component: 'Midterm Exam', weight: 20, description: 'Frontend fundamentals & JS concepts' },
      { component: 'Full-Stack Web Project', weight: 30, description: 'Production web app built and deployed' },
      { component: 'Weekly Lab Milestones', weight: 15, description: 'CSS flexbox, React hooks & REST APIs' },
      { component: 'Final University Exam', weight: 35, description: 'Comprehensive written test' }
    ],
    books: {
      primary: 'Eloquent JavaScript — Marijn Haverbeke',
      reference: 'Learning React: Modern Patterns for Developing React Apps — Alex Banks & Eve Porcello'
    },
    learningOutcomes: [
      'Build responsive, mobile-first web user interfaces using Tailwind CSS and React.',
      'Develop robust RESTful backend APIs with Node.js and Express.',
      'Implement JWT user authentication, session security, and state management.'
    ],
    units: [
      {
        unitNumber: 1,
        title: 'Unit 1: Modern HTML5, Responsive CSS & Tailwind',
        duration: '8 Hours',
        summary: 'Semantic web layout, modern CSS Grid, Flexbox, and utility-first design.',
        chapters: [
          'Chapter 1: Semantic HTML5 Elements, Web Accessibility (ARIA), and SEO Best Practices',
          'Chapter 2: CSS Box Model, Modern Flexbox Layouts, and CSS Grid Systems',
          'Chapter 3: Responsive Web Design: Media Queries and Mobile-First Viewport Strategies',
          'Chapter 4: Utility-First CSS with Tailwind CSS: Config, JIT Compilation, and Dark Mode'
        ],
        keyConcepts: ['Semantic HTML5', 'CSS Flexbox & Grid', 'Mobile-First Design', 'Tailwind CSS'],
        labPractice: 'Lab 1: Code a responsive college event landing page with dark/light mode using Tailwind CSS.'
      },
      {
        unitNumber: 2,
        title: 'Unit 2: JavaScript ES6+ & Asynchronous Programming',
        duration: '10 Hours',
        summary: 'Modern JavaScript features, DOM manipulation, promises, and the event loop.',
        chapters: [
          'Chapter 5: ES6+ Syntax: Arrow Functions, Destructuring, Spread/Rest Operators, and Template Literals',
          'Chapter 6: The JavaScript Event Loop, Call Stack, Microtask Queue, and Asynchronous Execution',
          'Chapter 7: Promises, Async/Await Syntax, Error Handling with Try/Catch',
          'Chapter 8: Browser DOM Manipulation, Event Bubbling, Delegated Event Handling, and Fetch API'
        ],
        keyConcepts: ['ES6 Destructuring', 'Event Loop', 'Async / Await', 'DOM Manipulation'],
        labPractice: 'Lab 2: Build an interactive weather dashboard fetching live weather data using async/await and Fetch API.'
      },
      {
        unitNumber: 3,
        title: 'Unit 3: React.js & Component-Driven UI',
        duration: '10 Hours',
        summary: 'React JSX, components, props, hooks (useState, useEffect), and Virtual DOM.',
        chapters: [
          'Chapter 9: The Virtual DOM, Reconciliation Algorithm, and Declarative UI Principles',
          'Chapter 10: Functional Components, JSX Syntax, and Props Passing',
          'Chapter 11: React State Management: useState, useEffect Lifecycle, and Custom Hooks',
          'Chapter 12: Client-Side Routing with React Router v6+: Dynamic Route Parameters & Navigation'
        ],
        keyConcepts: ['Virtual DOM', 'React Hooks', 'Custom Hooks', 'Client-Side Routing'],
        labPractice: 'Lab 3: Build an e-commerce shopping cart in React with state management and dynamic routing.'
      },
      {
        unitNumber: 4,
        title: 'Unit 4: Backend REST APIs with Node.js & Express',
        duration: '9 Hours',
        summary: 'Server-side JavaScript, Express routing, middleware, and request validation.',
        chapters: [
          'Chapter 13: Node.js Runtime Architecture, Non-Blocking I/O, and npm Package Management',
          'Chapter 14: Express.js Fundamentals: Route Handlers, Request and Response Objects',
          'Chapter 15: Express Middleware: Logging, CORS, Body Parsing, and Custom Error Handlers',
          'Chapter 16: Designing RESTful APIs: HTTP Methods (GET, POST, PUT, DELETE) and Status Codes'
        ],
        keyConcepts: ['Non-Blocking I/O', 'Express Middleware', 'REST Architecture', 'HTTP Codes'],
        labPractice: 'Lab 4: Create a RESTful Task Management API in Express with input validation and error handling.'
      },
      {
        unitNumber: 5,
        title: 'Unit 5: Authentication, Security & Deployment',
        duration: '8 Hours',
        summary: 'Securing web apps with JSON Web Tokens, hashing, and deploying to cloud hosts.',
        chapters: [
          'Chapter 17: User Authentication: Password Hashing with Bcrypt and Salt Rounds',
          'Chapter 18: Stateless Authentication using JSON Web Tokens (JWT) & Protected Route Middleware',
          'Chapter 19: Web Application Security: Preventing SQL Injection, XSS, and CSRF Attacks',
          'Chapter 20: CI/CD Pipelines and Production Deployment (Vercel, Render, or Netlify)'
        ],
        keyConcepts: ['JWT Authentication', 'Bcrypt Hashing', 'OWASP Top 10 Security', 'Cloud Deployment'],
        labPractice: 'Lab 5: Secure the full-stack web application with JWT login and deploy live on the internet.'
      }
    ]
  }
};

// Generic Fallback Generator for subjects that do not have custom bespoke units
export function getCourseCurriculum(subject) {
  if (!subject) return null;
  const existing = COURSE_CURRICULA[subject.id] || COURSE_CURRICULA[subject.code?.toLowerCase()];
  if (existing) {
    return {
      ...existing,
      id: subject.id,
      name: subject.name,
      code: subject.code,
      semester: subject.semester
    };
  }

  // Structured generic curriculum for any other subject in the college
  return {
    id: subject.id,
    code: subject.code || 'COURSE',
    name: subject.name,
    credits: '4 Credits (3L + 1T + 0P)',
    type: 'Academic Core Subject',
    totalHours: '45 Lecture Hours',
    description: `A comprehensive university curriculum covering theoretical fundamentals, core principles, problem solving, and practical lab applications for ${subject.name}.`,
    prerequisites: `Prerequisites for Semester ${subject.semester} Engineering`,
    gradingScheme: [
      { component: 'Midterm Examination', weight: 20, description: 'Theory exam covering Units 1 & 2' },
      { component: 'Practical Lab / Continuous Evaluation', weight: 25, description: 'Lab experiments, case studies & viva' },
      { component: 'Quizzes & Assignments', weight: 15, description: 'Weekly assignments & concept checks' },
      { component: 'Final University Examination', weight: 40, description: 'Comprehensive end-term exam' }
    ],
    books: {
      primary: `Standard Textbook of ${subject.name} — Academic University Press`,
      reference: `Advanced Reference Guide for ${subject.name} — Technical Publications`
    },
    learningOutcomes: [
      `Understand foundational theory and mathematical models governing ${subject.name}.`,
      `Analyze real-world engineering problems and propose rigorous algorithmic/design solutions.`,
      `Demonstrate proficiency through hands-on lab experiments and technical reports.`
    ],
    units: [
      {
        unitNumber: 1,
        title: `Unit 1: Introduction & Foundations of ${subject.name}`,
        duration: '9 Hours',
        summary: 'Fundamental concepts, mathematical background, and basic terminology.',
        chapters: [
          `Chapter 1: Historical evolution and modern scope of ${subject.name}`,
          'Chapter 2: Core mathematical and physical principles',
          'Chapter 3: System representations, state variables, and equations',
          'Chapter 4: Analytical tools and foundational problem-solving strategies'
        ],
        keyConcepts: ['Foundational Concepts', 'System Variables', 'Analytical Formulation', 'Base Models'],
        labPractice: 'Lab 1: Introductory simulation and benchmark setup to observe baseline characteristics.'
      },
      {
        unitNumber: 2,
        title: 'Unit 2: Core Architecture, Modeling & Analysis',
        duration: '9 Hours',
        summary: 'Detailed system modeling, analytical frameworks, and formal techniques.',
        chapters: [
          'Chapter 5: Detailed structural components and interaction dynamics',
          'Chapter 6: Mathematical modeling and transfer characteristics',
          'Chapter 7: Frequency/Time response and steady-state evaluations',
          'Chapter 8: Numerical calculation methodologies and error margins'
        ],
        keyConcepts: ['System Dynamics', 'Mathematical Modeling', 'State Estimation', 'Numerical Methods'],
        labPractice: 'Lab 2: Computer-aided simulation of multi-variable system equations and parameter sensitivity.'
      },
      {
        unitNumber: 3,
        title: 'Unit 3: Advanced Optimization & Methodologies',
        duration: '10 Hours',
        summary: 'Applying advanced methods, design optimization, and edge-case resolution.',
        chapters: [
          'Chapter 9: Non-linear behavior and mitigation strategies',
          'Chapter 10: Optimization frameworks, constraint formulations, and cost functions',
          'Chapter 11: Efficiency enhancements and power/throughput balancing',
          'Chapter 12: Comparative evaluation of competing design paradigms'
        ],
        keyConcepts: ['Optimization', 'Constraint Formulations', 'Trade-off Analysis', 'Performance Tuning'],
        labPractice: 'Lab 3: Experimental testing of optimization algorithms and measurement of efficiency gains.'
      },
      {
        unitNumber: 4,
        title: 'Unit 4: Industry Standards, Integration & Safety',
        duration: '9 Hours',
        summary: 'Industry practices, protocol compliance, reliability, and security considerations.',
        chapters: [
          'Chapter 13: Standard engineering protocols and international specifications',
          'Chapter 14: Fault tolerance, redundancy design, and failure mode analysis',
          'Chapter 15: Environmental safety, ethical considerations, and compliance',
          'Chapter 16: Interfacing with legacy and modern digital sub-systems'
        ],
        keyConcepts: ['Regulatory Compliance', 'Fault Tolerance', 'System Safety', 'Subsystem Interfacing'],
        labPractice: 'Lab 4: Stress-testing and reliability validation under simulated peak operating loads.'
      },
      {
        unitNumber: 5,
        title: 'Unit 5: Modern Trends & Emerging Applications',
        duration: '8 Hours',
        summary: 'Cutting-edge developments, future research directions, and case studies.',
        chapters: [
          'Chapter 17: State-of-the-art research breakthroughs and market trends',
          'Chapter 18: Digital transformation, automation, and intelligent tooling',
          'Chapter 19: Comprehensive capstone case study and architectural synthesis',
          'Chapter 20: Future outlook and open challenges in the domain'
        ],
        keyConcepts: ['Emerging Trends', 'Automation', 'Capstone Synthesis', 'Future Directions'],
        labPractice: 'Lab 5: Capstone practical project demonstrating complete end-to-end design and evaluation.'
      }
    ]
  };
}

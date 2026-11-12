import { InterviewQuestion } from './types.ts';

export const INTERVIEW_QUESTIONS_DATABASE: InterviewQuestion[] = [
  // TRACK 1: Java Fundamentals
  {
    id: 'int-fund-1',
    track: 'FUNDAMENTALS',
    title: 'Java Platform Independence & JVM Architecture',
    prompt: 'Explain how Java achieves platform independence ("Write Once, Run Anywhere"). In your explanation, clarify the roles of JDK, JRE, JVM, bytecode, and the JIT compiler.',
    rubric: [
      'Explains bytecode compilation via javac (.java to .class)',
      'Identifies JVM as platform-specific execution engine interpreting bytecode',
      'Clarifies distinction between JDK (dev tools), JRE (runtime), and JVM',
      'Mentions JIT (Just-In-Time) compiler translating hot bytecode into native machine instructions'
    ],
    keyPoints: [
      'javac compiles source code into platform-neutral bytecode',
      'Each OS has its own platform-specific JVM implementation',
      'JIT compiler detects frequently executed code and compiles it to native CPU instructions',
      'Memory management is handled automatically via Garbage Collection'
    ],
    modelAnswer: `Java achieves platform independence through an intermediate abstraction called bytecode. When source code (.java) is compiled using javac, it produces architecture-neutral bytecode (.class) rather than OS-specific machine binaries.

Each operating system (Windows, Linux, macOS) provides its own specific implementation of the Java Virtual Machine (JVM). The JVM reads this identical bytecode and executes it either via line-by-line interpretation or via the Just-In-Time (JIT) compiler, which dynamically translates hot code paths into native CPU instructions for near-C++ runtime speed.

Key distinctions:
1. JDK (Java Development Kit): Contains the compiler (javac), debugger, packaging tools, and the JRE.
2. JRE (Java Runtime Environment): Contains the JVM and the core standard class libraries (rt.jar/modules).
3. JVM (Java Virtual Machine): The virtual hardware engine responsible for memory management, class loading, bytecode verification, and garbage collection.`
  },
  {
    id: 'int-fund-2',
    track: 'FUNDAMENTALS',
    title: 'Pass-by-Value vs Pass-by-Reference in Java',
    prompt: 'Is Java pass-by-value or pass-by-reference? Demonstrate your answer with a concrete code scenario showing how modifying an object parameter affects or does not affect the caller.',
    rubric: [
      'States unequivocally that Java is strictly pass-by-value, always',
      'Distinguishes between passing primitive values vs passing object references by value',
      'Explains why reassigning the reference variable inside a method has zero effect on the caller',
      'Explains why modifying an object\'s internal state through the reference copy alters the caller\'s object'
    ],
    keyPoints: [
      'Strictly pass-by-value for all types',
      'Primitives pass a copy of the primitive literal',
      'Objects pass a copy of the memory address reference',
      'Reassigning the parameter reference does not rebind the caller variable'
    ],
    modelAnswer: `Java is strictly pass-by-value in 100% of cases. There is no pass-by-reference in Java.

When passing a primitive (such as int x = 10), Java copies the actual bit value into the method\'s stack frame. Modifications to the parameter never affect the caller.

When passing an object (such as Person p), Java copies the *value of the object reference* (the memory pointer). Both the caller\'s variable and the callee\'s parameter now point to the exact same object in the heap.
- If you mutate the object (e.g. p.setName("Alice")), the caller sees the change because both references point to that same mutated heap object.
- If you reassign the parameter (e.g. p = new Person("Bob")), you only rebind the local parameter copy. The caller\'s variable remains pointing to the original object.`
  },

  // TRACK 2: OOP (Object-Oriented Programming)
  {
    id: 'int-oop-1',
    track: 'OOP',
    title: 'The 4 Pillars of OOP and SOLID Principles',
    prompt: 'Detail how Polymorphism and Abstraction interact in Java. Provide a real-world software design scenario where an Abstract Class is preferred over an Interface, and vice-versa.',
    rubric: [
      'Defines Abstraction (hiding implementation details) and Polymorphism (ability to take multiple forms)',
      'Explains abstract classes: shared state (instance fields), constructors, partial implementation',
      'Explains interfaces: contract definition, multiple inheritance of types, decoupled APIs',
      'Provides a concrete architectural scenario (e.g. BaseHttpServlet/Template Method vs Comparable/Serializable)'
    ],
    keyPoints: [
      'Abstract classes provide code reuse and stateful base skeletons (Template Method pattern)',
      'Interfaces define capabilities and behavioral contracts without dictating class hierarchy',
      'A class can implement multiple interfaces, but extend only one class',
      'Interfaces since Java 8 support default and static methods'
    ],
    modelAnswer: `Abstraction hides complex background implementation while exposing a clean public API. Polymorphism allows subclasses to supply specialized behaviors through shared abstract parent types at runtime via dynamic method dispatch.

When to choose an Abstract Class over an Interface:
- When sharing non-static state (instance fields) and common constructor initialization across closely related classes.
- When implementing the Template Method design pattern (defining a non-overridable final workflow skeleton while delegating specific steps to subclasses). Example: \`AbstractList\` or \`HttpServlet\`.

When to choose an Interface over an Abstract Class:
- When defining a capability or behavioral contract that can be adopted by completely unrelated classes across different hierarchies. Example: \`Comparable\`, \`AutoCloseable\`, or \`Serializable\`.
- When designing microservices or plugins where loose coupling and multiple inheritance of type are required.`
  },
  {
    id: 'int-oop-2',
    track: 'OOP',
    title: 'Liskov Substitution Principle & Method Overriding Rules',
    prompt: 'What are the strict compiler rules for method overriding in Java, and how does the Liskov Substitution Principle (LSP) justify them regarding access modifiers and checked exceptions?',
    rubric: [
      'Method name and parameter signature must match exactly',
      'Return type must be identical or covariant (subtype)',
      'Access modifier cannot be more restrictive (can be equal or more permissive)',
      'Overriding method cannot declare new or broader checked exceptions',
      'Connects rules to LSP (clients expecting the parent must not be surprised by restricted access or undeclared exceptions)'
    ],
    keyPoints: [
      'Covariant returns allowed since Java 5',
      'Cannot reduce visibility (e.g. public cannot become protected)',
      'Cannot throw broader checked exceptions (can throw fewer or subtypes)',
      'Ensures any client calling through the base reference does not encounter unexpected access or exceptions'
    ],
    modelAnswer: `In Java, method overriding requires:
1. Exact Signature: Identical method name and parameter types.
2. Covariant Return Types: The return type must be the same or a subtype of the superclass method\'s return type.
3. Access Modifiers: The overriding method CANNOT be more restrictive (e.g. a protected method can become public, but a public method cannot become protected).
4. Checked Exceptions: The overriding method CANNOT declare new or broader checked exceptions than those declared in the superclass (it can declare fewer, more specific subtypes, or none).

Liskov Substitution Principle (LSP) Justification:
LSP states that any subclass must be substitutable for its superclass without breaking client correctness. If a subclass method were allowed to be private, a caller holding a parent reference would encounter illegal access. Similarly, if a subclass could throw an undeclared checked exception (like IOException when parent declared none), the client\'s try-catch block would fail to handle it, causing crashes.`
  },

  // TRACK 3: Collections Framework
  {
    id: 'int-col-1',
    track: 'COLLECTIONS',
    title: 'HashMap Architecture, Rehashing & Fail-Fast Iterators',
    prompt: 'Walk through the internal architecture of java.util.HashMap. Explain how hash collisions are handled in Java 8+, how the load factor influences rehashing, and why HashMap iterators are fail-fast.',
    rubric: [
      'Describes internal array of Node/Entry buckets with hash spread formula',
      'Explains collision resolution: linked list transitioning to Red-Black tree at TREEIFY_THRESHOLD (8)',
      'Defines capacity (default 16) and load factor (default 0.75), explaining threshold = capacity * loadFactor',
      'Explains fail-fast iterators using modCount and ConcurrentModificationException'
    ],
    keyPoints: [
      'Bucket index computed via (n - 1) & hash',
      'Converts to Red-Black Tree when bucket size >= 8 and table length >= 64',
      'Rehashing doubles the array size and redistributes nodes',
      'modCount tracks structural modifications to detect concurrent alteration during iteration'
    ],
    modelAnswer: `HashMap is backed by a transient array of Node<K,V> buckets. When put(key, value) is called:
1. The key\'s hashCode() is passed through a supplemental hash function to prevent clustering: \`hash = (h = key.hashCode()) ^ (h >>> 16)\`.
2. The bucket index is calculated via bitwise AND: \`index = (table.length - 1) & hash\`.
3. Collision Resolution: If the bucket is empty, a new Node is placed. If occupied, keys are compared using \`==\` and \`equals()\`.
   - In Java 8+, if entries in a single bucket reach 8 (TREEIFY_THRESHOLD) and total array length is at least 64, the linked list converts into a balanced Red-Black Tree, reducing worst-case lookups from O(n) to O(log n).
4. Rehashing: When total entries exceed \`capacity * loadFactor\` (default 16 * 0.75 = 12), the table doubles in size (e.g. 16 to 32) and all nodes are re-indexed.
5. Fail-Fast Iterators: HashMap maintains an internal \`modCount\` counter incremented on structural changes (add/remove). When an iterator traverses the map, it compares its local expectedModCount with modCount. If any other thread or uncoordinated call alters the map, it immediately throws ConcurrentModificationException.`
  },

  // TRACK 4: Exception Handling
  {
    id: 'int-exc-1',
    track: 'EXCEPTIONS',
    title: 'Exception Hierarchy, Best Practices, and Anti-Patterns',
    prompt: 'What are the top three exception handling anti-patterns in production Java applications, and what should be done instead? Contrast Error, Exception, and RuntimeException.',
    rubric: [
      'Clearly distinguishes Throwable -> Error (JVM unrecoverable), Exception (Checked), RuntimeException (Unchecked)',
      'Identifies Anti-pattern 1: Catching generic Exception or Throwable without rethrowing or handling',
      'Identifies Anti-pattern 2: Swallowing exceptions (empty catch blocks) or "log and throw" duplication',
      'Identifies Anti-pattern 3: Using exceptions for flow control instead of validation checks'
    ],
    keyPoints: [
      'Error: JVM level (OutOfMemoryError, StackOverflowError); should not be caught',
      'Exception: checked exceptions for recoverable environmental errors',
      'RuntimeException: programming bugs (NPE, IndexOutOfBounds); prevent via good code',
      'Preserve root cause using exception chaining: new CustomException("msg", e)'
    ],
    modelAnswer: `Hierarchy Distinction:
- \`java.lang.Throwable\` is the root.
  1. \`Error\`: Fatal JVM system failures (OutOfMemoryError, StackOverflowError). Applications should never attempt to catch or recover from Errors.
  2. \`Exception\` (Checked): External, recoverable conditions that a well-written application must anticipate (FileNotFoundException, SQLException).
  3. \`RuntimeException\` (Unchecked): Indicates programming flaws or API contract violations (NullPointerException, IllegalArgumentException).

Top 3 Anti-Patterns & Corrective Practices:
1. Swallowing Exceptions (Empty Catch Blocks):
   - Flaw: Hides root causes, leading to silent failures and impossible debugging.
   - Fix: Always log with stack trace or rethrow wrapped in a domain exception preserving the cause: \`throw new ServiceException("Failed to process", e);\`.
2. Catching Generic Throwable or Exception:
   - Flaw: Inadvertently intercepts InterruptedException, OutOfMemoryError, or thread cancellations.
   - Fix: Catch only specific anticipated exceptions.
3. Using Exceptions for Normal Control Flow:
   - Flaw: Creating stack traces carries massive performance overhead.
   - Fix: Use conditional checks (e.g. Optional, map.containsKey, or null guards) for normal business branches.`
  },

  // TRACK 5: Coding Interview
  {
    id: 'int-code-1',
    track: 'CODING',
    title: 'Design a Thread-Safe In-Memory LRU Cache',
    prompt: 'How would you design a thread-safe Least Recently Used (LRU) Cache of fixed capacity in Java? What data structures yield O(1) get and put operations while maintaining concurrent safety?',
    rubric: [
      'Combines HashMap (O(1) key-to-node lookup) and Doubly Linked List (O(1) node relocation to head and eviction from tail)',
      'Explains why LinkedHashMap with removeEldestEntry provides a clean built-in solution',
      'Addresses concurrency: Collections.synchronizedMap(lruMap) or ReentrantReadWriteLock / ConcurrentHashMap with granular locks',
      'Details eviction policy when capacity is exceeded'
    ],
    keyPoints: [
      'Doubly linked list allows removing any node in O(1) given its pointer',
      'HashMap stores key -> ListNode reference',
      'Every get or update moves the accessed node to the head (most recently used)',
      'When size > capacity, tail node is evicted from both list and map'
    ],
    modelAnswer: `To achieve O(1) time complexity for both \`get()\` and \`put()\`, we combine two data structures:
1. A Doubly Linked List: Represents temporal order. Most recently used elements are moved to the head; the least recently used element resides at the tail. Doubly linked nodes allow O(1) node removal and re-insertion given the node pointer.
2. A Hash Map: Maps keys to their corresponding Doubly Linked List nodes for O(1) random access.

Workflow:
- \`get(key)\`: Look up node in map. If absent, return -1. If present, detach node from current list position and splice it immediately behind head.
- \`put(key, value)\`: If key exists, update value and move node to head. If new, allocate node at head and insert into map. If map size > capacity, evict tail node and delete its key from map.

Java Implementation Options:
1. Using \`java.util.LinkedHashMap\`: Extend LinkedHashMap with access-order set to true: \`new LinkedHashMap<>(cap, 0.75f, true)\` and override \`removeEldestEntry(Map.Entry eldest) { return size() > capacity; }\`.
2. Thread Safety: Wrap with \`Collections.synchronizedMap()\` or guard get/put with a \`ReentrantReadWriteLock\` to allow parallel reads while serializing cache modifications.`
  },

  // TRACK 6: Mixed Technical Interview
  {
    id: 'int-mix-1',
    track: 'MIXED',
    title: 'Garbage Collection Algorithms and JVM Performance Tuning',
    prompt: 'Contrast the G1 (Garbage-First) GC with ZGC (Z Garbage Collector). What is the generational hypothesis, and how do generational collectors optimize heap throughput?',
    rubric: [
      'Explains Generational Hypothesis: most objects die young, while long-lived objects survive multiple cycles',
      'Details Young Generation (Eden + Survivor spaces S0/S1) vs Old/Tenured Generation',
      'Explains G1 GC: region-based heap partitioning with concurrent marking and prioritized high-garbage region evacuation',
      'Explains ZGC: ultra-low latency colored pointers and load barriers with sub-millisecond pauses regardless of heap size'
    ],
    keyPoints: [
      'Weak Generational Hypothesis: 90%+ of objects allocated are short-lived',
      'Minor GC collects Eden space rapidly with minimal pause times',
      'G1 is the default since Java 9, designed for multi-gigabyte heaps with configurable pause targets',
      'ZGC (Java 15+) executes virtually all phases concurrently, providing < 1ms pause times'
    ],
    modelAnswer: `The Weak Generational Hypothesis observes two universal software properties:
1. The vast majority of allocated objects die very shortly after creation (temporary buffers, loop variables).
2. Very few references exist from old objects to younger objects.

To exploit this, the JVM partitions the heap into:
- Young Generation: Eden space + two Survivor spaces (S0, S1). When Eden fills, a Minor GC quickly sweeps live objects into a survivor space. Since most objects are dead, Minor GC is extremely fast. Objects surviving several cycles are promoted to the Old Generation.
- Old Generation: Collected via Major/Full GC at lower frequency.

G1 GC vs ZGC:
1. G1 GC (Garbage-First): Default since Java 9. Divides heap into 2,000+ equal-sized memory regions. Tracks the volume of garbage in each region and prioritizes collecting regions containing the highest garbage density ("garbage first") within a user-specified pause time target (\`-XX:MaxGCPauseMillis\`).
2. ZGC (Z Garbage Collector): Scalable ultra-low latency collector. Uses colored 64-bit reference pointers and concurrent load barriers. It performs marking, relocation, and reference remapping concurrently with application threads, achieving sub-millisecond pause times even on multi-terabyte heaps.`
  }
];

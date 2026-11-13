import { Question } from './types.ts';

export const QUESTIONS_DATABASE: Question[] = [
  // ==========================================
  // STAGE 1: BEGINNER (Questions 1 to 15)
  // Topics: Variables, Data Types, Operators, Conditionals, Loops, Arrays, Strings, Methods, I/O, Type Casting, Problem Solving
  // ==========================================
  {
    id: 1,
    stage: 'BEGINNER',
    stageIndex: 1,
    category: 'MCQ',
    topic: 'Variables and Data Types',
    title: 'Primitive Data Types and Memory Sizing',
    prompt: 'In Java, what is the exact memory size and signed range of the `byte` primitive data type?',
    options: [
      '8 bits, range -128 to 127',
      '8 bits, range 0 to 255',
      '16 bits, range -32,768 to 32,767',
      '4 bits, range -8 to 7'
    ],
    expectedAnswer: '8 bits, range -128 to 127',
    marks: 2,
    explanation: 'A `byte` in Java is an 8-bit signed two\'s complement integer. Its minimum value is -128 (-2^7) and its maximum value is 127 (2^7 - 1). Unlike C/C++, Java does not feature unsigned primitive numeric types (except for char).',
    commonMistakes: 'Confusing signed byte (-128 to 127) with unsigned byte in languages like C/C# (0 to 255).',
    takeaway: 'Java primitives have fixed platform-independent sizes defined directly by the JVM specification.'
  },
  {
    id: 2,
    stage: 'BEGINNER',
    stageIndex: 2,
    category: 'OUTPUT',
    topic: 'Operators',
    title: 'Pre-increment vs Post-increment Evaluation',
    prompt: 'Predict the exact console output of this Java code snippet:',
    codeSnippet: `public class Test {
    public static void main(String[] args) {
        int a = 5;
        int b = a++ + ++a * 2;
        System.out.println(b + " " + a);
    }
}`,
    expectedOutput: '19 7',
    marks: 2,
    explanation: 'Evaluation breakdown: (1) `a++` evaluates to 5, and then `a` becomes 6. (2) `++a` increments `a` from 6 to 7, evaluating to 7. (3) Multiplication has higher precedence: `7 * 2 = 14`. (4) Addition: `5 + 14 = 19`. Thus `b = 19` and final `a = 7`. Output is "19 7".',
    commonMistakes: 'Assuming multiplication causes ++a to be evaluated before a++, or miscounting the state of a between post- and pre-increments.',
    takeaway: 'In Java, operands are evaluated strictly from left to right, even across precedence tiers.'
  },
  {
    id: 3,
    stage: 'BEGINNER',
    stageIndex: 3,
    category: 'MCQ',
    topic: 'Conditional Statements',
    title: 'Switch Expression and Supported Types',
    prompt: 'Which of the following types CANNOT be used as the selector expression in a traditional Java `switch` statement?',
    options: [
      'float',
      'char',
      'String',
      'byte'
    ],
    expectedAnswer: 'float',
    marks: 2,
    explanation: 'In Java, switch expressions support byte, short, char, int (and their wrapper classes), enums, and String (since Java 7). Floating-point types (float and double), boolean, and long cannot be used because floating-point representation involves imprecise binary fractions where exact equality is unreliable.',
    commonMistakes: 'Thinking long or float are allowed because int is allowed.',
    takeaway: 'Switch statements require discrete, exact integral, enum, or string representations.'
  },
  {
    id: 4,
    stage: 'BEGINNER',
    stageIndex: 4,
    category: 'OUTPUT',
    topic: 'Loops',
    title: 'Labeled Break in Nested Loops',
    prompt: 'What will be printed when the following code executes?',
    codeSnippet: `public class LoopTest {
    public static void main(String[] args) {
        int count = 0;
        outer:
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (i == 1 && j == 1) {
                    break outer;
                }
                count++;
            }
        }
        System.out.println(count);
    }
}`,
    expectedOutput: '4',
    marks: 2,
    explanation: 'When i = 0: j loops through 0, 1, 2 -> count increments 3 times (count = 3). When i = 1: for j = 0 -> count becomes 4. When j = 1, condition `i == 1 && j == 1` triggers `break outer`, immediately breaking out of both nested loops. Total count printed is 4.',
    commonMistakes: 'Assuming labeled break only exits the inner loop rather than the specified outer loop.',
    takeaway: 'Labeled breaks provide controlled termination out of arbitrary levels of nested loops.'
  },
  {
    id: 5,
    stage: 'BEGINNER',
    stageIndex: 5,
    category: 'MCQ',
    topic: 'Arrays',
    title: 'Default Array Initialization Values',
    prompt: 'When an array of objects `String[] names = new String[5];` is allocated in Java, what are its elements initialized to in heap memory?',
    options: [
      'null',
      '"" (empty string)',
      'Garbage memory values',
      'ArrayIndexOutOfBoundsException'
    ],
    expectedAnswer: 'null',
    marks: 2,
    explanation: 'In Java, all array elements are automatically initialized to their default type values upon heap allocation: 0 for numeric primitives, false for boolean, \\u0000 for char, and null for any reference type (including String and custom objects).',
    commonMistakes: 'Expecting empty string ("") instead of null reference.',
    takeaway: 'Java guarantees zero-initialization for all heap allocations to prevent indeterminate memory reads.'
  },
  {
    id: 6,
    stage: 'BEGINNER',
    stageIndex: 6,
    category: 'OUTPUT',
    topic: 'Strings',
    title: 'String Pool vs Heap Object Equality',
    prompt: 'What does this program print?',
    codeSnippet: `public class StringRef {
    public static void main(String[] args) {
        String s1 = "Java";
        String s2 = "Java";
        String s3 = new String("Java");
        System.out.println((s1 == s2) + " " + (s1 == s3) + " " + s1.equals(s3));
    }
}`,
    expectedOutput: 'true false true',
    marks: 2,
    explanation: 's1 and s2 are string literals residing in the String Constant Pool, so `s1 == s2` evaluates reference equality to `true`. `new String("Java")` explicitly allocates a distinct object in heap memory, so `s1 == s3` is `false`. However, `equals()` checks character-by-character value equality, so `s1.equals(s3)` is `true`.',
    commonMistakes: 'Using `==` to compare String values in Java instead of `.equals()`.',
    takeaway: 'Always use `.equals()` for value comparison; `==` compares object reference memory addresses.'
  },
  {
    id: 7,
    stage: 'BEGINNER',
    stageIndex: 7,
    category: 'OUTPUT',
    topic: 'Methods',
    title: 'Pass-by-Value Mechanics with Objects',
    prompt: 'What is the output of the following Java program?',
    codeSnippet: `public class PassTest {
    static void modify(int x, StringBuilder sb) {
        x = 50;
        sb.append("World");
        sb = new StringBuilder("New");
    }
    public static void main(String[] args) {
        int a = 10;
        StringBuilder text = new StringBuilder("Hello");
        modify(a, text);
        System.out.println(a + " " + text);
    }
}`,
    expectedOutput: '10 HelloWorld',
    marks: 2,
    explanation: 'Java is strictly pass-by-value. For primitives like `int a`, a copy of the value 10 is passed, so changing `x` does not alter `a`. For objects like `text`, a copy of the reference is passed. `sb.append("World")` mutates the underlying heap object referred to by both `text` and `sb`. Reassigning `sb = new StringBuilder("New")` only alters the local reference copy, not `text`. Hence `10 HelloWorld`.',
    commonMistakes: 'Thinking Java has pass-by-reference, or thinking the reassignment `sb = new StringBuilder()` affects the caller.',
    takeaway: 'Java passes object references by value: you can mutate object state through the reference, but cannot reassign the caller\'s reference.'
  },
  {
    id: 8,
    stage: 'BEGINNER',
    stageIndex: 8,
    category: 'MCQ',
    topic: 'Type Casting',
    title: 'Explicit Narrowing and Integer Overflow',
    prompt: 'What happens when evaluating `int x = 130; byte b = (byte) x; System.out.println(b);` in Java?',
    options: [
      '-126',
      '130',
      'Compilation Error',
      'Runtime ArithmeticException'
    ],
    expectedAnswer: '-126',
    marks: 2,
    explanation: 'A `byte` range is -128 to 127. 130 in binary is `...0000 0000 1000 0010`. Truncating to the lower 8 bits yields `1000 0010`. In two\'s complement, the leading 1 signifies negative: -(2^7) + 2 = -128 + 2 = -126.',
    commonMistakes: 'Expecting an overflow exception or automatic clamping to 127.',
    takeaway: 'Narrowing primitive conversion silently discards higher-order bits without runtime exceptions.'
  },
  {
    id: 9,
    stage: 'BEGINNER',
    stageIndex: 9,
    category: 'ERROR_DETECTION',
    topic: 'Basic I/O',
    title: 'Scanner nextInt() and nextLine() Buffer Handling',
    prompt: 'Identify the common bug when reading an integer followed by a line using `java.util.Scanner`:',
    codeSnippet: `Scanner scanner = new Scanner(System.in);
int age = scanner.nextInt();
String fullName = scanner.nextLine(); // What happens here?`,
    options: [
      'nextLine() immediately consumes the leftover newline character without waiting for user input',
      'nextInt() throws an IOException when followed by nextLine()',
      'Scanner automatically closes after reading the integer',
      'fullName will always be assigned null'
    ],
    expectedAnswer: 'nextLine() immediately consumes the leftover newline character without waiting for user input',
    marks: 2,
    explanation: '`nextInt()` reads only the numeric tokens and leaves the trailing newline delimiter (`\\n`) in the input stream buffer. When `nextLine()` is invoked immediately after, it reads from the current position up to that pending newline, returning an empty string without prompting the user.',
    commonMistakes: 'Not calling an intermediate `scanner.nextLine()` to flush the newline token.',
    takeaway: 'Always flush the buffer with `scanner.nextLine()` after `nextInt()` or `next()` before reading a full line.'
  },
  {
    id: 10,
    stage: 'BEGINNER',
    stageIndex: 10,
    category: 'OUTPUT',
    topic: 'Arrays',
    title: 'In-place Array Reversal Logic',
    prompt: 'Predict the console output of this in-place reversal logic:',
    codeSnippet: `public class ReverseTest {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        System.out.println(arr[0] + "" + arr[1] + "" + arr[2] + "" + arr[3] + "" + arr[4]);
    }
}`,
    expectedOutput: '54321',
    marks: 2,
    explanation: 'The two-pointer technique swaps elements from the outer edges inward: 1 swaps with 5, 2 swaps with 4, and the middle element 3 remains at index 2. When printed sequentially, the output is "54321".',
    commonMistakes: 'Iterating through the entire length instead of halting at `left < right`, which would reverse the array twice.',
    takeaway: 'The two-pointer approach performs array reversal in O(n) time and O(1) auxiliary space.'
  },
  {
    id: 11,
    stage: 'BEGINNER',
    stageIndex: 11,
    category: 'ERROR_DETECTION',
    topic: 'Arrays',
    title: 'Off-by-One Array Boundary Violation',
    prompt: 'What runtime exception does the following loop produce, and at which iteration?',
    codeSnippet: `int[] numbers = {10, 20, 30, 40};
for (int i = 0; i <= numbers.length; i++) {
    System.out.println(numbers[i]);
}`,
    options: [
      'ArrayIndexOutOfBoundsException when i == 4',
      'NullPointerException when i == 4',
      'ArrayStoreException when i == 0',
      'The code terminates normally after printing 4 elements'
    ],
    expectedAnswer: 'ArrayIndexOutOfBoundsException when i == 4',
    marks: 2,
    explanation: 'Arrays in Java are zero-indexed, valid from 0 to `length - 1`. Here `numbers.length` is 4. The loop condition `i <= numbers.length` executes for `i = 4`, attempting to access `numbers[4]`, which throws `java.lang.ArrayIndexOutOfBoundsException: Index 4 out of bounds for length 4`.',
    commonMistakes: 'Using `<=` instead of `<` when looping through array indices.',
    takeaway: 'Valid array indices are strictly `0` through `array.length - 1`.'
  },
  {
    id: 12,
    stage: 'BEGINNER',
    stageIndex: 12,
    category: 'DEBUGGING',
    topic: 'Operators',
    title: 'Integer Division vs Floating Point Precision',
    prompt: 'A developer writes the following to calculate an average percentage: `int total = 45; int max = 50; double result = total / max * 100; System.out.println(result);`. Why does it print 0.0 instead of 90.0?',
    options: [
      'total / max performs integer division yielding 0, which is then multiplied by 100 before assignment to double',
      'double literals cannot hold whole numbers like 90.0',
      'Multiplication takes precedence over division in Java',
      'The expression causes arithmetic underflow'
    ],
    expectedAnswer: 'total / max performs integer division yielding 0, which is then multiplied by 100 before assignment to double',
    marks: 2,
    explanation: 'Because both `total` and `max` are `int`, `total / max` performs integer truncation: 45 / 50 evaluates to 0. Then `0 * 100` is 0, which is widened to `0.0`. To fix this, write `(double) total / max * 100` or `total * 100.0 / max`.',
    commonMistakes: 'Expecting the assignment target type (`double result`) to change how earlier operands are evaluated.',
    takeaway: 'In Java, operand types dictate operator behavior; casting at least one operand to double forces floating-point division.'
  },
  {
    id: 13,
    stage: 'BEGINNER',
    stageIndex: 13,
    category: 'CODING',
    topic: 'Strings',
    title: 'Reverse Words in a Sentence',
    prompt: 'Write a Java program that reads a line of space-separated words from standard input and prints the sentence with the word order reversed. For example, "Java is awesome" becomes "awesome is Java".',
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine().trim();
        if (line.isEmpty()) return;
        
        // Write your solution here:
        String[] words = line.split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(" ");
        }
        System.out.println(sb.toString());
    }
}`,
    testCases: [
      {
        id: 'tc1',
        input: 'Java is awesome\n',
        expectedOutput: 'awesome is Java',
        isHidden: false,
        explanation: 'Standard multi-word sentence'
      },
      {
        id: 'tc2',
        input: 'Data Structures and Algorithms\n',
        expectedOutput: 'Algorithms and Structures Data',
        isHidden: false,
        explanation: 'Four words'
      },
      {
        id: 'tc3',
        input: 'SingleWord\n',
        expectedOutput: 'SingleWord',
        isHidden: true,
        explanation: 'Single word edge case'
      }
    ],
    marks: 2,
    explanation: 'Split the input string by whitespace (`\\s+`) into a String array, then traverse from `words.length - 1` down to 0, appending each word to a StringBuilder separated by spaces.',
    commonMistakes: 'Reversing individual characters instead of word order, or adding a trailing space.',
    takeaway: 'String splitting and StringBuilder accumulation solve word ordering problems in O(n) linear time.'
  },
  {
    id: 14,
    stage: 'BEGINNER',
    stageIndex: 14,
    category: 'CODING',
    topic: 'Arrays',
    title: 'Find the Second Largest Element in an Array',
    prompt: 'Given an array of integers provided via standard input (first line is integer N, second line contains N integers), find and print the second largest unique value. If no second largest exists, print -1.',
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int first = Integer.MIN_VALUE;
        int second = Integer.MIN_VALUE;
        
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (val > first) {
                second = first;
                first = val;
            } else if (val < first && val > second) {
                second = val;
            }
        }
        
        if (second == Integer.MIN_VALUE) {
            System.out.println("-1");
        } else {
            System.out.println(second);
        }
    }
}`,
    testCases: [
      {
        id: 'tc1',
        input: '5\n12 35 1 10 34\n',
        expectedOutput: '34',
        isHidden: false,
        explanation: '35 is largest, 34 is second largest'
      },
      {
        id: 'tc2',
        input: '4\n10 10 10 10\n',
        expectedOutput: '-1',
        isHidden: false,
        explanation: 'All elements duplicate; no second distinct largest'
      },
      {
        id: 'tc3',
        input: '3\n-5 -2 -10\n',
        expectedOutput: '-5',
        isHidden: true,
        explanation: 'Negative numbers array'
      }
    ],
    marks: 2,
    explanation: 'Maintain two tracking variables: `first` and `second`, both initialized to `Integer.MIN_VALUE`. For each incoming element `x`, if `x > first`, `second` receives `first` and `first` receives `x`. Else if `x < first && x > second`, `second` is updated.',
    commonMistakes: 'Sorting the array (O(n log n)) instead of single pass (O(n)), or failing when elements are duplicated or negative.',
    takeaway: 'Tracking top k elements can be done in O(n) time and O(1) space with simple state variables.'
  },
  {
    id: 15,
    stage: 'BEGINNER',
    stageIndex: 15,
    category: 'CODING',
    topic: 'Strings',
    title: 'Valid Anagram Check',
    prompt: 'Read two lowercase single-word strings from standard input on separate lines. Print "true" if the two strings are anagrams (contain the exact same letters in any order), or "false" otherwise.',
    starterCode: `import java.util.Scanner;
import java.util.Arrays;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s1 = sc.next();
        String s2 = sc.next();
        
        if (s1.length() != s2.length()) {
            System.out.println("false");
            return;
        }
        
        int[] freq = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            freq[s1.charAt(i) - 'a']++;
            freq[s2.charAt(i) - 'a']--;
        }
        
        boolean isAnagram = true;
        for (int count : freq) {
            if (count != 0) {
                isAnagram = false;
                break;
            }
        }
        System.out.println(isAnagram);
    }
}`,
    testCases: [
      {
        id: 'tc1',
        input: 'listen\nsilent\n',
        expectedOutput: 'true',
        isHidden: false,
        explanation: 'listen and silent are exact anagrams'
      },
      {
        id: 'tc2',
        input: 'triangle\nintegral\n',
        expectedOutput: 'true',
        isHidden: false,
        explanation: 'triangle and integral have matching letter frequencies'
      },
      {
        id: 'tc3',
        input: 'hello\nworld\n',
        expectedOutput: 'false',
        isHidden: true,
        explanation: 'Different letters'
      }
    ],
    marks: 2,
    explanation: 'A frequency array of size 26 counts occurrences: increment for characters in the first string and decrement for the second string. If all counts return to zero, the strings are anagrams.',
    commonMistakes: 'Failing to check length equality upfront or using slow O(n^2) nested string replacements.',
    takeaway: 'Character frequency counting with fixed 26-element array provides optimal O(n) time and O(1) space.'
  },

  // ==========================================
  // STAGE 2: INTERMEDIATE (Questions 16 to 35)
  // Topics: Classes, Constructors, Inheritance, Polymorphism, Encapsulation, Abstraction, Interfaces, Overloading/Overriding, Exceptions, Collections (ArrayList, HashMap, HashSet), String handling, static/final, basic recursion
  // ==========================================
  {
    id: 16,
    stage: 'INTERMEDIATE',
    stageIndex: 1,
    category: 'OUTPUT',
    topic: 'Classes and Objects',
    title: 'Static vs Instance Variable Shadowing',
    prompt: 'What will be printed by the following program?',
    codeSnippet: `class Counter {
    static int globalCount = 0;
    int instanceCount = 0;

    Counter() {
        globalCount++;
        instanceCount++;
    }
}

public class Main {
    public static void main(String[] args) {
        Counter c1 = new Counter();
        Counter c2 = new Counter();
        Counter c3 = new Counter();
        System.out.println(Counter.globalCount + " " + c1.instanceCount + " " + c3.instanceCount);
    }
}`,
    expectedOutput: '3 1 1',
    marks: 2,
    explanation: '`static int globalCount` is shared across all instances of `Counter` in the class loader; with 3 instantiations, it increments to 3. `instanceCount` is bound to each individual object heap instance, so both `c1.instanceCount` and `c3.instanceCount` equal 1. Result: "3 1 1".',
    commonMistakes: 'Thinking instance variables are shared or static variables get reset on new instances.',
    takeaway: 'Static fields belong to the class level; instance fields are allocated separately for every new object.'
  },
  {
    id: 17,
    stage: 'INTERMEDIATE',
    stageIndex: 2,
    category: 'OUTPUT',
    topic: 'Constructors',
    title: 'Constructor Chaining and Initialization Order',
    prompt: 'Determine the exact console output of this constructor hierarchy:',
    codeSnippet: `class Parent {
    Parent() {
        System.out.print("P1 ");
    }
    Parent(int x) {
        this();
        System.out.print("P2:" + x + " ");
    }
}

class Child extends Parent {
    Child() {
        super(10);
        System.out.print("C1 ");
    }
}

public class Main {
    public static void main(String[] args) {
        new Child();
    }
}`,
    expectedOutput: 'P1 P2:10 C1',
    marks: 2,
    explanation: '`new Child()` calls `Child()`, which invokes `super(10)` -> `Parent(10)` uses `this()` to invoke `Parent()` first. Hence `Parent()` prints "P1 ", then `Parent(10)` prints "P2:10 ", and finally `Child()` body prints "C1 ".',
    commonMistakes: 'Executing subclass constructor body before superclass constructor completes.',
    takeaway: 'Superclass constructor execution always completes before subclass constructor body executes.'
  },
  {
    id: 18,
    stage: 'INTERMEDIATE',
    stageIndex: 3,
    category: 'OUTPUT',
    topic: 'Inheritance',
    title: 'Method Overriding vs Method Hiding with Static',
    prompt: 'What does this polymorphism and static method snippet output?',
    codeSnippet: `class Base {
    public static void display() {
        System.out.print("BaseStatic ");
    }
    public void show() {
        System.out.print("BaseShow ");
    }
}

class Sub extends Base {
    public static void display() {
        System.out.print("SubStatic ");
    }
    @Override
    public void show() {
        System.out.print("SubShow ");
    }
}

public class Test {
    public static void main(String[] args) {
        Base obj = new Sub();
        obj.display();
        obj.show();
    }
}`,
    expectedOutput: 'BaseStatic SubShow',
    marks: 2,
    explanation: 'Static methods are resolved at compile time based on the reference type (`Base obj`), not runtime instance (`Sub`). Hence `obj.display()` calls `Base.display()`. Non-static methods use dynamic method dispatch (virtual tables) resolved at runtime, calling `Sub.show()`.',
    commonMistakes: 'Believing static methods can be polymorphically overridden (they are hidden, not overridden).',
    takeaway: 'Static methods participate in method hiding determined by reference type; instance methods participate in dynamic overriding.'
  },
  {
    id: 19,
    stage: 'INTERMEDIATE',
    stageIndex: 4,
    category: 'MCQ',
    topic: 'Polymorphism',
    title: 'Dynamic Method Dispatch and Late Binding',
    prompt: 'Dynamic method dispatch in Java is the mechanism by which a call to an overridden method is resolved at:',
    options: [
      'Runtime, based on the actual object type in heap',
      'Compile-time, based on the reference variable type',
      'Class loading time, by the bytecode verifier',
      'JIT optimization phase only'
    ],
    expectedAnswer: 'Runtime, based on the actual object type in heap',
    marks: 2,
    explanation: 'Dynamic method dispatch (also called late binding) resolves calls to overridden virtual methods at runtime using the object\'s vtable based on the actual object instantiated in heap memory.',
    commonMistakes: 'Confusing dynamic method dispatch (runtime) with method overloading (compile-time resolution).',
    takeaway: 'Polymorphic behavior enables flexible substitution of subclasses through parent interfaces at runtime.'
  },
  {
    id: 20,
    stage: 'INTERMEDIATE',
    stageIndex: 5,
    category: 'MCQ',
    topic: 'Encapsulation',
    title: 'Immutable Class Requirements in Java',
    prompt: 'Which of the following is NOT a required step to make a class completely immutable in Java?',
    options: [
      'Implement the java.lang.Cloneable interface',
      'Declare the class as final to prevent subclassing',
      'Make all fields private and final',
      'Perform defensive copies of any mutable input/output fields'
    ],
    expectedAnswer: 'Implement the java.lang.Cloneable interface',
    marks: 2,
    explanation: 'Implementing `Cloneable` is not required and can actually breach immutability if poorly overridden. True immutability requires: (1) class final, (2) private final fields, (3) no mutator methods, (4) defensive copies of mutable fields (like Date or List).',
    commonMistakes: 'Thinking Cloneable helps immutability when it typically introduces shallow copy pitfalls.',
    takeaway: 'Defensive copying and final classes prevent external mutation of internal object state.'
  },
  {
    id: 21,
    stage: 'INTERMEDIATE',
    stageIndex: 6,
    category: 'MCQ',
    topic: 'Interfaces',
    title: 'Default Methods in Interfaces & Diamond Problem',
    prompt: 'If class C implements interfaces A and B, and both A and B declare an identical default method `default void log()`, how does Java resolve this conflict?',
    options: [
      'The compiler forces class C to explicitly override log() and resolve ambiguity',
      'The compiler automatically picks the method from interface A (first declared in implements)',
      'A runtime AmbiguityException is thrown when log() is invoked',
      'Class C inherits both methods under mangled symbol names'
    ],
    expectedAnswer: 'The compiler forces class C to explicitly override log() and resolve ambiguity',
    marks: 2,
    explanation: 'Java prohibits ambiguous multiple inheritance of behavior. If two interfaces provide conflicting default implementations, the compiler refuses to build until class C overrides `log()` and optionally calls `A.super.log()` or `B.super.log()`.',
    commonMistakes: 'Assuming declaration order in `implements A, B` acts as a tie-breaker.',
    takeaway: 'Ambiguous default interface methods must be explicitly disambiguated in the implementing class.'
  },
  {
    id: 22,
    stage: 'INTERMEDIATE',
    stageIndex: 7,
    category: 'OUTPUT',
    topic: 'Method Overloading',
    title: 'Overloading Resolution with Widening vs Autoboxing',
    prompt: 'What does this overloaded method invocation print?',
    codeSnippet: `public class OverloadTest {
    static void test(long x) {
        System.out.print("widening ");
    }
    static void test(Integer x) {
        System.out.print("boxing ");
    }
    static void test(int... x) {
        System.out.print("varargs ");
    }
    public static void main(String[] args) {
        int val = 10;
        test(val);
    }
}`,
    expectedOutput: 'widening',
    marks: 2,
    explanation: 'Java\'s method overload resolution hierarchy prioritizes: (1) Primitive Widening (`int` to `long`), (2) Autoboxing (`int` to `Integer`), (3) Varargs (`int...`). Widening beats boxing for backward compatibility with pre-Java 5 code.',
    commonMistakes: 'Assuming autoboxing to Integer is chosen over primitive widening to long.',
    takeaway: 'Java method resolution rule: Widening beats Boxing, and Boxing beats Varargs.'
  },
  {
    id: 23,
    stage: 'INTERMEDIATE',
    stageIndex: 8,
    category: 'MCQ',
    topic: 'Exception Handling',
    title: 'Checked vs Unchecked Exception Hierarchy',
    prompt: 'Which of the following classes is a CHECKED exception in Java?',
    options: [
      'java.io.IOException',
      'java.lang.NullPointerException',
      'java.lang.IllegalArgumentException',
      'java.lang.ArithmeticException'
    ],
    expectedAnswer: 'java.io.IOException',
    marks: 2,
    explanation: 'In Java, exceptions inheriting from `java.lang.RuntimeException` and `java.lang.Error` are unchecked (compiler does not require throws/try-catch). All other subclasses of `java.lang.Exception` (like `IOException`, `SQLException`) are checked exceptions.',
    commonMistakes: 'Categorizing IllegalArgumentException as checked because it involves user arguments.',
    takeaway: 'Only subclasses of Exception that do NOT extend RuntimeException are checked by the compiler.'
  },
  {
    id: 24,
    stage: 'INTERMEDIATE',
    stageIndex: 9,
    category: 'MCQ',
    topic: 'Exception Handling',
    title: 'try-with-resources and AutoCloseable Order',
    prompt: 'In a try-with-resources statement declaring multiple resources: `try (Res A = new Res(); Res B = new Res())`, in what order are the resources closed?',
    options: [
      'Reverse order of declaration (B is closed before A)',
      'Same order of declaration (A is closed before B)',
      'Unspecified concurrent order depending on GC',
      'Simultaneously on background thread'
    ],
    expectedAnswer: 'Reverse order of declaration (B is closed before A)',
    marks: 2,
    explanation: 'Java try-with-resources guarantees deterministic cleanup in the REVERSE order of declaration. Resource B is closed first, then Resource A. This prevents dependent resources from being orphaned.',
    commonMistakes: 'Assuming FIFO (first-in first-out) closing order.',
    takeaway: 'Try-with-resources guarantees LIFO (stack order) closing to honor inter-resource dependencies.'
  },
  {
    id: 25,
    stage: 'INTERMEDIATE',
    stageIndex: 10,
    category: 'OUTPUT',
    topic: 'Exception Handling',
    title: 'Finally Block Return Value Precedence',
    prompt: 'What value is returned and printed by this method?',
    codeSnippet: `public class FinallyTest {
    static int calculate() {
        try {
            int a = 10 / 2;
            return a;
        } catch (Exception e) {
            return -1;
        } finally {
            return 99;
        }
    }
    public static void main(String[] args) {
        System.out.println(calculate());
    }
}`,
    expectedOutput: '99',
    marks: 2,
    explanation: 'A `return` statement in a `finally` block overrides and discards any prior return value or unhandled exception originating inside the `try` or `catch` blocks. The method evaluates `a = 5`, but before returning, the `finally` block executes `return 99;`.',
    commonMistakes: 'Thinking the return from try takes precedence over finally.',
    takeaway: 'Avoid return statements in finally blocks as they swallow prior returns and active exceptions.'
  },
  {
    id: 26,
    stage: 'INTERMEDIATE',
    stageIndex: 11,
    category: 'MCQ',
    topic: 'Collections Framework',
    title: 'ArrayList vs LinkedList Time Complexity Trade-offs',
    prompt: 'What is the time complexity of retrieving an element by index using `get(int index)` in `ArrayList` versus `LinkedList`?',
    options: [
      'ArrayList is O(1); LinkedList is O(n)',
      'ArrayList is O(n); LinkedList is O(1)',
      'Both are O(1) random access',
      'Both are O(log n)'
    ],
    expectedAnswer: 'ArrayList is O(1); LinkedList is O(n)',
    marks: 2,
    explanation: '`ArrayList` uses a contiguous internal array, allowing direct memory address calculation (`base + index * element_size`) in O(1) constant time. `LinkedList` is a doubly-linked list requiring node traversal from head or tail to the requested index in O(n) linear time.',
    commonMistakes: 'Assuming LinkedList is faster for indexed reads because insertions at head are O(1).',
    takeaway: 'ArrayList is almost always preferred for reading data due to O(1) random access and CPU cache locality.'
  },
  {
    id: 27,
    stage: 'INTERMEDIATE',
    stageIndex: 12,
    category: 'MCQ',
    topic: 'Collections Framework',
    title: 'HashMap Internal Mechanism & Hash Collisions',
    prompt: 'Since Java 8, what data structure does `java.util.HashMap` transition a bucket to when the number of colliding entries exceeds 8 (TREEIFY_THRESHOLD)?',
    options: [
      'Red-Black Tree (TreeMap node)',
      'AVL Tree',
      'Doubly Linked List',
      'Skip List'
    ],
    expectedAnswer: 'Red-Black Tree (TreeMap node)',
    marks: 2,
    explanation: 'In Java 8+, when a hash bucket exceeds 8 entries (and total table capacity >= 64), the linked list converts into a balanced Red-Black Tree. This reduces worst-case lookup from O(n) to O(log n), defending against hash-collision Denial of Service attacks.',
    commonMistakes: 'Assuming HashMap always maintains a linked list or resizes indefinitely.',
    takeaway: 'Java 8 treeifies dense HashMap buckets to guarantee O(log n) worst-case search performance.'
  },
  {
    id: 28,
    stage: 'INTERMEDIATE',
    stageIndex: 13,
    category: 'OUTPUT',
    topic: 'Collections Framework',
    title: 'HashSet Uniqueness and Element Ordering',
    prompt: 'What is printed by this HashSet iteration?',
    codeSnippet: `import java.util.*;

public class SetTest {
    public static void main(String[] args) {
        Set<String> set = new LinkedHashSet<>();
        set.add("Alpha");
        set.add("Beta");
        set.add("Alpha");
        set.add("Gamma");
        System.out.println(String.join("-", set));
    }
}`,
    expectedOutput: 'Alpha-Beta-Gamma',
    marks: 2,
    explanation: '`LinkedHashSet` enforces mathematical set uniqueness (the second "Alpha" is rejected as a duplicate) while preserving insertion order via a doubly-linked list running through all entries. Result: "Alpha-Beta-Gamma".',
    commonMistakes: 'Expecting "Beta-Gamma-Alpha" or duplicated elements.',
    takeaway: 'LinkedHashSet combines hash lookup performance with deterministic insertion-order iteration.'
  },
  {
    id: 29,
    stage: 'INTERMEDIATE',
    stageIndex: 14,
    category: 'MCQ',
    topic: 'String Handling',
    title: 'StringBuilder vs StringBuffer Thread Safety',
    prompt: 'What is the primary difference between `java.lang.StringBuilder` and `java.lang.StringBuffer`?',
    options: [
      'StringBuffer is synchronized (thread-safe); StringBuilder is not synchronized and is faster in single-threaded code',
      'StringBuilder is synchronized; StringBuffer is not',
      'StringBuilder is immutable; StringBuffer is mutable',
      'StringBuffer stores characters on stack; StringBuilder on heap'
    ],
    expectedAnswer: 'StringBuffer is synchronized (thread-safe); StringBuilder is not synchronized and is faster in single-threaded code',
    marks: 2,
    explanation: '`StringBuffer` was introduced in Java 1.0 with synchronized methods to ensure thread safety at the cost of synchronization overhead. `StringBuilder` was added in Java 5 as a drop-in, unsynchronized replacement offering superior performance for single-threaded string concatenation.',
    commonMistakes: 'Using StringBuffer in local methods where no concurrency exists.',
    takeaway: 'Prefer StringBuilder for local string manipulation unless thread synchronization is explicitly required.'
  },
  {
    id: 30,
    stage: 'INTERMEDIATE',
    stageIndex: 15,
    category: 'OUTPUT',
    topic: 'Static and Final',
    title: 'Class Loading & Static Initializer Block Order',
    prompt: 'What is the exact output when this class is loaded and instantiated?',
    codeSnippet: `class Demo {
    static {
        System.out.print("S1 ");
    }
    {
        System.out.print("I1 ");
    }
    Demo() {
        System.out.print("C1 ");
    }
}

public class Main {
    public static void main(String[] args) {
        new Demo();
        new Demo();
    }
}`,
    expectedOutput: 'S1 I1 C1 I1 C1',
    marks: 2,
    explanation: 'Static initializer blocks run exactly once when the class is first loaded by the JVM ("S1 "). Instance initializer blocks run before the constructor for every instantiation ("I1 " then "C1 "). The second instantiation does not trigger static initialization, only "I1 C1 ".',
    commonMistakes: 'Thinking static initializers execute upon every new instance creation.',
    takeaway: 'Static blocks execute once per class load; instance blocks and constructors execute per object creation.'
  },
  {
    id: 31,
    stage: 'INTERMEDIATE',
    stageIndex: 16,
    category: 'MCQ',
    topic: 'Static and Final',
    title: 'The final Keyword on Reference Variables',
    prompt: 'What happens when declaring `final List<String> list = new ArrayList<>(); list.add("Java");`?',
    options: [
      'The code compiles and successfully adds "Java" to the list',
      'Compilation Error: Cannot invoke modifying methods on a final reference',
      'Runtime UnsupportedOperationException is thrown',
      'The list becomes an unmodifiable immutable list'
    ],
    expectedAnswer: 'The code compiles and successfully adds "Java" to the list',
    marks: 2,
    explanation: 'The `final` keyword on a reference variable means the reference itself cannot be reassigned to point to another object (`list = new ArrayList<>()` would fail to compile). It does NOT make the object pointed to immutable.',
    commonMistakes: 'Confusing a final reference with an immutable collection.',
    takeaway: '`final` protects the reference pointer from reassignment; it does not freeze internal object state.'
  },
  {
    id: 32,
    stage: 'INTERMEDIATE',
    stageIndex: 17,
    category: 'OUTPUT',
    topic: 'Recursion',
    title: 'Recursive Call Stack Evaluation',
    prompt: 'What does this recursive function return for `mystery(4)`?',
    codeSnippet: `public class Recurse {
    static int mystery(int n) {
        if (n <= 1) return 1;
        return n + mystery(n - 2);
    }
    public static void main(String[] args) {
        System.out.println(mystery(4));
    }
}`,
    expectedOutput: '7',
    marks: 2,
    explanation: 'Call trace: mystery(4) = 4 + mystery(2) -> mystery(2) = 2 + mystery(0) -> mystery(0) matches base case `n <= 1`, returning 1. Unwinding: mystery(2) = 2 + 1 = 3; mystery(4) = 4 + 3 = 7.',
    commonMistakes: 'Miscalculating step `n - 2` or misidentifying base case return value.',
    takeaway: 'Every recursive method requires an unambiguous base case to prevent `StackOverflowError`.'
  },
  {
    id: 33,
    stage: 'INTERMEDIATE',
    stageIndex: 18,
    category: 'DEBUGGING',
    topic: 'Collections Framework',
    title: 'Violating the equals() and hashCode() Contract',
    prompt: 'A class overrides `equals(Object o)` to compare an `id` field, but does NOT override `hashCode()`. What critical bug occurs when using this class as a key in `HashMap`?',
    options: [
      'Two logically equal objects will produce different hash codes, causing map.get() to return null for existing keys',
      'The JVM throws a DuplicateKeyException during map.put()',
      'HashMap automatically throws a NullPointerException',
      'The compiler rejects the class with a contract error'
    ],
    expectedAnswer: 'Two logically equal objects will produce different hash codes, causing map.get() to return null for existing keys',
    marks: 2,
    explanation: 'The contract dictates: if `a.equals(b)` is true, `a.hashCode()` MUST equal `b.hashCode()`. If `hashCode()` is not overridden, two separate instances use default `System.identityHashCode()` (based on memory address), landing in different hash buckets. Even though `equals()` returns true, `get()` looks in the wrong bucket and returns `null`.',
    commonMistakes: 'Overriding equals() without overriding hashCode().',
    takeaway: 'Always override `hashCode()` whenever you override `equals()`, maintaining identical equality fields.'
  },
  {
    id: 34,
    stage: 'INTERMEDIATE',
    stageIndex: 19,
    category: 'CODING',
    topic: 'Collections Framework',
    title: 'Two Sum with HashMap in O(n) Time',
    prompt: 'Given an array of integers and a target sum provided on standard input, find the 0-based indices of the two numbers such that they add up to target. Print the smaller index first separated by a space. You may assume exactly one solution exists.',
    starterCode: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                int firstIdx = map.get(complement);
                System.out.println(Math.min(firstIdx, i) + " " + Math.max(firstIdx, i));
                return;
            }
            map.put(nums[i], i);
        }
    }
}`,
    testCases: [
      {
        id: 'tc1',
        input: '4\n2 7 11 15\n9\n',
        expectedOutput: '0 1',
        isHidden: false,
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
      },
      {
        id: 'tc2',
        input: '3\n3 2 4\n6\n',
        expectedOutput: '1 2',
        isHidden: false,
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
      },
      {
        id: 'tc3',
        input: '2\n3 3\n6\n',
        expectedOutput: '0 1',
        isHidden: true,
        explanation: 'Duplicate numbers matching target'
      }
    ],
    marks: 2,
    explanation: 'Using a HashMap to store values and their indices allows checking for the complement `target - nums[i]` in O(1) average time, resulting in an overall O(n) time and O(n) space solution.',
    commonMistakes: 'Using brute force O(n^2) nested loops which times out on large inputs.',
    takeaway: 'Hash maps trade linear memory to reduce quadratic search problems down to linear time.'
  },
  {
    id: 35,
    stage: 'INTERMEDIATE',
    stageIndex: 20,
    category: 'CODING',
    topic: 'Collections Framework',
    title: 'Array-based Custom Stack Implementation',
    prompt: 'Implement a minimal stack of integers. Read N commands: "push X", "pop", "peek". For each "pop" and "peek", print the returned value. If the stack is empty on pop/peek, print "EMPTY".',
    starterCode: `import java.util.Scanner;

public class Solution {
    static class ArrayStack {
        private int[] data = new int[100];
        private int top = -1;

        public void push(int x) {
            data[++top] = x;
        }

        public String pop() {
            if (top == -1) return "EMPTY";
            return String.valueOf(data[top--]);
        }

        public String peek() {
            if (top == -1) return "EMPTY";
            return String.valueOf(data[top]);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        ArrayStack stack = new ArrayStack();

        for (int i = 0; i < n; i++) {
            String cmd = sc.next();
            if (cmd.equals("push")) {
                stack.push(sc.nextInt());
            } else if (cmd.equals("pop")) {
                System.out.println(stack.pop());
            } else if (cmd.equals("peek")) {
                System.out.println(stack.peek());
            }
        }
    }
}`,
    testCases: [
      {
        id: 'tc1',
        input: '6\npush 10\npush 20\npeek\npop\npop\npop\n',
        expectedOutput: '20\n20\n10\nEMPTY',
        isHidden: false,
        explanation: 'Standard LIFO stack push, peek, and pop operations'
      },
      {
        id: 'tc2',
        input: '3\npop\npush 5\npeek\n',
        expectedOutput: 'EMPTY\n5',
        isHidden: false,
        explanation: 'Initial empty pop handled gracefully'
      },
      {
        id: 'tc3',
        input: '4\npush 100\npush 200\npop\npeek\n',
        expectedOutput: '200\n100',
        isHidden: true,
        explanation: 'Peek after pop verifies correct top pointer'
      }
    ],
    marks: 2,
    explanation: 'A stack operates on Last-In First-Out (LIFO). An internal array and a pointer `top` initialized to -1 provides O(1) push, pop, and peek operations.',
    commonMistakes: 'Off-by-one errors in top pointer manipulation or failing to guard against underflow.',
    takeaway: 'Core data structures like stacks form the mechanical foundation of call stacks, parsing, and undo histories.'
  },

  // ==========================================
  // STAGE 3: ADVANCED (Questions 36 to 50)
  // Topics: Generics, Collections in Depth, Comparable/Comparator, Lambdas, Functional Interfaces, Streams API, Recursion/Backtracking, Multithreading, Synchronization, Memory Model/JVM, Problem Solving
  // ==========================================
  {
    id: 36,
    stage: 'ADVANCED',
    stageIndex: 1,
    category: 'MCQ',
    topic: 'Generics',
    title: 'PECS Rule (Producer Extends, Consumer Super)',
    prompt: 'Under Joshua Bloch\'s PECS rule for Java Generics wildcards, what wildcard bounds should you use when reading from a collection versus writing into a collection?',
    options: [
      '<? extends T> when reading (Producer); <? super T> when writing (Consumer)',
      '<? super T> when reading; <? extends T> when writing',
      '<?> for both reading and writing',
      '<T extends Object> for all generic variance'
    ],
    expectedAnswer: '<? extends T> when reading (Producer); <? super T> when writing (Consumer)',
    marks: 2,
    explanation: 'PECS stands for Producer Extends, Consumer Super. If your generic parameter produces items to be read by your method, use `<? extends T>` (covariance). If it consumes items to be written/added to the collection, use `<? super T>` (contravariance).',
    commonMistakes: 'Attempting to add elements to a `List<? extends Number>`, which fails compilation because the concrete type is unknown.',
    takeaway: 'Use `extends` to safely read subtypes, and `super` to safely write supertypes.'
  },
  {
    id: 37,
    stage: 'ADVANCED',
    stageIndex: 2,
    category: 'OUTPUT',
    topic: 'Comparable and Comparator',
    title: 'Chained Comparator Ordering',
    prompt: 'What order of strings is printed by this chained comparator?',
    codeSnippet: `import java.util.*;

public class CompTest {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("apple", "banana", "kiwi", "pear");
        list.sort(Comparator.comparingInt(String::length).reversed().thenComparing(Comparator.naturalOrder()));
        System.out.println(String.join(",", list));
    }
}`,
    expectedOutput: 'banana,apple,kiwi,pear',
    marks: 2,
    explanation: 'Primary key: `length` reversed -> descending length. "banana" (6) comes first. "apple" (5) second. "kiwi" and "pear" both have length 4, triggering secondary comparator `thenComparing(Comparator.naturalOrder())` -> alphabetical: "kiwi" before "pear". Result: "banana,apple,kiwi,pear".',
    commonMistakes: 'Forgetting that ties in primary comparator defer to the secondary `thenComparing` clause.',
    takeaway: 'Java 8+ `Comparator` fluent API allows composable multi-criteria sorting pipelines.'
  },
  {
    id: 38,
    stage: 'ADVANCED',
    stageIndex: 3,
    category: 'MCQ',
    topic: 'Functional Interfaces',
    title: 'Core java.util.function Types and Signatures',
    prompt: 'Which standard functional interface in `java.util.function` takes one argument of type T, produces no return value (void), and is typically used for side-effects?',
    options: [
      'Consumer<T>',
      'Function<T, R>',
      'Predicate<T>',
      'Supplier<T>'
    ],
    expectedAnswer: 'Consumer<T>',
    marks: 2,
    explanation: '`Consumer<T>` has the single abstract method `void accept(T t)`. `Function<T, R>` transforms T to R (`R apply(T t)`), `Predicate<T>` returns a boolean (`boolean test(T t)`), and `Supplier<T>` takes no arguments and returns T (`T get()`).',
    commonMistakes: 'Confusing Consumer<T> (takes input, returns void) with Supplier<T> (takes nothing, returns value).',
    takeaway: 'Functional interfaces provide standardized signatures that form the building blocks of Java Streams.'
  },
  {
    id: 39,
    stage: 'ADVANCED',
    stageIndex: 4,
    category: 'OUTPUT',
    topic: 'Streams API',
    title: 'Stream Lazy Evaluation and Intermediate Operations',
    prompt: 'What does this Stream pipeline print?',
    codeSnippet: `import java.util.stream.*;

public class StreamLazy {
    public static void main(String[] args) {
        Stream<String> stream = Stream.of("one", "two", "three", "four")
            .filter(e -> {
                System.out.print(e + " ");
                return e.length() > 3;
            });
        System.out.print("START ");
        stream.findFirst();
    }
}`,
    expectedOutput: 'START one two three',
    marks: 2,
    explanation: 'Streams in Java are strictly lazily evaluated. When the pipeline is defined with `.filter()`, zero elements are processed. "START " is printed first. When the terminal operation `findFirst()` is called, elements are pulled one by one: "one" (len 3 -> false), "two" (len 3 -> false), "three" (len 5 -> true). At "three", `findFirst()` satisfies its condition and short-circuits, never evaluating "four". Output: "START one two three".',
    commonMistakes: 'Expecting all elements to be filtered immediately upon pipeline definition.',
    takeaway: 'Intermediate stream operations do nothing until a terminal operation initiates pull-based evaluation.'
  },
  {
    id: 40,
    stage: 'ADVANCED',
    stageIndex: 5,
    category: 'OUTPUT',
    topic: 'Streams API',
    title: 'Collectors.groupingBy and Counting',
    prompt: 'What is printed by this reduction pipeline?',
    codeSnippet: `import java.util.*;
import java.util.stream.*;

public class StreamCollect {
    public static void main(String[] args) {
        List<String> items = Arrays.asList("a", "bb", "a", "ccc", "bb");
        Map<Integer, Long> map = items.stream()
            .collect(Collectors.groupingBy(String::length, Collectors.counting()));
        System.out.println(map.get(1) + " " + map.get(2) + " " + map.get(3));
    }
}`,
    expectedOutput: '2 2 1',
    marks: 2,
    explanation: 'Items of length 1: "a", "a" (count 2). Length 2: "bb", "bb" (count 2). Length 3: "ccc" (count 1). The groupingBy collector maps each string length to its frequency count. Printed output is "2 2 1".',
    commonMistakes: 'Thinking groupingBy counts distinct values rather than all elements in stream.',
    takeaway: '`Collectors.groupingBy` provides powerful map-reduce capabilities natively in Java.'
  },
  {
    id: 41,
    stage: 'ADVANCED',
    stageIndex: 6,
    category: 'MCQ',
    topic: 'Recursion and Backtracking',
    title: 'State Restoration in Backtracking Algorithms',
    prompt: 'In backtracking algorithms (such as N-Queens or Sudoku Solver), why is explicit "state restoration" (undoing the choice) essential after returning from a recursive step?',
    options: [
      'Because shared data structures persist mutations across sibling recursive branches, which would corrupt alternative paths',
      'To prevent the JVM from throwing an OutOfMemoryError on heap allocations',
      'Because Java automatically rolls back primitive values but not local arrays',
      'To reset the CPU instruction pointer to the base case'
    ],
    expectedAnswer: 'Because shared data structures persist mutations across sibling recursive branches, which would corrupt alternative paths',
    marks: 2,
    explanation: 'Backtracking algorithms explore search trees using shared mutable state (like a board matrix or boolean array). If a choice fails to yield a valid solution, that choice must be undone before exploring sibling branches to ensure each branch begins with a clean, valid state.',
    commonMistakes: 'Thinking each recursive stack frame automatically receives an isolated clone of the board.',
    takeaway: 'Backtracking is defined by the choose-explore-unchoose paradigm.'
  },
  {
    id: 42,
    stage: 'ADVANCED',
    stageIndex: 7,
    category: 'MCQ',
    topic: 'JVM and Memory Management',
    title: 'Java Memory Model: Heap vs Stack Allocation',
    prompt: 'In the HotSpot JVM, where are local primitive variables, object references, and the actual instantiated objects stored?',
    options: [
      'Local primitives and references are stored on the thread Stack; instantiated objects are stored in the shared Heap',
      'All variables and objects are stored entirely on the Stack',
      'All variables and objects are stored entirely in Metaspace',
      'Local primitives are on the Heap; objects are on the Stack'
    ],
    expectedAnswer: 'Local primitives and references are stored on the thread Stack; instantiated objects are stored in the shared Heap',
    marks: 2,
    explanation: 'Each Java thread has its own Stack holding call frames with local primitive variables and object memory references. The actual objects (and their instance fields) are dynamically allocated in the shared Garbage-Collected Heap.',
    commonMistakes: 'Believing objects created inside a method live on the stack (unless optimized via HotSpot Escape Analysis).',
    takeaway: 'Stack memory is private to each thread and automatically unwound; Heap memory is globally shared and managed by GC.'
  },
  {
    id: 43,
    stage: 'ADVANCED',
    stageIndex: 8,
    category: 'OUTPUT',
    topic: 'Multithreading',
    title: 'Thread Execution and join() Coordination',
    prompt: 'What is guaranteed to be printed by this thread join program?',
    codeSnippet: `public class ThreadJoin {
    static int value = 0;
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            value = 42;
        });
        t.start();
        t.join();
        System.out.println(value);
    }
}`,
    expectedOutput: '42',
    marks: 2,
    explanation: '`t.join()` causes the calling main thread to block until thread `t` terminates. Under the Java Memory Model, all actions in thread `t` happen-before any other thread successfully returns from `t.join()`. Therefore, `value = 42` is guaranteed to be visible to the main thread. Output is 42.',
    commonMistakes: 'Thinking a race condition exists even when join() is explicitly invoked.',
    takeaway: '`Thread.join()` establishes a deterministic happen-before memory visibility barrier.'
  },
  {
    id: 44,
    stage: 'ADVANCED',
    stageIndex: 9,
    category: 'MCQ',
    topic: 'Synchronization',
    title: 'Intrinsic Locks and Synchronized Methods',
    prompt: 'When a thread enters a synchronized non-static method `public synchronized void update()`, which intrinsic monitor lock does it acquire?',
    options: [
      'The intrinsic monitor lock of `this` instance',
      'The monitor lock of the Class object (e.g. MyClass.class)',
      'A global JVM-wide process lock',
      'The lock of the thread itself'
    ],
    expectedAnswer: 'The intrinsic monitor lock of `this` instance',
    marks: 2,
    explanation: 'A synchronized instance method acquires the monitor lock associated with `this` current object instance. Conversely, a `public static synchronized void update()` acquires the monitor lock of the `Class` object (`MyClass.class`).',
    commonMistakes: 'Confusing instance-level locking with static class-level locking.',
    takeaway: 'Synchronized instance methods guard against concurrent access to that specific instance only.'
  },
  {
    id: 45,
    stage: 'ADVANCED',
    stageIndex: 10,
    category: 'MCQ',
    topic: 'Multithreading',
    title: 'The volatile Keyword and Happen-Before Guarantee',
    prompt: 'What guarantee does the `volatile` modifier provide in the Java Memory Model?',
    options: [
      'Ensures memory visibility across threads and prevents instruction reordering, but does NOT guarantee atomicity of compound operations (like count++)',
      'Guarantees full atomic synchronization for all arithmetic operations',
      'Forces the variable to be allocated in thread-local CPU registers',
      'Protects against deadlocks in concurrent blocks'
    ],
    expectedAnswer: 'Ensures memory visibility across threads and prevents instruction reordering, but does NOT guarantee atomicity of compound operations (like count++)',
    marks: 2,
    explanation: '`volatile` guarantees that writes to the variable are immediately written to main memory and subsequent reads by other threads see the latest value (visibility + memory barriers preventing reordering). However, compound operations like `count++` (read-modify-write) are not atomic and still suffer from race conditions without `AtomicInteger` or `synchronized`.',
    commonMistakes: 'Believing volatile makes count++ thread-safe.',
    takeaway: 'Volatile provides visibility and memory ordering, but not mutual exclusion or composite atomicity.'
  },
  {
    id: 46,
    stage: 'ADVANCED',
    stageIndex: 11,
    category: 'OUTPUT',
    topic: 'Advanced Exception Handling',
    title: 'Suppressed Exceptions in Try-With-Resources',
    prompt: 'What does this program print regarding suppressed exceptions?',
    codeSnippet: `class FaultyResource implements AutoCloseable {
    public void doWork() {
        throw new RuntimeException("WorkError");
    }
    @Override
    public void close() {
        throw new RuntimeException("CloseError");
    }
}

public class SuppressTest {
    public static void main(String[] args) {
        try (FaultyResource r = new FaultyResource()) {
            r.doWork();
        } catch (Exception e) {
            System.out.println(e.getMessage() + " " + e.getSuppressed()[0].getMessage());
        }
    }
}`,
    expectedOutput: 'WorkError CloseError',
    marks: 2,
    explanation: 'In Java try-with-resources, if both the try block and `close()` throw exceptions, the primary exception thrown by `r.doWork()` ("WorkError") is preserved as the main exception. The secondary exception from `close()` ("CloseError") is attached as a suppressed exception accessible via `e.getSuppressed()`. Output: "WorkError CloseError".',
    commonMistakes: 'Thinking the exception in close() masks and overwrites the primary exception from try.',
    takeaway: 'Try-with-resources preserves the root causal exception while tracking secondary cleanup errors as suppressed.'
  },
  {
    id: 47,
    stage: 'ADVANCED',
    stageIndex: 12,
    category: 'MCQ',
    topic: 'Collections Framework in Depth',
    title: 'ConcurrentHashMap Concurrency Mechanism',
    prompt: 'How does `ConcurrentHashMap` achieve thread-safe high throughput in Java 8+ without synchronizing the entire map?',
    options: [
      'Lock-free read operations with volatile nodes, and synchronized locking only on the head node of individual hash buckets during writes',
      'Global read-write locks that freeze all writers during any read',
      'Copy-On-Write cloning of the entire internal array on every insertion',
      'Thread-local maps merged periodically in the background'
    ],
    expectedAnswer: 'Lock-free read operations with volatile nodes, and synchronized locking only on the head node of individual hash buckets during writes',
    marks: 2,
    explanation: 'Java 8+ ConcurrentHashMap utilizes Compare-And-Swap (CAS) instructions to initialize bins lock-free, and synchronizes only on the head node of the specific target bin when inserting or updating. Reads never acquire locks because node values and next pointers are `volatile`.',
    commonMistakes: 'Thinking ConcurrentHashMap locks the whole table or still uses Java 7\'s 16 fixed segments.',
    takeaway: 'Fine-grained bucket-level synchronization delivers massive concurrency without blocking unrelated entries.'
  },
  {
    id: 48,
    stage: 'ADVANCED',
    stageIndex: 13,
    category: 'CODING',
    topic: 'Problem Solving with Java',
    title: 'Group Anagrams by Sorted Key',
    prompt: 'Given an array of strings provided on standard input (first line N, followed by N space-separated lowercase words), group the anagrams together. For each group, print the words space-separated on their own line. Output the groups sorted in order of first appearance.',
    starterCode: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Map<String, List<String>> groups = new LinkedHashMap<>();

        for (int i = 0; i < n; i++) {
            String word = sc.next();
            char[] chars = word.toCharArray();
            Arrays.sort(chars);
            String sortedKey = new String(chars);

            groups.computeIfAbsent(sortedKey, k -> new ArrayList<>()).add(word);
        }

        for (List<String> group : groups.values()) {
            System.out.println(String.join(" ", group));
        }
    }
}`,
    testCases: [
      {
        id: 'tc1',
        input: '6\neat tea tan ate nat bat\n',
        expectedOutput: 'eat tea ate\ntan nat\nbat',
        isHidden: false,
        explanation: 'Three distinct anagram groups'
      },
      {
        id: 'tc2',
        input: '1\na\n',
        expectedOutput: 'a',
        isHidden: false,
        explanation: 'Single element'
      },
      {
        id: 'tc3',
        input: '4\nabc cba bca xyz\n',
        expectedOutput: 'abc cba bca\nxyz',
        isHidden: true,
        explanation: 'Two groups with 3 and 1 elements'
      }
    ],
    marks: 2,
    explanation: 'Sorting the characters of each string provides a canonical hash key. Using a `LinkedHashMap<String, List<String>>` preserves the insertion order of groups while adding elements in O(N * K log K) time.',
    commonMistakes: 'Using HashMap instead of LinkedHashMap, which would corrupt expected output group order.',
    takeaway: 'Canonical hashing and LinkedHashMap efficiently solve grouping problems with guaranteed iteration ordering.'
  },
  {
    id: 49,
    stage: 'ADVANCED',
    stageIndex: 14,
    category: 'CODING',
    topic: 'Problem Solving with Java',
    title: 'Merge Overlapping Intervals',
    prompt: 'Given an array of intervals where each interval has a start and end time (first line N, next N lines each contain "start end"), merge all overlapping intervals and print the resulting intervals, one per line.',
    starterCode: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) {
            intervals[i][0] = sc.nextInt();
            intervals[i][1] = sc.nextInt();
        }

        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        List<int[]> merged = new ArrayList<>();

        for (int[] interval : intervals) {
            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {
                merged.add(new int[]{interval[0], interval[1]});
            } else {
                int[] last = merged.get(merged.size() - 1);
                last[1] = Math.max(last[1], interval[1]);
            }
        }

        for (int[] interval : merged) {
            System.out.println(interval[0] + " " + interval[1]);
        }
    }
}`,
    testCases: [
      {
        id: 'tc1',
        input: '4\n1 3\n2 6\n8 10\n15 18\n',
        expectedOutput: '1 6\n8 10\n15 18',
        isHidden: false,
        explanation: '[1,3] and [2,6] overlap into [1,6]'
      },
      {
        id: 'tc2',
        input: '2\n1 4\n4 5\n',
        expectedOutput: '1 5',
        isHidden: false,
        explanation: 'Boundary overlap at 4 merges into [1,5]'
      },
      {
        id: 'tc3',
        input: '3\n6 8\n1 9\n2 4\n',
        expectedOutput: '1 9',
        isHidden: true,
        explanation: 'Unsorted input where [1,9] subsumes all other intervals'
      }
    ],
    marks: 2,
    explanation: 'First sort intervals by starting time `a[0]`. Then iterate through: if the current interval starts after the previous interval ends, append it as a new interval. Otherwise, merge by updating the end time to `Math.max(last[1], current[1])`.',
    commonMistakes: 'Forgetting to sort the intervals first by start time, which breaks the linear scan.',
    takeaway: 'Sorting by coordinate transforms multi-interval overlap problems into a single O(n) greedy sweep.'
  },
  {
    id: 50,
    stage: 'ADVANCED',
    stageIndex: 15,
    category: 'CODING',
    topic: 'Problem Solving with Java',
    title: 'Longest Substring Without Repeating Characters',
    prompt: 'Given a string on standard input, find and print the length of the longest substring without repeating characters. For example, "abcabcbb" has length 3 ("abc").',
    starterCode: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s = sc.nextLine().trim();
        if (s.isEmpty()) {
            System.out.println(0);
            return;
        }

        Map<Character, Integer> charIndexMap = new HashMap<>();
        int maxLength = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (charIndexMap.containsKey(c)) {
                left = Math.max(left, charIndexMap.get(c) + 1);
            }
            charIndexMap.put(c, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }

        System.out.println(maxLength);
    }
}`,
    testCases: [
      {
        id: 'tc1',
        input: 'abcabcbb\n',
        expectedOutput: '3',
        isHidden: false,
        explanation: 'Longest unique substring is "abc" with length 3'
      },
      {
        id: 'tc2',
        input: 'bbbbb\n',
        expectedOutput: '1',
        isHidden: false,
        explanation: 'Longest unique substring is "b" with length 1'
      },
      {
        id: 'tc3',
        input: 'pwwkew\n',
        expectedOutput: '3',
        isHidden: true,
        explanation: 'Longest unique substring is "wke" with length 3'
      }
    ],
    marks: 2,
    explanation: 'Using the sliding window technique with two pointers `left` and `right` and a HashMap mapping each character to its most recent index. When a duplicate is encountered, `left` skips past the prior occurrence using `Math.max(left, map.get(c) + 1)`. Total time is O(n).',
    commonMistakes: 'Resetting `left` backwards when an old duplicate outside the current window is found (must use Math.max).',
    takeaway: 'Sliding window with hash lookup provides optimal O(n) solutions for contiguous substring problems.'
  }
];

export function getSanitizedQuestion(q: Question): any {
  return {
    id: q.id,
    stage: q.stage,
    stageIndex: q.stageIndex,
    category: q.category,
    topic: q.topic,
    title: q.title,
    prompt: q.prompt,
    codeSnippet: q.codeSnippet,
    starterCode: q.starterCode,
    options: q.options,
    marks: q.marks,
    hints: q.hints,
    sampleTestCases: q.testCases
      ? q.testCases
          .filter((tc) => !tc.isHidden)
          .map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput }))
      : undefined,
  };
}

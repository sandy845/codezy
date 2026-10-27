import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Subjects data
const subjects = [
  {
    id: "python-fundamentals",
    name: "Python Fundamentals",
    description: "Core Python programming concepts including data types, control flow, functions, OOP, and file handling.",
    icon: "FileCode",
    color: "#4263EB",
    practicalIds: [
      "py-001", "py-002", "py-003", "py-004", "py-005",
      "py-006", "py-007", "py-008", "py-009", "py-010"
    ]
  },
  {
    "id": "data-structures",
    "name": "Data Structures",
    "description": "Implementation and analysis of fundamental data structures: stacks, queues, linked lists, trees, graphs, and heaps.",
    "icon": "GitBranch",
    "color": "#7C3AED",
    "practicalIds": [
      "ds-001", "ds-002", "ds-003", "ds-004", "ds-005",
      "ds-006", "ds-007", "ds-008", "ds-009", "ds-010"
    ]
  },
  {
    "id": "database-management",
    "name": "Database Management",
    "description": "Relational database design, DDL, DML, advanced SQL joins, subqueries, normalization, and stored procedures.",
    "icon": "Database",
    "color": "#059669",
    "practicalIds": [
      "dbms-001", "dbms-002", "dbms-003", "dbms-004", "dbms-005",
      "dbms-006", "dbms-007", "dbms-008", "dbms-009", "dbms-010"
    ]
  },
  {
    "id": "web-development",
    "name": "Web Development",
    "description": "Modern frontend and backend development: HTML5, CSS Grid/Flexbox, DOM, Async Fetch, Node.js, and Express REST APIs.",
    "icon": "Globe",
    "color": "#D97706",
    "practicalIds": [
      "web-001", "web-002", "web-003", "web-004", "web-005",
      "web-006", "web-007", "web-008", "web-009", "web-010"
    ]
  }
];

// Practicals data
const practicals = [
  // ================= Python Fundamentals =================
  {
    id: "py-001",
    subjectId: "python-fundamentals",
    number: 1,
    title: "Hello World and Basic I/O",
    objective: "Write a basic Python program to print messages and accept user input.",
    language: "python",
    code: `# Practical 1: Hello World and Basic I/O
# Demonstrates print() and input() functions

def main():
    print("Hello, World!")
    print("Welcome to Python Programming")

    name = input("Enter your name: ")
    age = int(input("Enter your age: "))

    print(f"\\nHello, {name}!")
    print(f"You are {age} years old.")
    print(f"In 10 years, you will be {age + 10} years old.")

if __name__ == "__main__":
    main()`,
    expectedOutput: `Hello, World!
Welcome to Python Programming
Enter your name: Alice
Enter your age: 20

Hello, Alice!
You are 20 years old.
In 10 years, you will be 30 years old.`,
    explanation: "This program demonstrates the use of print() to display output and input() to read user input. The int() function converts string input to an integer. f-strings (formatted string literals) provide readable and efficient string formatting.",
    keywords: ["hello world", "input", "output", "print", "f-string", "basic", "strings"]
  },
  {
    id: "py-002",
    subjectId: "python-fundamentals",
    number: 2,
    title: "Arithmetic Operations and Operators",
    objective: "Demonstrate arithmetic, comparison, and logical operators in Python.",
    language: "python",
    code: `# Practical 2: Arithmetic Operations and Operators

def arithmetic_demo(a, b):
    print(f"Values: a = {a}, b = {b}")
    print(f"Addition:       {a} + {b} = {a + b}")
    print(f"Subtraction:    {a} - {b} = {a - b}")
    print(f"Multiplication: {a} * {b} = {a * b}")
    print(f"Division:       {a} / {b} = {a / b:.2f}")
    print(f"Floor Division: {a} // {b} = {a // b}")
    print(f"Modulus:        {a} % {b} = {a % b}")
    print(f"Exponentiation: {a} ** {b} = {a ** b}")

def comparison_demo(a, b):
    print(f"\\nComparisons: a={a}, b={b}")
    print(f"a == b : {a == b}")
    print(f"a != b : {a != b}")
    print(f"a >  b : {a > b}")
    print(f"a <  b : {a < b}")
    print(f"a >= b : {a >= b}")
    print(f"a <= b : {a <= b}")

def main():
    arithmetic_demo(15, 4)
    comparison_demo(15, 4)

if __name__ == "__main__":
    main()`,
    expectedOutput: `Values: a = 15, b = 4
Addition:       15 + 4 = 19
Subtraction:    15 - 4 = 11
Multiplication: 15 * 4 = 60
Division:       15 / 4 = 3.75
Floor Division: 15 // 4 = 3
Modulus:        15 % 4 = 3
Exponentiation: 15 ** 4 = 50625

Comparisons: a=15, b=4
a == b : False
a != b : True
a >  b : True
a <  b : False
a >= b : True
a <= b : False`,
    explanation: "Python provides all standard arithmetic operators. The // operator performs integer (floor) division, % returns the remainder, and ** is exponentiation. Comparison operators return boolean values (True or False).",
    keywords: ["arithmetic", "operators", "math", "comparison", "boolean", "division", "modulus"]
  },
  {
    id: "py-003",
    subjectId: "python-fundamentals",
    number: 3,
    title: "Control Flow: if-elif-else",
    objective: "Use conditional statements to control program flow based on user input.",
    language: "python",
    code: `# Practical 3: Control Flow - if, elif, else

def grade_calculator(marks):
    """Return letter grade and remark based on marks."""
    if marks >= 90:
        grade = 'A+'
        remark = 'Outstanding'
    elif marks >= 80:
        grade = 'A'
        remark = 'Excellent'
    elif marks >= 70:
        grade = 'B'
        remark = 'Good'
    elif marks >= 60:
        grade = 'C'
        remark = 'Average'
    elif marks >= 40:
        grade = 'D'
        remark = 'Pass'
    else:
        grade = 'F'
        remark = 'Fail'
    return grade, remark

def check_number(n):
    """Check properties of a number."""
    if n > 0:
        print(f"{n} is positive")
    elif n < 0:
        print(f"{n} is negative")
    else:
        print(f"{n} is zero")

    if n % 2 == 0:
        print(f"{n} is even")
    else:
        print(f"{n} is odd")

def main():
    marks = 85
    grade, remark = grade_calculator(marks)
    print(f"Marks: {marks} -> Grade: {grade} ({remark})")

    check_number(-7)
    check_number(12)

if __name__ == "__main__":
    main()`,
    expectedOutput: `Marks: 85 -> Grade: A (Excellent)
-7 is negative
-7 is odd
12 is positive
12 is even`,
    explanation: "if-elif-else chains allow multi-way branching. Conditions are evaluated from top to bottom; the first true branch executes, and remaining branches are skipped.",
    keywords: ["if", "elif", "else", "conditional", "grade", "branching", "control flow"]
  },
  {
    id: "py-004",
    subjectId: "python-fundamentals",
    number: 4,
    title: "Loops: for and while",
    objective: "Demonstrate iteration using for loops and while loops in Python.",
    language: "python",
    code: `# Practical 4: Loops - for and while

def for_loop_examples():
    print("=== for loop examples ===")

    # Range-based iteration
    print("Squares from 1 to 5:")
    for i in range(1, 6):
        print(f"  {i}^2 = {i**2}")

    # Enumerate list
    fruits = ["apple", "banana", "cherry", "date"]
    print("\\nFruits list:")
    for idx, fruit in enumerate(fruits, start=1):
        print(f"  {idx}. {fruit.capitalize()}")

    # Nested loops
    print("\\nMultiplication Table (3x3):")
    for i in range(1, 4):
        for j in range(1, 4):
            print(f"{i*j:4}", end="")
        print()

def while_loop_examples():
    print("\\n=== while loop examples ===")
    count = 5
    print("Countdown:")
    while count > 0:
        print(f"  {count}...")
        count -= 1
    print("  Go!")

def main():
    for_loop_examples()
    while_loop_examples()

if __name__ == "__main__":
    main()`,
    expectedOutput: `=== for loop examples ===
Squares from 1 to 5:
  1^2 = 1
  2^2 = 4
  3^2 = 9
  4^2 = 16
  5^2 = 25

Fruits list:
  1. Apple
  2. Banana
  3. Cherry
  4. Date

Multiplication Table (3x3):
   1   2   3
   2   4   6
   3   6   9

=== while loop examples ===
Countdown:
  5...
  4...
  3...
  2...
  1...
  Go!`,
    explanation: "Python provides for loops for definite sequence iteration and while loops for condition-based iteration. range() generates number sequences, and enumerate() provides indexed iteration.",
    keywords: ["for", "while", "loop", "range", "enumerate", "iteration", "nested"]
  },
  {
    id: "py-005",
    subjectId: "python-fundamentals",
    number: 5,
    title: "Functions and Recursion",
    objective: "Define and use functions, including recursive algorithms in Python.",
    language: "python",
    code: `# Practical 5: Functions and Recursion

def factorial(n):
    """Compute n! recursively."""
    if n < 0:
        raise ValueError("Factorial undefined for negative numbers")
    if n in (0, 1):
        return 1
    return n * factorial(n - 1)

def fibonacci(n):
    """Return the nth Fibonacci number."""
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)

def is_palindrome(text):
    """Check if a string is a palindrome."""
    cleaned = "".join(ch.lower() for ch in text if ch.isalnum())
    return cleaned == cleaned[::-1]

def main():
    print("Factorials:")
    for n in range(6):
        print(f"  {n}! = {factorial(n)}")

    print("\\nFibonacci (first 7 terms):")
    print(" ", [fibonacci(i) for i in range(7)])

    print("\\nPalindrome tests:")
    for w in ["racecar", "hello", "A man a plan a canal Panama"]:
        print(f"  '{w}' -> {is_palindrome(w)}")

if __name__ == "__main__":
    main()`,
    expectedOutput: `Factorials:
  0! = 1
  1! = 1
  2! = 2
  3! = 6
  4! = 24
  5! = 120

Fibonacci (first 7 terms):
  [0, 1, 1, 2, 3, 5, 8]

Palindrome tests:
  'racecar' -> True
  'hello' -> False
  'A man a plan a canal Panama' -> True`,
    explanation: "Functions encapsulate reusable units of logic. Recursive functions call themselves with smaller inputs until reaching a base case. Slicing with [::-1] provides an idiomatic string reversal in Python.",
    keywords: ["function", "recursion", "factorial", "fibonacci", "palindrome", "base case"]
  },
  {
    id: "py-006",
    subjectId: "python-fundamentals",
    number: 6,
    title: "Lists, Tuples, and Sets",
    objective: "Demonstrate operations on Python list, tuple, and set collections.",
    language: "python",
    code: `# Practical 6: Lists, Tuples, and Sets

def list_demo():
    print("=== Lists ===")
    nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
    print(f"Original: {nums}")
    print(f"Sorted:   {sorted(nums)}")
    print(f"Unique:   {sorted(set(nums))}")

    # List comprehension
    squares = [x**2 for x in range(1, 8)]
    evens = [x for x in nums if x % 2 == 0]
    print(f"Squares:  {squares}")
    print(f"Evens:    {evens}")

def tuple_demo():
    print("\\n=== Tuples ===")
    point = (10, 20)
    x, y = point
    print(f"Point: {point}, unpacked: x={x}, y={y}")

def set_demo():
    print("\\n=== Sets ===")
    a = {1, 2, 3, 4, 5}
    b = {4, 5, 6, 7, 8}
    print(f"A = {a}, B = {b}")
    print(f"Union (A | B):        {a | b}")
    print(f"Intersection (A & B): {a & b}")
    print(f"Difference (A - B):   {a - b}")

def main():
    list_demo()
    tuple_demo()
    set_demo()

if __name__ == "__main__":
    main()`,
    expectedOutput: `=== Lists ===
Original: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
Sorted:   [1, 1, 2, 3, 3, 4, 5, 5, 6, 9]
Unique:   [1, 2, 3, 4, 5, 6, 9]
Squares:  [1, 4, 9, 16, 25, 36, 49]
Evens:    [4, 2, 6]

=== Tuples ===
Point: (10, 20), unpacked: x=10, y=20

=== Sets ===
A = {1, 2, 3, 4, 5}, B = {4, 5, 6, 7, 8}
Union (A | B):        {1, 2, 3, 4, 5, 6, 7, 8}
Intersection (A & B): {4, 5}
Difference (A - B):   {1, 2, 3}`,
    explanation: "Lists are mutable ordered sequences. Tuples are immutable and support tuple unpacking. Sets enforce uniqueness and support mathematical set operations like union, intersection, and difference.",
    keywords: ["list", "tuple", "set", "comprehension", "slice", "union", "intersection"]
  },
  {
    id: "py-007",
    subjectId: "python-fundamentals",
    number: 7,
    title: "Dictionaries and String Methods",
    objective: "Use Python dictionaries and demonstrate common string operations.",
    language: "python",
    code: `# Practical 7: Dictionaries and String Methods

def dict_demo():
    print("=== Dictionaries ===")
    student = {
        "name": "Alice",
        "age": 20,
        "marks": {"math": 92, "science": 88},
        "active": True
    }
    print(f"Name: {student['name']}")
    print(f"City: {student.get('city', 'Not Specified')}")

    for subject, score in student["marks"].items():
        print(f"  {subject.capitalize()}: {score}")

    # Dict comprehension
    lengths = {w: len(w) for w in ["python", "vue", "vite", "javascript"]}
    print(f"Word lengths: {lengths}")

def string_demo():
    print("\\n=== String Methods ===")
    text = "  Data Science and Machine Learning  "
    print(f"Stripped:    '{text.strip()}'")
    print(f"Uppercase:   '{text.strip().upper()}'")
    print(f"Replaced:    '{text.strip().replace('Data', 'AI')}'")
    print(f"Split:        {text.strip().split(' ')}")
    print(f"Joined:       {'-'.join(['code', 'vault', 'fast'])}")

def main():
    dict_demo()
    string_demo()

if __name__ == "__main__":
    main()`,
    expectedOutput: `=== Dictionaries ===
Name: Alice
City: Not Specified
  Math: 92
  Science: 88
Word lengths: {'python': 6, 'vue': 3, 'vite': 4, 'javascript': 10}

=== String Methods ===
Stripped:    'Data Science and Machine Learning'
Uppercase:   'DATA SCIENCE AND MACHINE LEARNING'
Replaced:    'AI Science and Machine Learning'
Split:        ['Data', 'Science', 'and', 'Machine', 'Learning']
Joined:       code-vault-fast`,
    explanation: "Dictionaries store key-value pairs with O(1) average lookup. The get() method provides safe defaults for missing keys. String methods (strip, upper, replace, split, join) manipulate text immutably.",
    keywords: ["dictionary", "dict", "string", "strip", "split", "join", "lookup"]
  },
  {
    id: "py-008",
    subjectId: "python-fundamentals",
    number: 8,
    title: "File Handling: Read and Write",
    objective: "Read from and write to text files using Python context managers.",
    language: "python",
    code: `# Practical 8: File Handling
import os

def write_demo(filename, lines):
    with open(filename, "w", encoding="utf-8") as f:
        for line in lines:
            f.write(line + "\\n")
    print(f"Wrote {len(lines)} lines to '{filename}'.")

def read_demo(filename):
    if not os.path.exists(filename):
        print(f"Error: '{filename}' not found.")
        return
    with open(filename, "r", encoding="utf-8") as f:
        lines = f.readlines()
    print(f"Reading '{filename}':")
    for i, line in enumerate(lines, 1):
        print(f"  {i}: {line.rstrip()}")

def main():
    filename = "demo_pracvault.txt"
    sample_data = [
        "PracVault - Your Practicals. One Vault. Zero Hassle.",
        "Python file handling with the 'with' statement.",
        "Automatic resource cleanup guaranteed."
    ]
    write_demo(filename, sample_data)
    read_demo(filename)

    # Cleanup demo file
    if os.path.exists(filename):
        os.remove(filename)
        print(f"Cleaned up temporary file '{filename}'.")

if __name__ == "__main__":
    main()`,
    expectedOutput: `Wrote 3 lines to 'demo_pracvault.txt'.
Reading 'demo_pracvault.txt':
  1: PracVault - Your Practicals. One Vault. Zero Hassle.
  2: Python file handling with the 'with' statement.
  3: Automatic resource cleanup guaranteed.
Cleaned up temporary file 'demo_pracvault.txt'.`,
    explanation: "The 'with' statement acts as a context manager that ensures files are properly closed even if exceptions occur. Always specify encoding='utf-8' for reliable cross-platform text processing.",
    keywords: ["file", "read", "write", "open", "with", "context manager", "cleanup"]
  },
  {
    id: "py-009",
    subjectId: "python-fundamentals",
    number: 9,
    title: "Exception Handling",
    objective: "Handle runtime errors gracefully using try-except-finally in Python.",
    language: "python",
    code: `# Practical 9: Exception Handling

def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("  Error: Cannot divide by zero.")
        return None
    except TypeError as e:
        print(f"  TypeError: {e}")
        return None
    finally:
        print("  (division attempt completed)")

def parse_integer(val):
    try:
        return int(val)
    except (ValueError, TypeError):
        return -1

def main():
    print("Testing safe division:")
    print("10 / 2 =", safe_divide(10, 2))
    print("10 / 0 =", safe_divide(10, 0))

    print("\\nTesting integer parsing:")
    print("'42'  ->", parse_integer("42"))
    print("'abc' ->", parse_integer("abc"))

if __name__ == "__main__":
    main()`,
    expectedOutput: `Testing safe division:
  (division attempt completed)
10 / 2 = 5.0
  Error: Cannot divide by zero.
  (division attempt completed)
10 / 0 = None

Testing integer parsing:
'42'  -> 42
'abc' -> -1`,
    explanation: "try-except blocks intercept errors, preventing program crashes. Multiple exceptions can be caught individually or in tuples. The finally block always executes regardless of whether an exception occurred.",
    keywords: ["exception", "try", "except", "finally", "ZeroDivisionError", "error handling"]
  },
  {
    id: "py-010",
    subjectId: "python-fundamentals",
    number: 10,
    title: "Object-Oriented Programming: Classes",
    objective: "Implement classes with attributes, methods, inheritance, and encapsulation in Python.",
    language: "python",
    code: `# Practical 10: Object-Oriented Programming

class BankAccount:
    """Demonstrates encapsulation with private attributes."""
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive.")
        self._balance += amount
        return f"Deposited ₹{amount:.2f}. Balance: ₹{self._balance:.2f}"

    def withdraw(self, amount):
        if amount <= 0 or amount > self._balance:
            raise ValueError("Invalid withdrawal amount.")
        self._balance -= amount
        return f"Withdrew ₹{amount:.2f}. Balance: ₹{self._balance:.2f}"

    def __str__(self):
        return f"Account({self.owner}: ₹{self._balance:.2f})"

class SavingsAccount(BankAccount):
    """Subclass adding interest calculation."""
    def __init__(self, owner, balance=0.0, interest_rate=0.04):
        super().__init__(owner, balance)
        self.interest_rate = interest_rate

    def apply_interest(self):
        interest = self._balance * self.interest_rate
        self.deposit(interest)
        return f"Added ₹{interest:.2f} interest."

def main():
    acc = SavingsAccount("Alice", 1000.0)
    print("Initial:", acc)
    print(acc.deposit(500))
    print(acc.withdraw(200))
    print(acc.apply_interest())
    print("Final:", acc)

if __name__ == "__main__":
    main()`,
    expectedOutput: `Initial: Account(Alice: ₹1000.00)
Deposited ₹500.00. Balance: ₹1500.00
Withdrew ₹200.00. Balance: ₹1300.00
Deposited ₹52.00. Balance: ₹1352.00
Added ₹52.00 interest.
Final: Account(Alice: ₹1352.00)`,
    explanation: "OOP principles: Encapsulation hides internal state behind properties. Inheritance allows subclasses to reuse and extend parent functionality using super().",
    keywords: ["OOP", "class", "inheritance", "encapsulation", "property", "super"]
  },

  // ================= Data Structures =================
  {
    id: "ds-001",
    subjectId: "data-structures",
    number: 1,
    title: "Array Operations",
    objective: "Implement basic array operations: traversal, insertion, deletion, and linear search.",
    language: "python",
    code: `# Practical 1: Array Operations

class Array:
    def __init__(self, capacity=10):
        self.data = []
        self.capacity = capacity

    def insert(self, value, index=None):
        if len(self.data) >= self.capacity:
            raise OverflowError("Array full")
        if index is None:
            self.data.append(value)
        else:
            self.data.insert(index, value)

    def delete(self, value):
        if value in self.data:
            self.data.remove(value)
            return True
        return False

    def search(self, value):
        for i, v in enumerate(self.data):
            if v == value:
                return i
        return -1

    def __str__(self):
        return str(self.data)

def main():
    arr = Array(capacity=8)
    for val in [10, 20, 30, 40, 50]:
        arr.insert(val)
    print("Initial array:", arr)

    arr.insert(25, index=2)
    print("After inserting 25 at index 2:", arr)

    print("Search 30: index", arr.search(30))
    print("Search 99: index", arr.search(99))

    arr.delete(20)
    print("After deleting 20:", arr)

if __name__ == "__main__":
    main()`,
    expectedOutput: `Initial array: [10, 20, 30, 40, 50]
After inserting 25 at index 2: [10, 20, 25, 30, 40, 50]
Search 30: index 3
Search 99: index -1
After deleting 20: [10, 25, 30, 40, 50]`,
    explanation: "Arrays store elements in contiguous memory. Random access is O(1), but insertion and deletion at arbitrary positions require element shifting, taking O(n) time.",
    keywords: ["array", "insertion", "deletion", "linear search", "traversal"]
  },
  {
    id: "ds-002",
    subjectId: "data-structures",
    number: 2,
    title: "Stack: Push, Pop, Peek",
    objective: "Implement a Stack data structure and demonstrate LIFO operations and balanced brackets check.",
    language: "python",
    code: `# Practical 2: Stack - Push, Pop, Peek

class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("peek at empty stack")
        return self._items[-1]

    def is_empty(self):
        return len(self._items) == 0

    def size(self):
        return len(self._items)

def is_balanced(expression):
    stack = Stack()
    brackets = {')': '(', '}': '{', ']': '['}
    for char in expression:
        if char in "({[":
            stack.push(char)
        elif char in ")}]":
            if stack.is_empty() or stack.pop() != brackets[char]:
                return False
    return stack.is_empty()

def main():
    s = Stack()
    for v in [10, 20, 30]:
        s.push(v)
    print("Top element:", s.peek())
    print("Popped:", s.pop())
    print("Size:", s.size())

    print("\\nBracket checks:")
    for expr in ["{[()]}", "{[(])}", "((())"]:
        print(f"  '{expr}' -> {is_balanced(expr)}")

if __name__ == "__main__":
    main()`,
    expectedOutput: `Top element: 30
Popped: 30
Size: 2

Bracket checks:
  '{[()]}' -> True
  '{[(])}' -> False
  '((())' -> False`,
    explanation: "Stacks follow Last-In-First-Out (LIFO). All push, pop, and peek operations take O(1) time. Stacks are essential in parsing, syntax validation, undo operations, and call stacks.",
    keywords: ["stack", "LIFO", "push", "pop", "peek", "balanced brackets"]
  },
  {
    id: "ds-003",
    subjectId: "data-structures",
    number: 3,
    title: "Queue: Enqueue and Dequeue",
    objective: "Implement a Queue data structure and demonstrate FIFO operations.",
    language: "python",
    code: `# Practical 3: Queue - Enqueue and Dequeue
from collections import deque

class Queue:
    def __init__(self):
        self._data = deque()

    def enqueue(self, item):
        self._data.append(item)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("dequeue from empty queue")
        return self._data.popleft()

    def front(self):
        if self.is_empty():
            raise IndexError("queue is empty")
        return self._data[0]

    def is_empty(self):
        return len(self._data) == 0

    def size(self):
        return len(self._data)

def main():
    q = Queue()
    for task in ["Task 1", "Task 2", "Task 3"]:
        q.enqueue(task)
        print(f"Enqueued: {task}")

    print(f"\\nFront element: {q.front()}")
    print("Dequeuing tasks:")
    while not q.is_empty():
        print(f"  Processing: {q.dequeue()}")

if __name__ == "__main__":
    main()`,
    expectedOutput: `Enqueued: Task 1
Enqueued: Task 2
Enqueued: Task 3

Front element: Task 1
Dequeuing tasks:
  Processing: Task 1
  Processing: Task 2
  Processing: Task 3`,
    explanation: "Queues operate on First-In-First-Out (FIFO). Using collections.deque provides O(1) time complexity for both enqueue (append) and dequeue (popleft).",
    keywords: ["queue", "FIFO", "enqueue", "dequeue", "deque", "collections"]
  },
  {
    id: "ds-004",
    subjectId: "data-structures",
    number: 4,
    title: "Singly Linked List",
    objective: "Implement a singly linked list with insertion, deletion, and reversal.",
    language: "python",
    code: `# Practical 4: Singly Linked List

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def insert_at_tail(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = new_node

    def reverse(self):
        prev = None
        curr = self.head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        self.head = prev

    def to_list(self):
        res = []
        curr = self.head
        while curr:
            res.append(curr.data)
            curr = curr.next
        return res

def main():
    ll = LinkedList()
    for val in [10, 20, 30, 40]:
        ll.insert_at_tail(val)
    print("Original list:", ll.to_list())

    ll.insert_at_head(5)
    print("After head insert 5:", ll.to_list())

    ll.reverse()
    print("After reversal:", ll.to_list())

if __name__ == "__main__":
    main()`,
    expectedOutput: `Original list: [10, 20, 30, 40]
After head insert 5: [5, 10, 20, 30, 40]
After reversal: [40, 30, 20, 10, 5]`,
    explanation: "A Linked List links nodes via pointers. Insertion at the head is O(1). In-place reversal takes O(n) time and O(1) space using three pointers (prev, curr, next_node).",
    keywords: ["linked list", "node", "head", "tail", "reverse", "pointers"]
  },
  {
    id: "ds-005",
    subjectId: "data-structures",
    number: 5,
    title: "Binary Search Tree",
    objective: "Implement a BST with insertion, search, and inorder traversal.",
    language: "python",
    code: `# Practical 5: Binary Search Tree (BST)

class BSTNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, key):
        self.root = self._insert(self.root, key)

    def _insert(self, node, key):
        if not node:
            return BSTNode(key)
        if key < node.key:
            node.left = self._insert(node.left, key)
        elif key > node.key:
            node.right = self._insert(node.right, key)
        return node

    def search(self, key):
        curr = self.root
        while curr:
            if curr.key == key:
                return True
            curr = curr.left if key < curr.key else curr.right
        return False

    def inorder(self):
        res = []
        def _inorder(node):
            if node:
                _inorder(node.left)
                res.append(node.key)
                _inorder(node.right)
        _inorder(self.root)
        return res

def main():
    bst = BST()
    for v in [50, 30, 70, 20, 40, 60, 80]:
        bst.insert(v)

    print("Inorder traversal (sorted):", bst.inorder())
    print("Search 40:", bst.search(40))
    print("Search 99:", bst.search(99))

if __name__ == "__main__":
    main()`,
    expectedOutput: `Inorder traversal (sorted): [20, 30, 40, 50, 60, 70, 80]
Search 40: True
Search 99: False`,
    explanation: "BST keeps left children smaller and right children larger than the parent. Inorder traversal (Left-Root-Right) yields elements in sorted order. Search and insert are O(log n) on balanced trees.",
    keywords: ["BST", "binary search tree", "inorder", "traversal", "search", "tree"]
  },
  {
    id: "ds-006",
    subjectId: "data-structures",
    number: 6,
    title: "Sorting Algorithms",
    objective: "Implement and compare Bubble Sort, Selection Sort, and Insertion Sort.",
    language: "python",
    code: `# Practical 6: Sorting Algorithms

def bubble_sort(arr):
    a = arr.copy()
    n = len(a)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
    return a

def selection_sort(arr):
    a = arr.copy()
    n = len(a)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if a[j] < a[min_idx]:
                min_idx = j
        a[i], a[min_idx] = a[min_idx], a[i]
    return a

def insertion_sort(arr):
    a = arr.copy()
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a

def main():
    data = [64, 34, 25, 12, 22, 11, 90]
    print("Original:       ", data)
    print("Bubble Sort:    ", bubble_sort(data))
    print("Selection Sort: ", selection_sort(data))
    print("Insertion Sort: ", insertion_sort(data))

if __name__ == "__main__":
    main()`,
    expectedOutput: `Original:        [64, 34, 25, 12, 22, 11, 90]
Bubble Sort:     [11, 12, 22, 25, 34, 64, 90]
Selection Sort:  [11, 12, 22, 25, 34, 64, 90]
Insertion Sort:  [11, 12, 22, 25, 34, 64, 90]`,
    explanation: "Bubble, selection, and insertion sort have O(n^2) worst-case time complexity. Insertion sort excels on nearly-sorted data with O(n) best-case performance.",
    keywords: ["bubble sort", "selection sort", "insertion sort", "sorting", "algorithm"]
  },
  {
    id: "ds-007",
    subjectId: "data-structures",
    number: 7,
    title: "Hashing and Hash Tables",
    objective: "Implement a hash table with chaining to handle collisions.",
    language: "python",
    code: `# Practical 7: Hash Table with Chaining

class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return hash(key) % self.size

    def put(self, key, value):
        idx = self._hash(key)
        for i, (k, v) in enumerate(self.table[idx]):
            if k == key:
                self.table[idx][i] = (key, value)
                return
        self.table[idx].append((key, value))

    def get(self, key, default=None):
        idx = self._hash(key)
        for k, v in self.table[idx]:
            if k == key:
                return v
        return default

def main():
    ht = HashTable(size=7)
    ht.put("apple", 1.50)
    ht.put("banana", 0.75)
    ht.put("cherry", 2.25)

    print("apple  ->", ht.get("apple"))
    print("banana ->", ht.get("banana"))
    print("orange ->", ht.get("orange", "Not found"))

if __name__ == "__main__":
    main()`,
    expectedOutput: `apple  -> 1.5
banana -> 0.75
orange -> Not found`,
    explanation: "Hash tables provide average O(1) insert, update, and lookup. Collisions are handled via separate chaining (buckets storing key-value pairs).",
    keywords: ["hash table", "hashing", "collision", "chaining", "O(1)"]
  },
  {
    id: "ds-008",
    subjectId: "data-structures",
    number: 8,
    title: "Graph: BFS and DFS Traversal",
    objective: "Represent a graph using adjacency lists and implement BFS and DFS.",
    language: "python",
    code: `# Practical 8: Graph - BFS and DFS
from collections import deque

class Graph:
    def __init__(self):
        self.adj = {}

    def add_edge(self, u, v):
        self.adj.setdefault(u, []).append(v)
        self.adj.setdefault(v, []).append(u)

    def bfs(self, start):
        visited = {start}
        order = []
        q = deque([start])
        while q:
            node = q.popleft()
            order.append(node)
            for neighbor in self.adj.get(node, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    q.append(neighbor)
        return order

    def dfs(self, start):
        visited = set()
        order = []
        def _dfs(node):
            visited.add(node)
            order.append(node)
            for neighbor in self.adj.get(node, []):
                if neighbor not in visited:
                    _dfs(neighbor)
        _dfs(start)
        return order

def main():
    g = Graph()
    edges = [(1, 2), (1, 3), (2, 4), (2, 5), (3, 6)]
    for u, v in edges:
        g.add_edge(u, v)

    print("BFS from 1:", g.bfs(1))
    print("DFS from 1:", g.dfs(1))

if __name__ == "__main__":
    main()`,
    expectedOutput: `BFS from 1: [1, 2, 3, 4, 5, 6]
DFS from 1: [1, 2, 4, 5, 3, 6]`,
    explanation: "BFS explores neighbors level-by-level using a queue (finding the shortest path in unweighted graphs). DFS explores branch paths deeply using recursion or a stack.",
    keywords: ["graph", "BFS", "DFS", "breadth first", "depth first", "traversal"]
  },
  {
    id: "ds-009",
    subjectId: "data-structures",
    number: 9,
    title: "Merge Sort and Quick Sort",
    objective: "Implement and compare divide-and-conquer sorting algorithms.",
    language: "python",
    code: `# Practical 9: Merge Sort and Quick Sort

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

def main():
    arr = [38, 27, 43, 3, 9, 82, 10]
    print("Input:     ", arr)
    print("Merge Sort:", merge_sort(arr))
    print("Quick Sort:", quick_sort(arr))

if __name__ == "__main__":
    main()`,
    expectedOutput: `Input:      [38, 27, 43, 3, 9, 82, 10]
Merge Sort: [3, 9, 10, 27, 38, 43, 82]
Quick Sort: [3, 9, 10, 27, 38, 43, 82]`,
    explanation: "Both algorithms use divide-and-conquer. Merge Sort guarantees O(n log n) with O(n) space. Quick Sort achieves O(n log n) average performance with in-place partitioning.",
    keywords: ["merge sort", "quick sort", "divide and conquer", "O(n log n)", "sorting"]
  },
  {
    id: "ds-010",
    subjectId: "data-structures",
    number: 10,
    title: "Heap and Priority Queue",
    objective: "Implement a Min-Heap and Priority Queue using heapq.",
    language: "python",
    code: `# Practical 10: Heap and Priority Queue
import heapq

class PriorityQueue:
    def __init__(self):
        self._queue = []
        self._index = 0

    def push(self, item, priority):
        heapq.heappush(self._queue, (priority, self._index, item))
        self._index += 1

    def pop(self):
        return heapq.heappop(self._queue)[-1]

    def is_empty(self):
        return len(self._queue) == 0

def main():
    pq = PriorityQueue()
    pq.push("Bug Fix", 3)
    pq.push("Critical Outage", 1)
    pq.push("Code Review", 2)

    print("Serving tasks in priority order:")
    while not pq.is_empty():
        print("  Processed:", pq.pop())

if __name__ == "__main__":
    main()`,
    expectedOutput: `Serving tasks in priority order:
  Processed: Critical Outage
  Processed: Code Review
  Processed: Bug Fix`,
    explanation: "Min-heaps maintain the smallest element at the root. Insertion and removal of the minimum are O(log n), making them ideal for priority queue scheduling.",
    keywords: ["heap", "min-heap", "priority queue", "heapq", "O(log n)"]
  },

  // ================= Database Management =================
  {
    id: "dbms-001",
    subjectId: "database-management",
    number: 1,
    title: "CREATE TABLE and Basic DDL",
    objective: "Demonstrate DDL commands: CREATE, ALTER, DROP, TRUNCATE in SQL.",
    language: "sql",
    code: `-- Practical 1: DDL Commands
CREATE TABLE Students (
    student_id      INT PRIMARY KEY AUTO_INCREMENT,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    gpa             DECIMAL(3, 2) CHECK (gpa BETWEEN 0.00 AND 10.00)
);

CREATE TABLE Courses (
    course_id   INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(10) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    credits     INT NOT NULL CHECK (credits > 0)
);

-- Alter table to add phone column
ALTER TABLE Students ADD COLUMN phone VARCHAR(20);

-- Describe table
DESCRIBE Students;`,
    expectedOutput: `Query OK, 0 rows affected
Query OK, 0 rows affected
Query OK, 0 rows affected
+-----------------+--------------+------+-----+---------+----------------+
| Field           | Type         | Null | Key | Default | Extra          |
+-----------------+--------------+------+-----+---------+----------------+
| student_id      | int          | NO   | PRI | NULL    | auto_increment |
| first_name      | varchar(50)  | NO   |     | NULL    |                |
| last_name       | varchar(50)  | NO   |     | NULL    |                |
| email           | varchar(100) | NO   | UNI | NULL    |                |
| enrollment_date | date         | YES  |     | curdate |                |
| gpa             | decimal(3,2) | YES  |     | NULL    |                |
| phone           | varchar(20)  | YES  |     | NULL    |                |
+-----------------+--------------+------+-----+---------+----------------+`,
    explanation: "DDL statements define schema structures. PRIMARY KEY uniquely identifies rows, UNIQUE prevents duplicates, and CHECK enforces data validity rules.",
    keywords: ["DDL", "CREATE TABLE", "ALTER TABLE", "PRIMARY KEY", "CHECK", "schema"]
  },
  {
    id: "dbms-002",
    subjectId: "database-management",
    number: 2,
    title: "INSERT, UPDATE, DELETE (DML)",
    objective: "Demonstrate DML commands to manipulate data in relational tables.",
    language: "sql",
    code: `-- Practical 2: DML Commands
INSERT INTO Students (first_name, last_name, email, gpa) VALUES
('Alice', 'Johnson', 'alice@uni.edu', 8.9),
('Bob', 'Smith', 'bob@uni.edu', 7.5),
('Carol', 'White', 'carol@uni.edu', 9.2);

-- Update Alice's GPA
UPDATE Students
SET gpa = 9.1
WHERE email = 'alice@uni.edu';

-- Delete student record
DELETE FROM Students
WHERE email = 'bob@uni.edu';

-- Verify remaining records
SELECT * FROM Students ORDER BY student_id;`,
    expectedOutput: `Query OK, 3 rows affected
Query OK, 1 row affected
Query OK, 1 row affected
+------------+------------+-----------+---------------+-----------------+------+
| student_id | first_name | last_name | email         | enrollment_date | gpa  |
+------------+------------+-----------+---------------+-----------------+------+
|          1 | Alice      | Johnson   | alice@uni.edu | 2026-10-27      | 9.10 |
|          3 | Carol      | White     | carol@uni.edu | 2026-10-27      | 9.20 |
+------------+------------+-----------+---------------+-----------------+------+`,
    explanation: "DML manages rows inside tables. Always use a WHERE clause with UPDATE and DELETE to prevent accidental table-wide modifications.",
    keywords: ["DML", "INSERT", "UPDATE", "DELETE", "WHERE", "SELECT"]
  },
  {
    id: "dbms-003",
    subjectId: "database-management",
    number: 3,
    title: "SELECT Queries and Filtering",
    objective: "Write SELECT queries with WHERE, ORDER BY, LIMIT, and aggregate functions.",
    language: "sql",
    code: `-- Practical 3: Filtering and Aggregations
SELECT
    first_name,
    last_name,
    gpa
FROM Students
WHERE gpa >= 8.0
ORDER BY gpa DESC
LIMIT 5;

-- Aggregate statistics
SELECT
    COUNT(*)      AS total_students,
    AVG(gpa)      AS average_gpa,
    MAX(gpa)      AS highest_gpa,
    MIN(gpa)      AS lowest_gpa
FROM Students;`,
    expectedOutput: `+------------+-----------+------+
| first_name | last_name | gpa  |
+------------+-----------+------+
| Carol      | White     | 9.20 |
| Alice      | Johnson   | 9.10 |
+------------+-----------+------+

+----------------+-------------+-------------+------------+
| total_students | average_gpa | highest_gpa | lowest_gpa |
+----------------+-------------+-------------+------------+
|              2 |    9.150000 |        9.20 |       9.10 |
+----------------+-------------+-------------+------------+`,
    explanation: "SELECT statements retrieve specific columns. Aggregate functions (COUNT, AVG, MIN, MAX) compute summary metrics across matching rows.",
    keywords: ["SELECT", "WHERE", "ORDER BY", "LIMIT", "COUNT", "AVG", "aggregates"]
  },
  {
    id: "dbms-004",
    subjectId: "database-management",
    number: 4,
    title: "JOINs: INNER, LEFT, RIGHT",
    objective: "Combine data from multiple tables using INNER and LEFT JOINs.",
    language: "sql",
    code: `-- Practical 4: SQL JOINs
SELECT
    s.student_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    c.course_name,
    e.grade
FROM Students s
INNER JOIN Enrollments e ON s.student_id = e.student_id
INNER JOIN Courses c     ON e.course_id = c.course_id
ORDER BY s.student_id;`,
    expectedOutput: `+------------+---------------+----------------------+-------+
| student_id | student_name  | course_name          | grade |
+------------+---------------+----------------------+-------+
|          1 | Alice Johnson | Python Programming   | A     |
|          1 | Alice Johnson | Database Management  | A+    |
|          3 | Carol White   | Data Structures      | A     |
+------------+---------------+----------------------+-------+`,
    explanation: "INNER JOIN selects records that have matching values in both tables. Multi-table joins connect relationships via primary and foreign key constraints.",
    keywords: ["JOIN", "INNER JOIN", "foreign key", "relational", "multi-table"]
  },
  {
    id: "dbms-005",
    subjectId: "database-management",
    number: 5,
    title: "Subqueries and Nested SELECT",
    objective: "Use subqueries in WHERE and SELECT clauses.",
    language: "sql",
    code: `-- Practical 5: Subqueries
-- Find students with GPA higher than the average
SELECT
    first_name,
    last_name,
    gpa
FROM Students
WHERE gpa > (
    SELECT AVG(gpa) FROM Students
);`,
    expectedOutput: `+------------+-----------+------+
| first_name | last_name | gpa  |
+------------+-----------+------+
| Carol      | White     | 9.20 |
+------------+-----------+------+`,
    explanation: "A subquery is a query nested inside another statement. Scalar subqueries return a single value used for dynamic comparison filtering.",
    keywords: ["subquery", "nested query", "WHERE", "scalar subquery", "AVG"]
  },
  {
    id: "dbms-006",
    subjectId: "database-management",
    number: 6,
    title: "Stored Procedures and Functions",
    objective: "Create and invoke stored procedures in SQL.",
    language: "sql",
    code: `-- Practical 6: Stored Procedure
DELIMITER //
CREATE PROCEDURE GetTopStudents(IN min_gpa DECIMAL(3, 2))
BEGIN
    SELECT student_id, first_name, last_name, gpa
    FROM Students
    WHERE gpa >= min_gpa
    ORDER BY gpa DESC;
END //
DELIMITER ;

-- Call procedure
CALL GetTopStudents(9.00);`,
    expectedOutput: `+------------+------------+-----------+------+
| student_id | first_name | last_name | gpa  |
+------------+------------+-----------+------+
|          3 | Carol      | White     | 9.20 |
|          1 | Alice      | Johnson   | 9.10 |
+------------+------------+-----------+------+`,
    explanation: "Stored procedures encapsulate reusable database logic, reducing network round-trips and enforcing consistent query execution.",
    keywords: ["stored procedure", "DELIMITER", "CALL", "procedure", "parameter"]
  },
  {
    id: "dbms-007",
    subjectId: "database-management",
    number: 7,
    title: "Transactions: COMMIT and ROLLBACK",
    objective: "Demonstrate ACID transactions with BEGIN, COMMIT, and ROLLBACK.",
    language: "sql",
    code: `-- Practical 7: Transactions
START TRANSACTION;

UPDATE Accounts SET balance = balance - 500 WHERE id = 1;
UPDATE Accounts SET balance = balance + 500 WHERE id = 2;

-- If checks pass, commit:
COMMIT;

-- In case of failure:
-- ROLLBACK;`,
    expectedOutput: `Query OK, 0 rows affected
Query OK, 1 row affected
Query OK, 1 row affected
Query OK, 0 rows affected (committed)`,
    explanation: "Transactions enforce Atomicity, Consistency, Isolation, and Durability (ACID). Either all modifications succeed (COMMIT) or all are reverted (ROLLBACK).",
    keywords: ["transaction", "ACID", "COMMIT", "ROLLBACK", "atomicity"]
  },
  {
    id: "dbms-008",
    subjectId: "database-management",
    number: 8,
    title: "Indexes and Query Optimization",
    objective: "Create indexes and analyze execution plans using EXPLAIN.",
    language: "sql",
    code: `-- Practical 8: Indexes
CREATE INDEX idx_student_email ON Students(email);

-- Query plan analysis
EXPLAIN SELECT * FROM Students WHERE email = 'alice@uni.edu';`,
    expectedOutput: `+----+-------------+----------+------------+-------+-------------------+
| id | select_type | table    | type       | key   | idx_student_email |
+----+-------------+----------+------------+-------+-------------------+
|  1 | SIMPLE      | Students | const/ref  | key   | idx_student_email |
+----+-------------+----------+------------+-------+-------------------+`,
    explanation: "B-Tree indexes speed up row lookup from O(n) table scans to O(log n) index searches. EXPLAIN reveals whether an index is effectively utilized.",
    keywords: ["index", "EXPLAIN", "query optimization", "performance", "B-tree"]
  },
  {
    id: "dbms-009",
    subjectId: "database-management",
    number: 9,
    title: "Triggers",
    objective: "Create an audit logging trigger that executes on table updates.",
    language: "sql",
    code: `-- Practical 9: Triggers
CREATE TABLE StudentAudit (
    audit_id   INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    old_gpa    DECIMAL(3, 2),
    new_gpa    DECIMAL(3, 2),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER trg_after_gpa_update
AFTER UPDATE ON Students
FOR EACH ROW
BEGIN
    IF OLD.gpa != NEW.gpa THEN
        INSERT INTO StudentAudit (student_id, old_gpa, new_gpa)
        VALUES (OLD.student_id, OLD.gpa, NEW.gpa);
    END IF;
END //
DELIMITER ;`,
    expectedOutput: `Query OK, 0 rows affected
Query OK, 0 rows affected (trigger created)`,
    explanation: "Triggers execute automatically in response to DML events (INSERT, UPDATE, DELETE). They maintain audit trails and enforce integrity constraints.",
    keywords: ["trigger", "audit", "AFTER UPDATE", "OLD", "NEW", "automation"]
  },
  {
    id: "dbms-010",
    subjectId: "database-management",
    number: 10,
    title: "Normalization: 1NF, 2NF, 3NF",
    objective: "Apply relational normalization to eliminate redundancy.",
    language: "sql",
    code: `-- Practical 10: Normalization to 3NF
-- 1NF: Atomic values
-- 2NF: No partial dependency on composite key
-- 3NF: No transitive dependencies

CREATE TABLE Departments (
    dept_id   INT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL
);

CREATE TABLE Professors (
    prof_id INT PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);`,
    expectedOutput: `Query OK, 0 rows affected
Query OK, 0 rows affected (3NF compliant structure)`,
    explanation: "Normalization removes anomalies and duplicate data. 1NF ensures atomicity, 2NF removes partial key dependencies, and 3NF removes transitive dependencies.",
    keywords: ["normalization", "1NF", "2NF", "3NF", "foreign key", "schema design"]
  },

  // ================= Web Development =================
  {
    id: "web-001",
    subjectId: "web-development",
    number: 1,
    title: "HTML5 Page Structure",
    objective: "Create a modern, accessible HTML5 document with semantic elements.",
    language: "html",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semantic HTML5 Layout</title>
</head>
<body>
    <header>
        <h1>PracVault</h1>
        <p>Your Practicals. One Vault. Zero Hassle.</p>
    </header>
    <nav aria-label="Main Navigation">
        <ul>
            <li><a href="#subjects">Subjects</a></li>
            <li><a href="#bookmarks">Bookmarks</a></li>
        </ul>
    </nav>
    <main>
        <section id="subjects">
            <h2>Available Subjects</h2>
            <article>
                <h3>Python Fundamentals</h3>
                <p>Learn core Python syntax and idioms.</p>
            </article>
        </section>
    </main>
    <footer>
        <p>&copy; 2026 PracVault</p>
    </footer>
</body>
</html>`,
    expectedOutput: `Renders a clean semantic HTML5 layout with proper accessible headers, navigation, main article section, and footer.`,
    explanation: "Semantic elements (<header>, <nav>, <main>, <article>, <footer>) improve accessibility for assistive technologies and enhance SEO indexing.",
    keywords: ["HTML5", "semantic", "accessibility", "header", "nav", "main", "footer"]
  },
  {
    id: "web-002",
    subjectId: "web-development",
    number: 2,
    title: "CSS Flexbox and Grid Layouts",
    objective: "Build responsive UI components using CSS Flexbox and CSS Grid.",
    language: "css",
    code: `/* Responsive Grid & Flexbox Utilities */
.app-container {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
}

.card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.25rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}`,
    expectedOutput: `Generates a responsive two-column layout with an auto-filling grid of interactive hoverable cards.`,
    explanation: "CSS Grid is ideal for two-dimensional structure (columns and rows), while Flexbox handles one-dimensional alignment within components.",
    keywords: ["css", "grid", "flexbox", "responsive", "auto-fill", "hover"]
  },
  {
    id: "web-003",
    subjectId: "web-development",
    number: 3,
    title: "JavaScript DOM Manipulation",
    objective: "Dynamically render and manipulate elements using vanilla JavaScript.",
    language: "javascript",
    code: `// Practical 3: DOM Element Creation
function renderBadge(label, color = "#4263EB") {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = label;
    badge.style.backgroundColor = \`\${color}1A\`;
    badge.style.color = color;
    badge.style.padding = "4px 8px";
    badge.style.borderRadius = "6px";
    badge.style.fontSize = "12px";
    badge.style.fontWeight = "600";
    return badge;
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("badge-container");
    if (container) {
        container.appendChild(renderBadge("Active"));
    }
});`,
    expectedOutput: `Appends a stylized DOM badge span element dynamically into #badge-container upon page load.`,
    explanation: "document.createElement() and appendChild() manipulate the DOM tree safely. Using textContent prevents XSS vulnerabilities compared to innerHTML.",
    keywords: ["DOM", "javascript", "createElement", "appendChild", "security", "XSS"]
  },
  {
    id: "web-004",
    subjectId: "web-development",
    number: 4,
    title: "Fetch API and Async/Await",
    objective: "Consume REST APIs with error handling and async/await.",
    language: "javascript",
    code: `// Practical 4: Fetch with async/await
async function loadPracticals(subjectId) {
    try {
        const response = await fetch(\`/api/subjects/\${subjectId}/practicals\`);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        console.log(\`Loaded \${data.length} practicals\`);
        return data;
    } catch (err) {
        console.error("Failed to fetch practicals:", err);
        return [];
    }
}`,
    expectedOutput: `Asynchronously fetches JSON practical data with safe HTTP status validation and error logging.`,
    explanation: "async/await simplifies asynchronous Promise flows. Always verify response.ok before parsing JSON to catch non-2xx HTTP error codes.",
    keywords: ["fetch", "async", "await", "Promise", "HTTP", "REST", "JSON"]
  },
  {
    id: "web-005",
    subjectId: "web-development",
    number: 5,
    title: "HTML Forms and Validation",
    objective: "Implement accessible form controls with client-side validation.",
    language: "html",
    code: `<!-- Practical 5: Form Validation -->
<form id="feedback-form" novalidate>
    <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" required minlength="2" placeholder="Jane Doe">
    </div>
    <div class="form-group">
        <label for="email">Student Email</label>
        <input type="email" id="email" required placeholder="jane@uni.edu">
    </div>
    <button type="submit">Submit Feedback</button>
</form>

<script>
document.getElementById('feedback-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {
        alert('Form submitted successfully!');
    } else {
        alert('Please complete all required fields.');
    }
});
</script>`,
    expectedOutput: `Displays a validated input form checking minimum length, email syntax, and preventing submission on errors.`,
    explanation: "HTML5 validation attributes (required, minlength, type='email') coupled with JavaScript checkValidity() provide robust user feedback.",
    keywords: ["form", "validation", "HTML5", "checkValidity", "accessibility"]
  },
  {
    id: "web-006",
    subjectId: "web-development",
    number: 6,
    title: "LocalStorage and SessionStorage",
    objective: "Persist preferences and bookmark states using Web Storage APIs.",
    language: "javascript",
    code: `// Practical 6: LocalStorage Helper
const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }
};

// Example usage: Bookmark management
const bookmarks = Storage.get("pracvault_bookmarks", []);
bookmarks.push("py-001");
Storage.set("pracvault_bookmarks", bookmarks);
console.log("Bookmarks:", Storage.get("pracvault_bookmarks"));`,
    expectedOutput: `Bookmarks: ["py-001"] (persisted across page reloads)`,
    explanation: "localStorage persists key-value strings across browser restarts. Wrapping calls in JSON.parse/stringify enables structured object caching.",
    keywords: ["localStorage", "web storage", "persistence", "JSON", "bookmarks"]
  },
  {
    id: "web-007",
    subjectId: "web-development",
    number: 7,
    title: "Node.js HTTP Server",
    objective: "Create a lightweight HTTP server serving JSON endpoints.",
    language: "javascript",
    code: `// Practical 7: Node.js HTTP Server
import http from 'http';

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(\`Server running at http://localhost:\${PORT}/\`);
});`,
    expectedOutput: `Server running at http://localhost:3000/
GET /health returns HTTP 200 {"status":"ok","uptime":...}`,
    explanation: "Node.js http.createServer() handles client requests and constructs streaming responses without external framework dependencies.",
    keywords: ["node", "http", "server", "REST", "JSON", "backend"]
  },
  {
    id: "web-008",
    subjectId: "web-development",
    number: 8,
    title: "CSS Animations and Transitions",
    objective: "Implement keyframe animations and respect prefers-reduced-motion.",
    language: "css",
    code: `/* Practical 8: Micro-interactions */
@keyframes fadeInSlideUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.practical-card {
    animation: fadeInSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Accessibility: honor prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
    .practical-card {
        animation: none;
        transition: none;
    }
}`,
    expectedOutput: `Smooth entrance slide-up animation that gracefully turns off for users requesting reduced motion.`,
    explanation: "CSS keyframes provide smooth 60fps animations. Supporting prefers-reduced-motion ensures accessibility for vestibular motion sensitivity.",
    keywords: ["css", "animation", "keyframes", "reduced-motion", "accessibility", "transition"]
  },
  {
    id: "web-009",
    subjectId: "web-development",
    number: 9,
    title: "JavaScript ES6+ Features",
    objective: "Use destructuring, spread syntax, optional chaining, and nullish coalescing.",
    language: "javascript",
    code: `// Practical 9: Modern ES6+ Idioms
const practical = {
    id: "py-001",
    title: "Hello World",
    author: { name: "Antigravity" }
};

// Destructuring & default values
const { id, title, language = "python" } = practical;

// Optional chaining (?.) and nullish coalescing (??)
const reviewer = practical.review?.assignedTo ?? "Unassigned";

// Spread operator
const updatedPractical = { ...practical, bookmarked: true, reviewed: false };

console.log({ id, title, language, reviewer, updatedPractical });`,
    expectedOutput: `{
  id: 'py-001',
  title: 'Hello World',
  language: 'python',
  reviewer: 'Unassigned',
  updatedPractical: { id: 'py-001', title: 'Hello World', author: { name: 'Antigravity' }, bookmarked: true, reviewed: false }
}`,
    explanation: "Modern JavaScript features improve safety and conciseness: ?. prevents null pointer errors, ?? provides defaults only on null/undefined, and ... merges objects.",
    keywords: ["ES6", "destructuring", "spread", "optional chaining", "nullish coalescing"]
  },
  {
    id: "web-010",
    subjectId: "web-development",
    number: 10,
    title: "Express.js REST API",
    objective: "Build a REST API router with express middleware.",
    language: "javascript",
    code: `// Practical 10: Express.js API
import express from 'express';

const app = express();
app.use(express.json());

const practicals = [
    { id: 1, title: "Array Operations", subject: "Data Structures" }
];

app.get('/api/practicals', (req, res) => {
    res.json(practicals);
});

app.post('/api/practicals', (req, res) => {
    const newPrac = { id: practicals.length + 1, ...req.body };
    practicals.push(newPrac);
    res.status(201).json(newPrac);
});

app.listen(3000, () => console.log("API on port 3000"));`,
    expectedOutput: `API on port 3000
GET /api/practicals returns practicals list.
POST /api/practicals appends new item with HTTP 201.`,
    explanation: "Express provides an intuitive middleware pipeline, JSON body parsing, and routing primitives for standard REST architectures.",
    keywords: ["express", "REST API", "middleware", "json", "routing", "HTTP"]
  }
];

// Write files to src/data/
const dataDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'subjects.json'), JSON.stringify(subjects, null, 2), 'utf-8');
console.log(`Saved ${subjects.length} subjects to src/data/subjects.json`);

fs.writeFileSync(path.join(dataDir, 'practicals.json'), JSON.stringify(practicals, null, 2), 'utf-8');
console.log(`Saved ${practicals.length} practicals to src/data/practicals.json`);

---
title: Data Structures & Algorithms
description: Build a strong foundation in DSA with practical coding exercises and interview prep. Learn Big-O, arrays, linked lists, stacks, queues, trees, hashing, sorting and searching - with working Python code.
difficulty: Intermediate
duration: 10 weeks
instructor: Prof. James Liu
image: https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop
tags: DSA, Coding, Interviews
rating: 4.7
ratingsCount: 312
enrolledCount: 3120
price: 149
discountPrice: 89
---

# LESSON: Big-O Notation and Complexity | 30 min

## Why complexity matters

Two programs can give the same answer, but one finishes in a second and the other in a year when the input grows. **Big-O notation** describes how the running time (or memory) grows as the input size **n** grows. It ignores constants and focuses on the dominant term.

## Common complexities (fast to slow)

| Notation | Name | Example |
|---|---|---|
| O(1) | Constant | Reading `arr[5]` |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Looping through a list once |
| O(n log n) | Linearithmic | Merge sort |
| O(n^2) | Quadratic | Nested loops over the same list |
| O(2^n) | Exponential | Naive recursive Fibonacci |

## Reading code

```python
def first(arr):            # O(1)
    return arr[0]

def total(arr):            # O(n)
    s = 0
    for x in arr:
        s += x
    return s

def has_pair(arr):         # O(n^2)
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] + arr[j] == 0:
                return True
    return False
```

## Rules of thumb

1. Drop constants: O(2n) becomes O(n).
2. Drop lower-order terms: O(n^2 + n) becomes O(n^2).
3. Sequential steps add; nested steps multiply.
4. Halving the problem each step gives O(log n).

## Space complexity

Measures **extra memory** used. A function that builds a new list of size n uses O(n) space; one that only uses a few variables uses O(1).

> **Interview tip:** after writing a solution, always state its time **and** space complexity out loud.

# LESSON: Arrays and Strings | 30 min

An **array** stores items in contiguous memory, so reading by index is O(1).

## Common operations

| Operation | Python list | Complexity |
|---|---|---|
| Access `a[i]` | `a[3]` | O(1) |
| Append at end | `a.append(x)` | O(1) amortised |
| Insert / delete in the middle | `a.insert(i, x)` | O(n) - items must shift |
| Search for a value | `x in a` | O(n) |

## Pattern 1: Two pointers

Check whether a string is a palindrome without extra memory.

```python
def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return False
        l += 1
        r -= 1
    return True

print(is_palindrome("level"))   # True
```

## Pattern 2: Hash map for lookups

Find two numbers that add up to a target (Two Sum) in O(n) instead of O(n^2).

```python
def two_sum(nums, target):
    seen = {}                       # value -> index
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return []

print(two_sum([2, 7, 11, 15], 9))   # [0, 1]
```

## Pattern 3: Sliding window

Maximum sum of any k consecutive elements.

```python
def max_window(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]   # slide: add new, remove old
        best = max(best, window)
    return best

print(max_window([2, 1, 5, 1, 3, 2], 3))   # 9
```

## Strings

Strings are immutable in Python, so building one with `+=` inside a loop is O(n^2). Collect pieces in a list and call `"".join(parts)` instead.

## Practice

Reverse an array in place; find the first non-repeating character in a string; check if two strings are anagrams.

# LESSON: Linked Lists | 35 min

A **linked list** is a chain of **nodes**. Each node holds a value and a reference to the next node. Unlike arrays, nodes can live anywhere in memory.

| Operation | Array | Linked list |
|---|---|---|
| Access by index | O(1) | O(n) |
| Insert at the front | O(n) | O(1) |
| Insert after a known node | O(n) | O(1) |
| Memory | Contiguous | Extra pointer per node |

## Building one

```python
class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None

    def push_front(self, val):          # O(1)
        self.head = Node(val, self.head)

    def append(self, val):              # O(n)
        node = Node(val)
        if not self.head:
            self.head = node
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = node

    def to_list(self):
        out, cur = [], self.head
        while cur:
            out.append(cur.val)
            cur = cur.next
        return out
```

## Classic problem: reverse a list

Keep track of the previous node and flip each pointer.

```python
def reverse(head):
    prev = None
    cur = head
    while cur:
        nxt = cur.next      # save next
        cur.next = prev     # flip the pointer
        prev = cur
        cur = nxt
    return prev             # new head
```

## Classic problem: detect a cycle (Floyd's algorithm)

Move one pointer 1 step and another 2 steps. If they ever meet, there is a cycle.

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
```

## Variants

- **Doubly linked list** - each node also points to the previous node.
- **Circular linked list** - the last node points back to the first.

# LESSON: Stacks and Queues | 30 min

## Stack - Last In, First Out (LIFO)

Like a pile of plates: you add and remove from the **top**. Uses: undo/redo, browser back button, function call stack, expression parsing.

```python
stack = []
stack.append(1)     # push
stack.append(2)
print(stack.pop())  # 2  (pop)
print(stack[-1])    # 1  (peek)
```

All three operations are O(1).

### Example: balanced brackets

```python
def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

print(is_balanced("{[()]}"))   # True
print(is_balanced("{[(])}"))   # False
```

## Queue - First In, First Out (FIFO)

Like a line at a ticket counter. Uses: task scheduling, print queues, breadth-first search.

```python
from collections import deque

q = deque()
q.append("a")        # enqueue
q.append("b")
print(q.popleft())   # "a"  (dequeue)
```

> Do **not** use `list.pop(0)` as a queue - it is O(n). `deque` gives O(1) at both ends.

## Priority queue

Items leave in order of **priority**, not arrival. Python provides it with `heapq`.

```python
import heapq

heap = []
heapq.heappush(heap, (2, "write report"))
heapq.heappush(heap, (1, "fix bug"))
print(heapq.heappop(heap))   # (1, 'fix bug')
```

Push and pop are O(log n).

## Summary

| Structure | Order | Typical use |
|---|---|---|
| Stack | LIFO | Undo, parsing, DFS |
| Queue | FIFO | Scheduling, BFS |
| Priority queue | By priority | Dijkstra, task scheduling |

# LESSON: Trees and Binary Search Trees | 40 min

A **tree** is a hierarchy of nodes: one **root**, and every node has zero or more **children**. A **binary tree** allows at most two children (left and right).

## Binary Search Tree (BST)

For every node: everything in the **left** subtree is smaller, everything in the **right** subtree is larger. This makes search, insert and delete O(log n) on average - but O(n) if the tree degenerates into a line.

```python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def search(root, val):
    if root is None or root.val == val:
        return root
    return search(root.left, val) if val < root.val else search(root.right, val)
```

## Traversals

```python
def inorder(node):            # left, node, right  -> sorted order for a BST
    if node:
        yield from inorder(node.left)
        yield node.val
        yield from inorder(node.right)

def preorder(node):           # node, left, right
    if node:
        yield node.val
        yield from preorder(node.left)
        yield from preorder(node.right)
```

**Level-order (BFS)** visits level by level using a queue:

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    out, q = [], deque([root])
    while q:
        node = q.popleft()
        out.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    return out
```

## Height of a tree

```python
def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))
```

## Where trees appear

File systems, the DOM in your browser, database indexes (B-trees), and autocomplete (tries).

# LESSON: Sorting, Searching and Hashing | 40 min

## Binary search - O(log n)

Works only on **sorted** data. Repeatedly check the middle and discard half.

```python
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9, 11], 7))   # 3
```

## Sorting algorithms

| Algorithm | Best | Average | Worst | Notes |
|---|---|---|---|---|
| Bubble sort | O(n) | O(n^2) | O(n^2) | Simple, rarely used |
| Insertion sort | O(n) | O(n^2) | O(n^2) | Great for tiny or nearly sorted data |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | Stable, needs O(n) extra space |
| Quick sort | O(n log n) | O(n log n) | O(n^2) | Fast in practice, in place |

### Merge sort

```python
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]

print(merge_sort([5, 2, 9, 1, 5, 6]))   # [1, 2, 5, 5, 6, 9]
```

In everyday Python simply use `sorted(arr)` (Timsort, O(n log n)).

## Hash tables

A hash table (Python `dict` / `set`) uses a **hash function** to turn a key into an array index, giving O(1) average lookup, insert and delete. When two keys land on the same index (a **collision**), the table resolves it, for example by chaining items in a small list.

```python
counts = {}
for word in "to be or not to be".split():
    counts[word] = counts.get(word, 0) + 1
print(counts)   # {'to': 2, 'be': 2, 'or': 1, 'not': 1}
```

## Choosing the right tool

- Need fast lookup by key? **Hash map**.
- Need sorted order or range queries? **BST / sorted array + binary search**.
- Need the min or max repeatedly? **Heap**.
- Processing in arrival order? **Queue**. Reverse order? **Stack**.

## How to keep practising

Solve 2-3 problems per day on a coding platform, always starting with brute force, then asking "which data structure removes the repeated work?"

# QUIZ

Q: What is the time complexity of accessing an array element by index?
A) O(n)
B) O(log n)
C) O(1)
D) O(n^2)
ANSWER: C

Q: A function has two nested loops that each run n times. Its time complexity is:
A) O(n)
B) O(n log n)
C) O(n^2)
D) O(2n)
ANSWER: C

Q: Which data structure follows Last In, First Out (LIFO)?
A) Queue
B) Stack
C) Linked list
D) Hash table
ANSWER: B

Q: Why is list.pop(0) a poor way to implement a queue in Python?
A) It raises an error
B) It is O(n) because all remaining items shift
C) It returns the last item
D) It cannot hold strings
ANSWER: B

Q: In Floyd's cycle detection, how do the two pointers move?
A) Both move one step
B) One moves one step and the other moves two steps
C) Both move two steps
D) One moves forward and one backward
ANSWER: B

Q: Which traversal of a binary search tree returns values in sorted order?
A) Preorder
B) Postorder
C) Inorder
D) Level-order
ANSWER: C

Q: Binary search requires the data to be:
A) Unique
B) Sorted
C) Stored in a linked list
D) Numeric only
ANSWER: B

Q: What is the average time complexity of looking up a key in a hash table?
A) O(1)
B) O(n)
C) O(log n)
D) O(n log n)
ANSWER: A

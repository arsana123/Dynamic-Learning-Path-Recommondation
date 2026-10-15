---
title: JavaScript Essentials
description: Learn modern JavaScript from scratch - variables, functions, arrays, objects, the DOM, asynchronous programming and ES6+ features. The foundation for React, Node.js and the entire MERN stack.
difficulty: Beginner
duration: 6 weeks
instructor: Priya Sharma
image: https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop
tags: JavaScript, Frontend, Web
rating: 4.8
ratingsCount: 402
enrolledCount: 4210
price: 79
discountPrice: 39
---

# LESSON: Variables, Types and Operators | 30 min

## Running JavaScript

You can run JavaScript in the browser console (press `F12`), inside an HTML page, or with **Node.js** on your computer:

```bash
node hello.js
```

```js
console.log("Hello, JavaScript!");
```

## Declaring variables

```js
const name = "Asha";   // cannot be reassigned
let age = 24;          // can be reassigned
age = 25;
// var is the old way - avoid it
```

> **Rule:** use `const` by default; use `let` only when the value must change.

## Data types

| Type | Example |
|---|---|
| string | `"hello"`, `'hi'`, or backtick template strings |
| number | `42`, `3.14` |
| boolean | `true`, `false` |
| undefined | a variable with no value yet |
| null | intentionally empty |
| object | `{ a: 1 }`, `[1, 2]` |

```js
console.log(typeof "hi");     // "string"
console.log(typeof 42);       // "number"
console.log(typeof null);     // "object"  (a famous quirk)
```

## Template literals

```js
const city = "Pune";
console.log(`${name} lives in ${city} and is ${age + 1} next year`);
```

## Operators

```js
5 + 2; 5 - 2; 5 * 2; 5 / 2; 5 % 2; 2 ** 3;   // arithmetic

5 == "5";    // true  (loose equality converts types) - avoid
5 === "5";   // false (strict equality) - always use this

true && false;   // false
true || false;   // true
!true;           // false
```

## Truthy and falsy

These are **falsy**: `false`, `0`, `""`, `null`, `undefined`, `NaN`. Everything else is **truthy**.

```js
const user = null;
const display = user ?? "Guest";    // nullish coalescing -> "Guest"
const city2 = user?.address?.city;  // optional chaining -> undefined, no crash
```

# LESSON: Control Flow and Functions | 35 min

## Conditions

```js
const score = 78;

if (score >= 90) {
  console.log("A");
} else if (score >= 70) {
  console.log("B");
} else {
  console.log("C");
}

const status = score >= 40 ? "pass" : "fail";   // ternary

switch (status) {
  case "pass":
    console.log("Well done");
    break;
  default:
    console.log("Try again");
}
```

## Loops

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}

let n = 3;
while (n > 0) {
  n--;
}

for (const item of ["a", "b", "c"]) {   // iterate values
  console.log(item);
}

for (const key in { x: 1, y: 2 }) {     // iterate object keys
  console.log(key);
}
```

## Functions

```js
// declaration
function add(a, b) {
  return a + b;
}

// arrow function
const multiply = (a, b) => a * b;

// default and rest parameters
const greet = (name = "friend") => `Hello, ${name}!`;
const sum = (...nums) => nums.reduce((t, n) => t + n, 0);

console.log(add(2, 3), multiply(4, 5), greet(), sum(1, 2, 3));
```

## Scope and closures

Variables declared inside a function (or a `{}` block with `let`/`const`) are only visible there. A **closure** is a function that remembers the variables from where it was created:

```js
function counter() {
  let count = 0;
  return () => ++count;
}

const next = counter();
console.log(next(), next(), next());   // 1 2 3
```

## Practice

Write a function `isPrime(n)` that returns `true` if `n` is prime. Then print all primes below 50.

# LESSON: Arrays and Objects | 40 min

## Arrays

```js
const fruits = ["apple", "banana", "mango"];

fruits.push("kiwi");        // add to end
fruits.pop();               // remove from end
fruits.unshift("grape");    // add to start
console.log(fruits.length, fruits[0], fruits.includes("mango"));
```

## The big three: map, filter, reduce

```js
const nums = [1, 2, 3, 4, 5, 6];

const doubled = nums.map((n) => n * 2);          // [2, 4, 6, 8, 10, 12]
const evens = nums.filter((n) => n % 2 === 0);   // [2, 4, 6]
const total = nums.reduce((sum, n) => sum + n, 0);   // 21
```

Other useful methods: `find`, `findIndex`, `some`, `every`, `sort`, `slice`, `join`, `flat`.

```js
const users = [
  { name: "Asha", age: 24 },
  { name: "Ravi", age: 31 },
];
const ravi = users.find((u) => u.name === "Ravi");
const names = users.map((u) => u.name).join(", ");
const sorted = [...users].sort((a, b) => a.age - b.age);
```

## Objects

```js
const student = {
  name: "Meena",
  age: 22,
  skills: ["JS", "SQL"],
  greet() {
    return `Hi, I'm ${this.name}`;
  },
};

console.log(student.name, student["age"]);
student.city = "Delhi";     // add property
delete student.age;         // remove property

console.log(Object.keys(student));
console.log(Object.entries(student));
```

## Destructuring and spread

```js
const { name, skills } = student;          // pull out properties
const [first, second] = fruits;            // pull out items

const copy = { ...student, name: "Meena K" };   // copy + override
const all = [...fruits, "pear"];                 // copy + add
```

## JSON

JSON is the text format used to send data between servers and browsers.

```js
const text = JSON.stringify({ id: 1, ok: true });   // object -> string
const obj = JSON.parse(text);                        // string -> object
```

# LESSON: DOM Manipulation and Events | 40 min

The **DOM** (Document Object Model) is the browser's tree representation of your HTML. JavaScript can read and change it to make pages interactive.

## Selecting elements

```html
<h1 id="title">Task List</h1>
<input id="taskInput" placeholder="New task" />
<button id="addBtn">Add</button>
<ul id="list"></ul>
```

```js
const title = document.querySelector("#title");
const input = document.querySelector("#taskInput");
const list = document.querySelector("#list");
const items = document.querySelectorAll("li");   // all matches
```

## Changing content and style

```js
title.textContent = "My Tasks";
title.classList.add("highlight");
title.style.color = "teal";
input.setAttribute("placeholder", "Type here...");
```

## Creating elements

```js
const li = document.createElement("li");
li.textContent = "Learn JavaScript";
list.appendChild(li);
```

## Events

```js
document.querySelector("#addBtn").addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  li.textContent = text;
  list.appendChild(li);
  input.value = "";
});
```

Common events: `click`, `input`, `submit`, `keydown`, `change`, `mouseover`.

## Event delegation

Instead of adding a listener to every list item, add **one** listener to the parent:

```js
list.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("done");
  }
});
```

## Form handling

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();               // stop the page reloading
  const data = new FormData(form);
  console.log(Object.fromEntries(data));
});
```

## Security note

Never insert untrusted text with `innerHTML` - it can run malicious scripts (XSS). Use `textContent` instead.

# LESSON: Asynchronous JavaScript | 40 min

JavaScript runs on a **single thread**, so slow operations (network requests, timers, file reads) must not block it. Async code lets other work continue while waiting.

## Callbacks and the event loop

```js
console.log("1");
setTimeout(() => console.log("2"), 1000);
console.log("3");
// prints 1, 3, then 2 - the timer callback runs later
```

Deeply nested callbacks become unreadable ("callback hell"), which is why Promises were invented.

## Promises

A **Promise** represents a value that will be available later. It is *pending*, then either *fulfilled* or *rejected*.

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(500)
  .then(() => console.log("done waiting"))
  .catch((err) => console.error(err))
  .finally(() => console.log("always runs"));
```

## async / await

Makes asynchronous code read like normal top-to-bottom code.

```js
async function loadUser(id) {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const user = await res.json();
    console.log(user.name);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

loadUser(1);
```

> `fetch` only rejects on network failure. A 404 or 500 still resolves - always check `res.ok`.

## Running things in parallel

```js
const [users, posts] = await Promise.all([
  fetch("/api/users").then((r) => r.json()),
  fetch("/api/posts").then((r) => r.json()),
]);
```

`Promise.all` waits for all and fails if any one fails. `Promise.allSettled` waits for all regardless.

## Sending data

```js
await fetch("/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Study" }),
});
```

# LESSON: Modern JavaScript: Classes, Modules and Best Practices | 35 min

## Classes

```js
class Animal {
  #secret = "hidden";          // private field

  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }

  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks`;
  }
}

console.log(new Dog("Bruno").speak());   // Bruno barks
```

Classes are a cleaner syntax over JavaScript's **prototype**-based inheritance.

## Modules

Split code into files with `export` and `import`.

```js
// math.js
export const add = (a, b) => a + b;
export default function square(n) { return n * n; }

// app.js
import square, { add } from "./math.js";
console.log(add(2, 3), square(4));
```

In a browser, load with `<script type="module" src="app.js"></script>`. In Node.js set `"type": "module"` in `package.json`.

## Useful modern features

```js
// array/object helpers
const unique = [...new Set([1, 2, 2, 3])];            // [1, 2, 3]
const grouped = Object.fromEntries(new Map([["a", 1]]));

// optional catch binding, nullish assignment
let config = null;
config ??= { theme: "dark" };

// short-circuit
const isAdmin = user && user.role === "admin";
```

## Best practices

1. Use `const`/`let`, never `var`.
2. Prefer `===` over `==`.
3. Keep functions small and single-purpose.
4. Handle errors in async code with `try/catch`.
5. Use meaningful names: `getUserById`, not `gub`.
6. Format with **Prettier** and check with **ESLint**.
7. Don't mutate shared data unexpectedly - copy with spread.

## Mini project

Build a **Weather or Quote app**: a form, a `fetch` to a public API, and a function that renders results into the DOM with error handling. Put it on GitHub - then you're ready to learn React!

# QUIZ

Q: Which keyword should you use by default to declare a variable that is not reassigned?
A) var
B) let
C) const
D) static
ANSWER: C

Q: What does 5 === "5" evaluate to?
A) true
B) false
C) undefined
D) It throws an error
ANSWER: B

Q: Which array method returns a new array containing only items that pass a test?
A) map
B) reduce
C) filter
D) forEach
ANSWER: C

Q: What will [1, 2, 3].reduce((sum, n) => sum + n, 0) return?
A) [1, 2, 3]
B) 6
C) 0
D) undefined
ANSWER: B

Q: Which method attaches a click handler to an element?
A) element.onClickAdd()
B) element.addEventListener("click", handler)
C) element.attach("click")
D) element.listen(click)
ANSWER: B

Q: Why should you avoid setting untrusted text with innerHTML?
A) It is slower than everything else
B) It can allow cross-site scripting (XSS) attacks
C) It removes event listeners from the page
D) It only works in Node.js
ANSWER: B

Q: What does await do inside an async function?
A) Blocks the whole browser
B) Pauses that function until the Promise settles, without blocking other code
C) Cancels the Promise
D) Converts a Promise into a callback
ANSWER: B

Q: If fetch receives an HTTP 404 response, what happens?
A) The promise rejects automatically
B) The promise resolves, and res.ok is false
C) The program crashes
D) fetch retries automatically
ANSWER: B

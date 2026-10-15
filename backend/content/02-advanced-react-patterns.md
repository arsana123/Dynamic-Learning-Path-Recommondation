---
title: Advanced React Patterns
description: Master advanced React concepts including hooks, context, compound components, and performance optimization. Build production-quality components using the same patterns used in popular libraries.
difficulty: Advanced
duration: 6 weeks
instructor: Mike Rodriguez
image: https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop
tags: React, JavaScript, Frontend
rating: 4.9
ratingsCount: 185
enrolledCount: 1856
price: 129
discountPrice: 79
prerequisites: UI/UX Design Fundamentals
---

# LESSON: Advanced Hooks Patterns | 40 min

## useReducer for complex state

When state has several related values or many ways to change, `useReducer` is clearer than many `useState` calls. All updates go through one pure function.

```jsx
import { useReducer } from "react";

const initial = { items: [], status: "idle" };

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { ...state, items: [...state.items, action.item] };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "clear":
      return initial;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Cart() {
  const [state, dispatch] = useReducer(reducer, initial);
  return (
    <button onClick={() => dispatch({ type: "add", item: { id: 1, name: "Book" } })}>
      Add ({state.items.length})
    </button>
  );
}
```

## useRef - values that don't trigger re-renders

`useRef` stores a mutable value that survives renders. Two common uses: accessing DOM nodes and remembering values.

```jsx
function SearchBox() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
```

## Cleaning up effects

Return a function from `useEffect` to unsubscribe, clear timers or abort requests.

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((e) => e.name !== "AbortError" && setError(e));

  return () => controller.abort();   // cleanup
}, [url]);
```

## Rules to remember

- Call hooks only at the top level of a component or custom hook - never inside loops or conditions.
- List every reactive value used inside an effect in its dependency array.
- Prefer **functional updates** when the new state depends on the old: `setCount((c) => c + 1)`.

# LESSON: Custom Hooks in Practice | 35 min

A **custom hook** is a function whose name starts with `use` and that calls other hooks. It lets you share *stateful logic* (not UI) between components.

## useLocalStorage

```jsx
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// usage
const [theme, setTheme] = useLocalStorage("theme", "dark");
```

## useDebounce

Wait until the user stops typing before running an expensive action such as an API search.

```jsx
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

// usage
const query = useDebounce(searchText, 500);
useEffect(() => { if (query) search(query); }, [query]);
```

## useFetch

```jsx
export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ data: null, loading: false, error });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
```

## Design tips

- Return what callers need (an array for 2 values, an object for many).
- Keep hooks focused: one job per hook.
- Each call to a hook creates its **own isolated state** - two components using `useLocalStorage` do not share values.

# LESSON: Context API Deep Dive | 35 min

Context passes data through the component tree without **prop drilling** (handing props through many layers that don't use them).

## The three steps

```jsx
import { createContext, useContext, useState } from "react";

// 1. create
const ThemeContext = createContext(null);

// 2. provide
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. consume (wrapped in a custom hook for safety)
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
```

## The performance trap

Every component that calls `useContext` re-renders **whenever the context value changes**. Passing a fresh object literal each render makes the value "change" every time.

```jsx
// Better: memoize the value
const value = useMemo(() => ({ theme, toggle }), [theme]);
```

## Split contexts

Put values that change often (e.g. current user position) in a separate context from values that rarely change (e.g. theme). Consumers of the stable context then won't re-render needlessly.

```jsx
<UserStateContext.Provider value={state}>
  <UserDispatchContext.Provider value={dispatch}>
    {children}
  </UserDispatchContext.Provider>
</UserStateContext.Provider>
```

`dispatch` from `useReducer` is stable, so components that only dispatch never re-render when state changes.

## When NOT to use context

Context is great for theme, auth user, language and other app-wide, low-frequency data. For rapidly changing or large shared state, consider a dedicated state library (Redux Toolkit, Zustand) or lift state only as high as it needs to go.

# LESSON: Compound Components and Render Props | 35 min

## Compound components

Several components work together and share implicit state - like `<select>` and `<option>`. The parent owns the state; children read it through context. The result is a flexible, readable API.

```jsx
const TabsContext = createContext();

function Tabs({ children, defaultIndex = 0 }) {
  const [active, setActive] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function Tab({ index, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActive(index)}
      style={{ fontWeight: active === index ? "bold" : "normal" }}
    >
      {children}
    </button>
  );
}

function Panel({ index, children }) {
  const { active } = useContext(TabsContext);
  return active === index ? <div>{children}</div> : null;
}

Tabs.Tab = Tab;
Tabs.Panel = Panel;

// usage
<Tabs>
  <Tabs.Tab index={0}>Profile</Tabs.Tab>
  <Tabs.Tab index={1}>Settings</Tabs.Tab>
  <Tabs.Panel index={0}>Your profile</Tabs.Panel>
  <Tabs.Panel index={1}>Your settings</Tabs.Panel>
</Tabs>
```

## Render props

A component receives a **function** as a prop and calls it to decide what to render. The component supplies the logic; the caller supplies the UI.

```jsx
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      {children(pos)}
    </div>
  );
}

<MouseTracker>
  {({ x, y }) => <p>Mouse at {x}, {y}</p>}
</MouseTracker>
```

## Which pattern when?

| Need | Pattern |
|---|---|
| Reuse stateful logic | Custom hook (usually the best choice today) |
| Flexible multi-part UI with shared state | Compound components |
| Let the caller control what is rendered | Render props / children as function |

Hooks replaced most render-prop use cases, but the idea is still found in libraries such as React Router and Formik.

# LESSON: Performance Optimization | 45 min

> **Rule #1: measure first.** Use the React DevTools **Profiler** to find real bottlenecks before optimising.

## Why components re-render

A component re-renders when its **state changes**, its **parent re-renders**, or a **context it uses changes**. Re-rendering is usually fast; it only matters when it is expensive or happens too often.

## React.memo

Skips re-rendering when props are shallowly equal.

```jsx
const Row = React.memo(function Row({ item, onSelect }) {
  console.log("render", item.id);
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});
```

## useCallback and useMemo

`React.memo` is useless if you pass a new function or object every render. Stabilise them:

```jsx
function List({ items }) {
  const [selected, setSelected] = useState(null);

  // same function identity between renders
  const handleSelect = useCallback((id) => setSelected(id), []);

  // expensive calculation only reruns when items change
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  return <ul>{sorted.map((i) => <Row key={i.id} item={i} onSelect={handleSelect} />)}</ul>;
}
```

- `useMemo` caches a **value**.
- `useCallback` caches a **function**.
- Don't wrap everything - memoisation has its own cost.

## Stable keys

Always use a unique, stable `key` (like an id), never the array index for lists that can reorder or change.

## Virtualise long lists

Rendering 10,000 rows is slow. Libraries like `react-window` render only the rows visible on screen.

## Other quick wins

- Keep state **close to where it is used** so fewer components re-render.
- Debounce rapid inputs (see the custom hooks lesson).
- Avoid creating components inside other components.
- Use `startTransition` for non-urgent updates such as filtering a big list.

# LESSON: Error Boundaries, Suspense and Code Splitting | 35 min

## Error boundaries

A JavaScript error in rendering would normally blank the entire app. An **error boundary** catches errors in its children and shows a fallback instead. They must be **class components** (there is no hook equivalent yet).

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Caught:", error, info);   // send to a logging service here
  }

  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}

<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>
```

Error boundaries do **not** catch errors in event handlers, async code or the server - use `try/catch` there.

## Code splitting with lazy and Suspense

Ship only the code the user needs right now. `React.lazy` loads a component on demand and `Suspense` shows a fallback while it loads.

```jsx
import { lazy, Suspense } from "react";

const Admin = lazy(() => import("./pages/Admin"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Admin />
    </Suspense>
  );
}
```

A great place to split is **per route**, so each page's code loads when it is visited.

## Putting it together

```jsx
<ErrorBoundary>
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </Suspense>
</ErrorBoundary>
```

## Final checklist for production-quality React

- State is as local as possible; context used only for app-wide data
- Reusable logic extracted to custom hooks
- Effects clean up after themselves
- Expensive components memoised **after** profiling
- Routes code-split; errors contained by boundaries

# QUIZ

Q: When is useReducer usually a better choice than useState?
A) When state is a single boolean
B) When state has several related values and many ways to update
C) When you want to avoid using hooks
D) When you need to read the DOM
ANSWER: B

Q: What does returning a function from useEffect do?
A) Runs it before every render
B) Defines cleanup code that runs before the effect re-runs or the component unmounts
C) Stops the effect from ever running
D) Memoises the effect
ANSWER: B

Q: What must the name of a custom hook start with?
A) hook
B) get
C) use
D) with
ANSWER: C

Q: Why can passing a new object literal as a Context Provider value hurt performance?
A) Objects cannot be used as context values
B) Every consumer re-renders each time because the value identity changes
C) It causes a syntax error
D) It disables React.memo globally
ANSWER: B

Q: In the compound components pattern, how do child components usually access shared state?
A) Through global variables
B) Through context provided by the parent
C) By directly mutating the parent's state
D) Through localStorage
ANSWER: B

Q: Which hook caches a computed value between renders?
A) useCallback
B) useRef
C) useMemo
D) useEffect
ANSWER: C

Q: What do React error boundaries NOT catch?
A) Errors thrown while rendering children
B) Errors in lifecycle methods of children
C) Errors inside event handlers
D) Errors in constructors of children
ANSWER: C

Q: What is the main purpose of React.lazy together with Suspense?
A) To delay rendering for animations
B) To load components on demand and show a fallback while loading
C) To catch runtime errors
D) To memoise props
ANSWER: B

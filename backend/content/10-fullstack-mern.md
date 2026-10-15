---
title: Full Stack Web Development with MERN
description: Build and deploy a complete full stack application with MongoDB, Express, React and Node.js. Create a REST API, model data with Mongoose, add JWT authentication, connect a React frontend and deploy to production.
difficulty: Intermediate
duration: 8 weeks
instructor: Arjun Mehta
image: https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop
tags: MERN, Node.js, Full Stack, React
rating: 4.9
ratingsCount: 523
enrolledCount: 4870
price: 139
discountPrice: 79
prerequisites: JavaScript Essentials
---

# LESSON: MERN Architecture and Project Setup | 30 min

## What is the MERN stack?

| Letter | Technology | Role |
|---|---|---|
| **M** | MongoDB | Database - stores data as JSON-like documents |
| **E** | Express.js | Backend web framework - routes and middleware |
| **R** | React | Frontend - the user interface in the browser |
| **N** | Node.js | JavaScript runtime that runs the server |

Everything is written in **JavaScript**, so you use one language across the whole application.

## How a request flows

```
Browser (React)  --HTTP/JSON-->  Express API (Node)  --queries-->  MongoDB
      ^                                 |
      +----------- JSON response -------+
```

1. The user clicks a button in React.
2. React calls the API (`fetch("/api/tasks")`).
3. Express routes the request, runs your logic and asks MongoDB for data.
4. The API sends JSON back and React updates the screen.

## Project structure

```
my-app/
  backend/
    config/db.js
    models/
    controllers/
    routes/
    middleware/
    server.js
    .env
  frontend/
    src/
      components/
      pages/
      utils/
```

## Set up the backend

```bash
mkdir my-app && cd my-app
mkdir backend && cd backend
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install -D nodemon
```

In `package.json` add `"type": "module"` and scripts:

```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Set up the frontend

```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

## Environment variables

Secrets and settings live in a `.env` file (never commit it):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/myapp
JWT_SECRET=a_long_random_string
```

# LESSON: Building a REST API with Express | 40 min

## REST basics

A **REST API** uses HTTP methods on resource URLs:

| Method | URL | Action |
|---|---|---|
| GET | `/api/tasks` | List tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Common status codes: `200` OK, `201` Created, `400` Bad request, `401` Unauthorized, `403` Forbidden, `404` Not found, `500` Server error.

## A minimal server

```js
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());          // parse JSON request bodies

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Routes and controllers

Keep routing and logic separate.

```js
// routes/taskRoutes.js
import { Router } from "express";
import { getTasks, createTask, deleteTask } from "../controllers/taskController.js";

const router = Router();
router.route("/").get(getTasks).post(createTask);
router.route("/:id").delete(deleteTask);
export default router;

// server.js
import taskRoutes from "./routes/taskRoutes.js";
app.use("/api/tasks", taskRoutes);
```

## Middleware

A middleware is a function `(req, res, next)` that runs between the request and the response. Use it for logging, authentication and validation.

```js
export const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();                          // pass control to the next handler
};
app.use(logger);
```

## Central error handling

```js
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});
```

## Test your API

Use **Postman**, **Thunder Client** (VS Code) or `curl`:

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn MERN"}'
```

# LESSON: MongoDB and Mongoose | 40 min

## MongoDB concepts

MongoDB stores **documents** (JSON-like objects) in **collections**, instead of rows in tables.

```json
{
  "_id": "665f1c...",
  "title": "Learn MERN",
  "done": false,
  "tags": ["js", "web"],
  "createdAt": "2026-01-10T10:00:00Z"
}
```

Documents in one collection can have different shapes, and can **embed** related data (arrays, sub-documents).

## Connect with Mongoose

**Mongoose** adds schemas, validation and helper methods on top of MongoDB.

```js
// config/db.js
import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
}
```

MongoDB runs locally (`mongod`), in Docker, or free in the cloud with **MongoDB Atlas** (use its connection string as `MONGO_URI`).

## Schema and model

```js
// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 100 },
    done: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }        // adds createdAt, updatedAt
);

export default mongoose.model("Task", taskSchema);
```

## CRUD controller

```js
// controllers/taskController.js
import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find().sort("-createdAt");
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  const task = await Task.create({ title, user: req.user?._id });
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Deleted" });
};
```

## Useful query features

```js
Task.find({ done: false }).limit(10).skip(20);        // filter + pagination
Task.find().populate("user", "name email");           // join referenced documents
Task.countDocuments({ done: true });
```

> **Express 5** forwards errors from async handlers automatically. On Express 4, wrap handlers in try/catch or use an `asyncHandler` helper.

# LESSON: Authentication with JWT | 45 min

## How it works

1. User registers: you **hash** their password and store it.
2. User logs in: you compare the password with the hash; if it matches, you issue a signed **JSON Web Token (JWT)**.
3. The browser sends the token in the `Authorization` header on each request.
4. A middleware verifies the token and identifies the user.

> **Never store plain-text passwords.** Always hash them with bcrypt.

## User model with password hashing

```js
// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ["student", "admin"], default: "student" },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
```

## Register and login

```js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "Email already registered" });
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ _id: user._id, name: user.name, token: signToken(user._id) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ _id: user._id, name: user.name, token: signToken(user._id) });
};
```

## Protect routes with middleware

```js
// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

export const adminOnly = (req, res, next) =>
  req.user?.role === "admin" ? next() : res.status(403).json({ message: "Admins only" });

// use it
router.get("/me", protect, getMe);
router.post("/", protect, adminOnly, createCourse);
```

## Security checklist

- Use a **long random** `JWT_SECRET` stored in `.env`
- Validate and sanitise input
- Return the **same** message for wrong email and wrong password
- Add rate limiting (`express-rate-limit`) and security headers (`helmet`)
- Always use HTTPS in production

# LESSON: React Frontend: Routing and Calling the API | 45 min

## Routing with React Router

```bash
npm install react-router-dom
```

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
```

## An API helper

Centralise calls so the base URL and auth header live in one place.

```js
// utils/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
```

## A login form

```jsx
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api("/auth/login", { method: "POST", body: form });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email"
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password"
        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Log in</button>
    </form>
  );
}
```

## Fetching and displaying data

```jsx
function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/tasks").then(setTasks).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  return <ul>{tasks.map((t) => <li key={t._id}>{t.title}</li>)}</ul>;
}
```

## CORS

The browser blocks requests to a different origin unless the server allows it. In Express, `app.use(cors({ origin: "http://localhost:5173" }))` allows your React dev server. If you see "CORS error" in the console, check this first.

## Vite dev proxy (optional)

```js
// vite.config.js
export default {
  server: { proxy: { "/api": "http://localhost:5000" } },
};
```

Then call `/api/...` with no hard-coded host.

## Storing the token

`localStorage` is simple and fine for learning. In production consider **httpOnly cookies**, which JavaScript (and therefore XSS) cannot read.

# LESSON: Deployment and Production Best Practices | 40 min

## Prepare for production

1. Read all configuration from **environment variables**.
2. Set `NODE_ENV=production`.
3. Restrict CORS to your real frontend domain.
4. Add `helmet` and rate limiting.
5. Use a hosted database - **MongoDB Atlas**.

```js
import helmet from "helmet";
import rateLimit from "express-rate-limit";

app.use(helmet());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

## Step 1 - Database on MongoDB Atlas

1. Create a free cluster.
2. Create a database user.
3. Under **Network Access**, allow your host's IP (or `0.0.0.0/0` for learning).
4. Copy the connection string into `MONGO_URI`.

## Step 2 - Deploy the backend

Hosts like **Render**, **Railway** or **Fly.io** can run Node apps straight from GitHub.

- Build command: `npm install`
- Start command: `npm start`
- Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
- Test `https://your-api.onrender.com/api/health`

## Step 3 - Deploy the frontend

**Vercel** or **Netlify**:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-api.onrender.com/api`

> Vite variables are baked in at **build time**. Change one and you must redeploy.

## Step 4 - Connect and verify

Update the backend CORS origin to your frontend URL, then test registration, login and a protected request from the live site.

## Docker (bonus)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Production checklist

- [ ] No secrets in Git
- [ ] HTTPS enabled
- [ ] Input validation on every endpoint
- [ ] Meaningful error messages without stack traces for users
- [ ] Logging and monitoring
- [ ] Database backups
- [ ] README with setup instructions

## Capstone project

Build and deploy a **Task Manager or Course Platform** with registration, login, role-based access, full CRUD and a polished React UI. Put the live link and GitHub repo on your resume.

# QUIZ

Q: In the MERN stack, which technology is responsible for the user interface?
A) MongoDB
B) Express
C) React
D) Node.js
ANSWER: C

Q: Which HTTP method is conventionally used to create a new resource?
A) GET
B) POST
C) PUT
D) DELETE
ANSWER: B

Q: What does express.json() do?
A) Sends JSON to the client
B) Parses JSON request bodies so they are available in req.body
C) Validates JSON schemas
D) Converts JSON to HTML
ANSWER: B

Q: What is Mongoose used for?
A) Styling React components
B) Defining schemas and models for MongoDB in Node.js
C) Hosting a website
D) Hashing passwords
ANSWER: B

Q: Why must passwords be hashed before saving?
A) To make the database smaller
B) So plain-text passwords are never stored, even if the database leaks
C) To speed up login
D) Because MongoDB requires it
ANSWER: B

Q: What does the JWT middleware (protect) do on each request?
A) Creates a new user
B) Verifies the token from the Authorization header and identifies the user
C) Encrypts the response
D) Clears the database
ANSWER: B

Q: A browser shows a "CORS error" when your React app calls your API. What is the most likely fix?
A) Reinstall React
B) Configure the server's CORS settings to allow the frontend's origin
C) Disable JavaScript
D) Use a different database
ANSWER: B

Q: When are Vite environment variables (VITE_*) applied?
A) At runtime on the server
B) At build time, so changes require a rebuild
C) Only in the browser console
D) They are never used
ANSWER: B

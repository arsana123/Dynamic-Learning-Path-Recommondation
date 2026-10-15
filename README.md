# Dynamic Learning Path – MERN Stack Project

React (Vite + Tailwind) frontend · Express 5 + Mongoose backend · MongoDB

## 1. Requirements
- **Node.js 18+** (20 or 22 recommended) – https://nodejs.org
- **MongoDB** – pick ONE:
  - **A. Docker (easiest):** `docker compose up -d`
  - **B. Local install:** install MongoDB Community Server and make sure it's running (`mongod`)
  - **C. MongoDB Atlas (cloud, free):** create a cluster, copy its connection string and paste it
    into `backend/.env` as `MONGO_URI=...`

## 2. Setup (one time)
```bash
npm run install-all        # installs root + backend + frontend dependencies
npm run seed               # loads sample users + all 12 courses  ⚠ wipes existing users & courses
```

## 3. Run
```bash
npm run dev                # starts API (http://localhost:5000) and web app (http://localhost:5173)
```
Open **http://localhost:5173**

Or run them separately in two terminals:
```bash
npm run backend
npm run frontend
```

## Courses included (12 courses · 72 lessons · 96 quiz questions)
Every lesson has full written content with code examples, and every course ends with an 8-question quiz.

| # | Course | Level |
|---|---|---|
| 1 | Introduction to Machine Learning | Beginner |
| 2 | Advanced React Patterns | Advanced |
| 3 | Data Structures & Algorithms | Intermediate |
| 4 | Cloud Architecture with AWS | Intermediate |
| 5 | UI/UX Design Fundamentals | Beginner |
| 6 | Python for Data Analysis | Beginner |
| 7 | JavaScript Essentials | Beginner |
| 8 | SQL & Database Fundamentals | Beginner |
| 9 | Git & GitHub Essentials | Beginner |
| 10 | Full Stack Web Development with MERN | Intermediate |
| 11 | Deep Learning with Neural Networks | Advanced |
| 12 | Docker & DevOps Basics | Intermediate |

Already have users/progress you want to keep? Load or update only the courses (users are untouched):
```bash
npm run seed:courses
```

## Adding or editing course content
Each course is ONE Markdown file in `backend/content/`. Copy an existing file and edit it:

```
---
title: My New Course
description: What students will learn
difficulty: Beginner            (Beginner | Intermediate | Advanced)
duration: 4 weeks
instructor: Your Name
image: https://...
tags: Tag1, Tag2
price: 50
discountPrice: 25
prerequisites: Another Course Title
---

# LESSON: Lesson title | 20 min
Lesson text in Markdown (## headings, lists, tables, ``` code blocks ```)

# QUIZ
Q: Your question?
A) option
B) option
C) option
D) option
ANSWER: B
```
Then run `npm run seed:courses`. (Answer positions are shuffled automatically.)

Lessons can also show a video: set `videoUrl` on a lesson in the database (YouTube links are embedded automatically).

## Sample logins (after `npm run seed`)
| Role    | Email                | Password     |
|---------|----------------------|--------------|
| Admin   | admin@example.com    | admin123     |
| Student | archana@example.com  | password123  |

Make any registered user an admin:  `cd backend && node makeAdmin.js user@example.com`

## Configuration
`backend/.env` (copy from `backend/.env.example`):
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dynamic-learning-path
JWT_SECRET=change_me
JWT_EXPIRE=7d
```
`frontend/.env` (optional – only if you change the API port/URL):
```
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting
| Problem | Fix |
|---|---|
| `Could not connect to MongoDB` | MongoDB isn't running – see step 1 (Docker / local / Atlas) |
| `Port 5000 is already in use` (common on macOS – AirPlay) | Set `PORT=5001` in `backend/.env` and `VITE_API_URL=http://localhost:5001/api` in `frontend/.env` |
| `Cannot find module ...` | Delete all `node_modules` folders and run `npm run install-all` again |
| Login/Register shows "Failed to fetch" | Backend isn't running, or the API URL/port doesn't match |
| Courses page is empty | Run `npm run seed` |
| Lesson says "No written content" | You seeded before this update - run `npm run seed:courses` |

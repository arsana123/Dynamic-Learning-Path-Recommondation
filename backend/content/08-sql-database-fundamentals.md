---
title: SQL & Database Fundamentals
description: Learn to design relational databases and query data with SQL. Cover SELECT, filtering, joins, aggregation, subqueries, database design, indexes and transactions - plus a comparison with MongoDB.
difficulty: Beginner
duration: 5 weeks
instructor: Rahul Verma
image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop
tags: SQL, Database, Backend
rating: 4.7
ratingsCount: 356
enrolledCount: 3380
price: 79
discountPrice: 39
---

# LESSON: Introduction to Databases and Setting Up | 25 min

## What is a database?

A **database** stores data in an organised way so it can be searched, updated and protected. A **DBMS** (database management system) such as PostgreSQL, MySQL or SQLite is the software that manages it.

## Relational databases

Data lives in **tables** (like spreadsheets):

- A **row** (record) is one item, e.g. one student.
- A **column** (field) is one attribute, e.g. `email`.
- A **primary key** uniquely identifies each row, e.g. `id`.
- A **foreign key** links a row to a row in another table.

| id | name | email | course_id |
|---|---|---|---|
| 1 | Asha | asha@mail.com | 10 |
| 2 | Ravi | ravi@mail.com | 11 |

## SQL

**SQL** (Structured Query Language) is the standard language for relational databases. Its parts:

- **DDL** - define structure: `CREATE`, `ALTER`, `DROP`
- **DML** - change data: `INSERT`, `UPDATE`, `DELETE`
- **DQL** - read data: `SELECT`

## Set up quickly

The easiest way to practise is **SQLite** (no server needed) or an online sandbox. With PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE school;
\c school
```

## Create your first tables

```sql
CREATE TABLE courses (
  id    SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  price NUMERIC(8,2) DEFAULT 0
);

CREATE TABLE students (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(80) NOT NULL,
  email     VARCHAR(120) UNIQUE NOT NULL,
  course_id INT REFERENCES courses(id)
);
```

Constraints (`PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `REFERENCES`) protect your data's integrity automatically.

> In SQLite use `INTEGER PRIMARY KEY AUTOINCREMENT` instead of `SERIAL`.

# LESSON: Inserting, Selecting and Filtering Data | 35 min

## INSERT

```sql
INSERT INTO courses (title, price) VALUES
  ('Python Basics', 49),
  ('SQL Essentials', 39),
  ('React Mastery', 79);

INSERT INTO students (name, email, course_id) VALUES
  ('Asha', 'asha@mail.com', 1),
  ('Ravi', 'ravi@mail.com', 2),
  ('Meena', 'meena@mail.com', 2);
```

## SELECT

```sql
SELECT * FROM students;                  -- all columns (avoid in production)
SELECT name, email FROM students;        -- chosen columns
SELECT DISTINCT course_id FROM students; -- unique values
```

## Filtering with WHERE

```sql
SELECT * FROM courses WHERE price > 40;
SELECT * FROM courses WHERE price BETWEEN 30 AND 60;
SELECT * FROM students WHERE name LIKE 'A%';          -- starts with A
SELECT * FROM students WHERE course_id IN (1, 2);
SELECT * FROM students WHERE course_id IS NULL;       -- NULL needs IS, not =
SELECT * FROM courses WHERE price > 30 AND title <> 'SQL Essentials';
```

## Sorting and limiting

```sql
SELECT * FROM courses ORDER BY price DESC;
SELECT * FROM courses ORDER BY price DESC LIMIT 2;
SELECT * FROM courses ORDER BY price DESC LIMIT 2 OFFSET 2;   -- pagination
```

## UPDATE and DELETE

```sql
UPDATE courses SET price = 59 WHERE title = 'React Mastery';
DELETE FROM students WHERE email = 'meena@mail.com';
```

> **Danger:** `UPDATE` or `DELETE` **without** `WHERE` affects **every row**. Run the matching `SELECT` first to check.

## SQL order of writing

```sql
SELECT   columns
FROM     table
WHERE    row filter
GROUP BY groups
HAVING   group filter
ORDER BY sorting
LIMIT    count;
```

# LESSON: Aggregation and Grouping | 30 min

## Aggregate functions

```sql
SELECT COUNT(*)       FROM students;
SELECT SUM(price)     FROM courses;
SELECT AVG(price)     FROM courses;
SELECT MIN(price), MAX(price) FROM courses;
```

`COUNT(column)` ignores NULL values; `COUNT(*)` counts all rows.

## GROUP BY

Collapse rows into groups and aggregate each group.

```sql
SELECT course_id, COUNT(*) AS student_count
FROM students
GROUP BY course_id;
```

Result: one row per course with the number of students.

## HAVING vs WHERE

- `WHERE` filters **rows before** grouping.
- `HAVING` filters **groups after** aggregation.

```sql
SELECT course_id, COUNT(*) AS student_count
FROM students
WHERE email LIKE '%@mail.com'
GROUP BY course_id
HAVING COUNT(*) >= 2
ORDER BY student_count DESC;
```

## Aliases and expressions

```sql
SELECT title,
       price,
       price * 0.8 AS discounted_price,
       UPPER(title) AS shout
FROM courses;
```

## CASE - conditional logic

```sql
SELECT title,
  CASE
    WHEN price >= 70 THEN 'Premium'
    WHEN price >= 40 THEN 'Standard'
    ELSE 'Budget'
  END AS tier
FROM courses;
```

## Useful functions

| Purpose | Examples |
|---|---|
| Text | `LENGTH`, `LOWER`, `UPPER`, `SUBSTRING`, `CONCAT` |
| Numbers | `ROUND`, `CEIL`, `FLOOR`, `ABS` |
| Dates | `NOW()`, `CURRENT_DATE`, `EXTRACT(YEAR FROM date)` |
| NULLs | `COALESCE(col, 'default')` |

# LESSON: Joins and Subqueries | 40 min

Real databases split data over many tables to avoid repetition. **Joins** combine them back together.

## Sample data

`students.course_id` points to `courses.id`.

## INNER JOIN

Only rows with a match in **both** tables.

```sql
SELECT s.name, c.title
FROM students s
INNER JOIN courses c ON s.course_id = c.id;
```

## LEFT JOIN

**All** rows from the left table, plus matches from the right (NULL when there is no match).

```sql
SELECT c.title, COUNT(s.id) AS students
FROM courses c
LEFT JOIN students s ON s.course_id = c.id
GROUP BY c.title;
```

This lists even courses with **zero** students (an INNER JOIN would hide them).

## Join types at a glance

| Join | Returns |
|---|---|
| INNER | Only matching rows |
| LEFT | All left rows + matches |
| RIGHT | All right rows + matches |
| FULL OUTER | All rows from both |
| CROSS | Every combination |

## Many-to-many relationships

Students can take many courses and courses have many students. Use a **junction table**:

```sql
CREATE TABLE enrollments (
  student_id INT REFERENCES students(id),
  course_id  INT REFERENCES courses(id),
  enrolled_on DATE DEFAULT CURRENT_DATE,
  PRIMARY KEY (student_id, course_id)
);

SELECT s.name, c.title
FROM enrollments e
JOIN students s ON s.id = e.student_id
JOIN courses  c ON c.id = e.course_id;
```

## Subqueries

A query inside another query.

```sql
-- courses priced above the average
SELECT title, price
FROM courses
WHERE price > (SELECT AVG(price) FROM courses);

-- students in courses that cost more than 50
SELECT name FROM students
WHERE course_id IN (SELECT id FROM courses WHERE price > 50);
```

## CTEs (WITH)

Make complex queries readable.

```sql
WITH popular AS (
  SELECT course_id, COUNT(*) AS n
  FROM students
  GROUP BY course_id
)
SELECT c.title, p.n
FROM popular p
JOIN courses c ON c.id = p.course_id
ORDER BY p.n DESC;
```

# LESSON: Database Design, Indexes and Transactions | 40 min

## Normalisation

Organising tables to remove duplication and prevent inconsistencies.

- **1NF** - each cell holds a single value (no lists in a column).
- **2NF** - every non-key column depends on the **whole** primary key.
- **3NF** - no non-key column depends on another non-key column.

**Bad design:** a students table repeating the course title and price on every row. Change a price and you must update many rows. **Good design:** store courses once and reference them by id.

## Entity-Relationship (ER) design

1. Find the **entities** (Student, Course, Instructor).
2. Define their **attributes**.
3. Decide **relationships**: one-to-one, one-to-many, many-to-many.
4. Add primary and foreign keys.

## Indexes

An **index** is a sorted lookup structure (usually a B-tree) that makes searches fast, like the index of a book.

```sql
CREATE INDEX idx_students_email ON students(email);

-- see how the database runs a query
EXPLAIN ANALYZE SELECT * FROM students WHERE email = 'asha@mail.com';
```

- Index columns used in `WHERE`, `JOIN` and `ORDER BY`.
- Indexes speed up reads but slow down writes and use space - don't index everything.

## Transactions and ACID

A **transaction** groups several statements into one all-or-nothing unit.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;      -- or ROLLBACK; to undo everything
```

ACID guarantees:

- **Atomicity** - all or nothing
- **Consistency** - rules and constraints always hold
- **Isolation** - concurrent transactions don't interfere
- **Durability** - committed data survives crashes

## SQL injection - a critical security rule

Never build SQL by joining user input into strings.

```js
// DANGEROUS
db.query("SELECT * FROM users WHERE email = '" + email + "'");

// SAFE - parameterised query
db.query("SELECT * FROM users WHERE email = $1", [email]);
```

# LESSON: SQL vs NoSQL and Using Databases from Code | 30 min

## SQL vs NoSQL (e.g. MongoDB)

| | SQL (PostgreSQL, MySQL) | NoSQL document (MongoDB) |
|---|---|---|
| Structure | Tables with fixed schema | Flexible JSON-like documents |
| Relationships | Joins | Embedding or references |
| Transactions | Strong ACID | Supported, but design differs |
| Scaling | Vertical (and read replicas) | Horizontal sharding is natural |
| Best for | Structured, relational data, reporting | Rapidly changing or hierarchical data |

Neither is "better" - choose by data shape and access patterns. Many apps use both.

## The same query in both worlds

```sql
-- SQL
SELECT name, email FROM students WHERE course_id = 2 ORDER BY name;
```

```js
// MongoDB (Mongoose)
await Student.find({ courseId: 2 }).select("name email").sort("name");
```

## Using PostgreSQL from Node.js

```bash
npm install pg
```

```js
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function getStudentsByCourse(courseId) {
  const { rows } = await pool.query(
    "SELECT id, name FROM students WHERE course_id = $1 ORDER BY name",
    [courseId]
  );
  return rows;
}
```

## Using SQL from Python

```python
import sqlite3

conn = sqlite3.connect("school.db")
cur = conn.cursor()
cur.execute("SELECT name FROM students WHERE course_id = ?", (2,))
print(cur.fetchall())
conn.close()
```

## Good habits

1. Always use **parameterised queries**.
2. Name things consistently (`snake_case`, plural tables).
3. Add constraints - let the database protect your data.
4. Back up regularly and test restores.
5. Use migrations (Prisma, Knex, Alembic) to version schema changes.

## Practice project

Design a **library database**: books, authors, members and loans. Create the tables with keys, insert sample data, and write queries to find overdue loans, the most borrowed books and members with no loans.

# QUIZ

Q: What uniquely identifies each row in a table?
A) Foreign key
B) Primary key
C) Index
D) View
ANSWER: B

Q: Which query correctly finds rows where course_id has no value?
A) WHERE course_id = NULL
B) WHERE course_id IS NULL
C) WHERE course_id == NULL
D) WHERE NULL(course_id)
ANSWER: B

Q: What is the difference between WHERE and HAVING?
A) There is no difference
B) WHERE filters rows before grouping; HAVING filters groups after aggregation
C) HAVING filters rows before grouping
D) WHERE only works with numbers
ANSWER: B

Q: Which JOIN returns all rows from the left table even when there is no match on the right?
A) INNER JOIN
B) LEFT JOIN
C) CROSS JOIN
D) SELF JOIN
ANSWER: B

Q: How do you model a many-to-many relationship between students and courses?
A) Add a list of course ids to the students table
B) Use a junction table that holds both foreign keys
C) Duplicate students for each course
D) It is not possible in SQL
ANSWER: B

Q: What is the main purpose of a database index?
A) To encrypt data
B) To make searches faster
C) To remove duplicate rows
D) To back up the table
ANSWER: B

Q: In ACID, what does Atomicity mean?
A) Data is stored in small pieces
B) A transaction either completes entirely or has no effect
C) Transactions never run at the same time
D) Data is compressed
ANSWER: B

Q: What is the safest way to include user input in a SQL query?
A) Concatenate the input into the query string
B) Use a parameterised (prepared) query
C) Remove spaces from the input
D) Convert the input to uppercase
ANSWER: B

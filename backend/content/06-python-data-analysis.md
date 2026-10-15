---
title: Python for Data Analysis
description: Analyze and visualize data using Python, Pandas, and Matplotlib. Go from Python basics to cleaning real datasets, creating charts and completing a full exploratory data analysis project.
difficulty: Beginner
duration: 6 weeks
instructor: Dr. Mark Thompson
image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop
tags: Python, Data, Analytics
rating: 4.7
ratingsCount: 215
enrolledCount: 2150
price: 89
discountPrice: 49
---

# LESSON: Python Basics | 30 min

## Why Python for data?

Python is readable, free, and has a huge ecosystem (NumPy, Pandas, Matplotlib, scikit-learn). It is the most popular language for data work.

## Variables and types

```python
name = "Asha"          # str
age = 24               # int
height = 1.62          # float
is_student = True      # bool

print(type(age))       # <class 'int'>
print(f"{name} is {age} years old")   # f-string formatting
```

Python is **dynamically typed** - you don't declare types - but every value still has one.

## Operators

```python
10 + 3     # 13
10 / 3     # 3.333...   (true division)
10 // 3    # 3          (floor division)
10 % 3     # 1          (remainder)
2 ** 5     # 32         (power)
5 > 3 and 2 < 1   # False
```

## Strings

```python
s = "Data Analysis"
print(s.lower())            # data analysis
print(s.split(" "))         # ['Data', 'Analysis']
print(s[0:4])               # Data
print(len(s))               # 13
print("Data" in s)          # True
```

## Conditions

```python
score = 72
if score >= 90:
    grade = "A"
elif score >= 60:
    grade = "B"
else:
    grade = "C"
print(grade)    # B
```

> **Indentation matters.** Python uses indentation (4 spaces) instead of braces to mark blocks.

## Loops

```python
for i in range(3):
    print(i)            # 0 1 2

n = 0
while n < 3:
    n += 1
```

## Practice

Write a program that prints the numbers from 1 to 20, but prints "even" instead of the number when it's even.

# LESSON: Functions, Lists and Dictionaries | 30 min

## Functions

```python
def average(numbers):
    """Return the mean of a list of numbers."""
    return sum(numbers) / len(numbers)

print(average([4, 8, 6]))   # 6.0

def greet(name, greeting="Hello"):     # default argument
    return f"{greeting}, {name}!"
```

## Lists - ordered and changeable

```python
nums = [5, 3, 8, 1]
nums.append(10)
nums.sort()                 # [1, 3, 5, 8, 10]
print(nums[0], nums[-1])    # 1 10
print(nums[1:3])            # [3, 5]
```

## List comprehensions

A compact way to build lists - used constantly in data work.

```python
squares = [x ** 2 for x in range(1, 6)]            # [1, 4, 9, 16, 25]
evens = [x for x in range(10) if x % 2 == 0]       # [0, 2, 4, 6, 8]
```

## Dictionaries - key/value pairs

```python
student = {"name": "Ravi", "age": 21, "courses": ["Python", "SQL"]}

print(student["name"])                  # Ravi
student["city"] = "Pune"                # add
print(student.get("phone", "N/A"))      # safe lookup with default

for key, value in student.items():
    print(key, "->", value)
```

## Tuples and sets

```python
point = (3, 4)               # tuple: ordered, cannot change
unique = set([1, 2, 2, 3])   # {1, 2, 3} - no duplicates
```

## Reading files

```python
with open("notes.txt") as f:       # 'with' closes the file automatically
    for line in f:
        print(line.strip())
```

## Errors

```python
try:
    value = int("abc")
except ValueError:
    print("That wasn't a number")
```

# LESSON: Pandas Introduction | 35 min

**Pandas** is the main tool for working with tabular data. Its two core objects:

- **Series** - one column (a labelled 1-D array)
- **DataFrame** - a table of columns

## Load a CSV

```python
import pandas as pd

df = pd.read_csv("sales.csv")
```

Assume `sales.csv` has columns: `order_id, date, region, product, quantity, price`.

## First look

```python
df.head()          # first 5 rows
df.tail(3)         # last 3 rows
df.shape           # (rows, columns)
df.columns         # column names
df.dtypes          # data types
df.info()          # types + non-null counts
df.describe()      # count, mean, std, min, max...
```

## Selecting

```python
df["region"]                         # a Series
df[["product", "price"]]             # a DataFrame
df[df["quantity"] > 5]               # filter rows
df[(df["region"] == "West") & (df["price"] > 100)]   # combine with & |
df.loc[0:2, ["product", "price"]]    # by labels
df.iloc[0:2, 0:3]                    # by position
```

## Creating new columns

```python
df["revenue"] = df["quantity"] * df["price"]
```

## Sorting and counting

```python
df.sort_values("revenue", ascending=False).head(10)
df["region"].value_counts()
df["product"].nunique()
```

## Aggregating with groupby

```python
df.groupby("region")["revenue"].sum()

df.groupby("product").agg(
    total_revenue=("revenue", "sum"),
    avg_price=("price", "mean"),
    orders=("order_id", "count"),
).sort_values("total_revenue", ascending=False)
```

This answers business questions like "which product earns the most?" in a few lines.

# LESSON: Cleaning and Transforming Data | 35 min

Real data is messy. Expect missing values, duplicates, wrong types and inconsistent text.

## Missing values

```python
df.isna().sum()                          # how many missing per column

df = df.dropna(subset=["order_id"])      # drop rows missing a key field
df["price"] = df["price"].fillna(df["price"].median())
df["region"] = df["region"].fillna("Unknown")
```

Choose carefully: **drop** when little data is missing, **fill** (mean, median, or a constant) when you want to keep the rows.

## Duplicates

```python
print(df.duplicated().sum())
df = df.drop_duplicates()
```

## Fixing data types

```python
df["date"] = pd.to_datetime(df["date"])
df["quantity"] = df["quantity"].astype(int)
df["price"] = pd.to_numeric(df["price"], errors="coerce")   # bad values -> NaN
```

## Cleaning text

```python
df["region"] = df["region"].str.strip().str.title()
df["product"] = df["product"].str.lower().str.replace("-", " ")
```

## Working with dates

```python
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
df["weekday"] = df["date"].dt.day_name()

monthly = df.groupby(df["date"].dt.to_period("M"))["revenue"].sum()
```

## Outliers

Spot values far from the rest using the IQR rule:

```python
q1, q3 = df["price"].quantile([0.25, 0.75])
iqr = q3 - q1
mask = (df["price"] >= q1 - 1.5 * iqr) & (df["price"] <= q3 + 1.5 * iqr)
clean = df[mask]
```

## Combining tables

```python
customers = pd.read_csv("customers.csv")
merged = df.merge(customers, on="customer_id", how="left")   # like SQL JOIN
```

## Cleaning checklist

1. Inspect with `info()` and `describe()`
2. Handle missing values
3. Remove duplicates
4. Fix types
5. Standardise text
6. Check outliers
7. Save: `df.to_csv("clean_sales.csv", index=False)`

# LESSON: Data Visualization with Matplotlib | 35 min

Charts turn numbers into insight. **Matplotlib** is the foundation of Python plotting.

```python
import matplotlib.pyplot as plt
```

## Line chart - trends over time

```python
monthly = df.groupby(df["date"].dt.to_period("M"))["revenue"].sum()

plt.figure(figsize=(8, 4))
plt.plot(monthly.index.astype(str), monthly.values, marker="o")
plt.title("Monthly Revenue")
plt.xlabel("Month")
plt.ylabel("Revenue")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

## Bar chart - compare categories

```python
by_region = df.groupby("region")["revenue"].sum().sort_values()

by_region.plot(kind="barh", color="teal", title="Revenue by Region")
plt.xlabel("Revenue")
plt.show()
```

## Histogram - distribution of one variable

```python
plt.hist(df["price"], bins=20, edgecolor="black")
plt.title("Price Distribution")
plt.show()
```

## Scatter plot - relationship between two variables

```python
plt.scatter(df["quantity"], df["revenue"], alpha=0.5)
plt.xlabel("Quantity")
plt.ylabel("Revenue")
plt.show()
```

## Subplots

```python
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].hist(df["price"], bins=15)
axes[0].set_title("Price")
axes[1].bar(by_region.index, by_region.values)
axes[1].set_title("Revenue by region")
plt.tight_layout()
plt.show()
```

## Choosing the right chart

| Goal | Chart |
|---|---|
| Trend over time | Line |
| Compare categories | Bar |
| Distribution | Histogram / box plot |
| Relationship | Scatter |
| Parts of a whole (few categories) | Pie (use sparingly) |

## Good chart habits

- Always add a **title** and **axis labels**
- Start bar charts at zero
- Use few colours and keep it uncluttered
- Save for reports: `plt.savefig("chart.png", dpi=150)`

> **Tip:** Seaborn (`pip install seaborn`) builds on Matplotlib and gives nicer statistical charts with less code.

# LESSON: Exploratory Data Analysis Project | 45 min

Time to combine everything in a complete analysis. **EDA (Exploratory Data Analysis)** means investigating a dataset to understand it, find patterns and spot problems before any modelling.

## The project: analyse a sales dataset

Business questions:

1. How much revenue did we make, and how is it trending?
2. Which regions and products perform best?
3. Are there unusual orders?

## Step 1 - Load and inspect

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv")
print(df.shape)
df.info()
print(df.describe())
```

## Step 2 - Clean

```python
df = df.drop_duplicates()
df["date"] = pd.to_datetime(df["date"])
df["price"] = pd.to_numeric(df["price"], errors="coerce")
df = df.dropna(subset=["price", "quantity"])
df["revenue"] = df["quantity"] * df["price"]
```

## Step 3 - Answer the questions

```python
total = df["revenue"].sum()
print(f"Total revenue: {total:,.2f}")

# trend
monthly = df.groupby(df["date"].dt.to_period("M"))["revenue"].sum()
monthly.plot(title="Monthly revenue")
plt.show()

# top products
top = df.groupby("product")["revenue"].sum().nlargest(5)
print(top)

# region share
share = df.groupby("region")["revenue"].sum() / total * 100
print(share.round(1))
```

## Step 4 - Look for relationships

```python
print(df[["quantity", "price", "revenue"]].corr())
```

Correlation ranges from -1 to 1. Values near 1 or -1 indicate a strong linear relationship. **Correlation is not causation.**

## Step 5 - Communicate the findings

Write a short summary a manager can read in a minute:

> Revenue grew steadily over the year with a peak in November. The West region contributes 42% of revenue. Three products make up over half of sales. A small number of very large orders should be checked for data-entry errors.

## What to include in your portfolio

- A clear problem statement
- Cleaned data and the cleaning steps
- 3-5 well-labelled charts
- Written conclusions and recommendations
- A Jupyter Notebook or GitHub repository that others can run

Congratulations - you now have the full workflow of a data analyst: **load, clean, explore, visualise, communicate.**

# QUIZ

Q: What does the expression 10 // 3 evaluate to in Python?
A) 3.33
B) 3
C) 1
D) 30
ANSWER: B

Q: Which of the following creates the list [1, 4, 9, 16]?
A) [x * 2 for x in range(1, 5)]
B) [x ** 2 for x in range(1, 5)]
C) [x + 2 for x in range(1, 5)]
D) {x ** 2 for x in range(1, 5)}
ANSWER: B

Q: Which Pandas call returns the first 5 rows of a DataFrame?
A) df.first()
B) df.top()
C) df.head()
D) df.start()
ANSWER: C

Q: How do you filter rows where quantity is greater than 5?
A) df.filter(quantity > 5)
B) df[df["quantity"] > 5]
C) df.where(quantity > 5)
D) df["quantity" > 5]
ANSWER: B

Q: What does df.groupby("region")["revenue"].sum() return?
A) Total revenue of the whole DataFrame
B) Total revenue for each region
C) The region with the highest revenue
D) A list of regions
ANSWER: B

Q: Which function converts a text column to proper datetime values?
A) pd.to_datetime()
B) pd.date()
C) df.astype(text)
D) pd.parse()
ANSWER: A

Q: Which chart is the best choice for showing a trend over time?
A) Pie chart
B) Line chart
C) Histogram
D) Scatter plot of unrelated variables
ANSWER: B

Q: A correlation of 0.9 between two columns means:
A) One column causes the other
B) They have a strong positive linear relationship, but not necessarily a causal one
C) They are unrelated
D) The data is invalid
ANSWER: B

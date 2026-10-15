---
title: Introduction to Machine Learning
description: Learn the fundamentals of ML algorithms and their applications in real-world scenarios. You will set up Python, work with NumPy and Pandas, and train and evaluate your first model with scikit-learn.
difficulty: Beginner
duration: 8 weeks
instructor: Dr. Sarah Chen
image: https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop
tags: AI, Python, Data Science
rating: 4.8
ratingsCount: 234
enrolledCount: 2340
price: 99
discountPrice: 49
prerequisites: Python for Data Analysis
---

# LESSON: What is Machine Learning? | 20 min

## The big idea

Traditional programming means you write the **rules** and the computer applies them to data to produce answers. In **machine learning (ML)** you flip this around: you give the computer **data and the answers**, and it works out the **rules** by itself.

| Approach | You provide | Computer produces |
|---|---|---|
| Traditional programming | Rules + Data | Answers |
| Machine learning | Data + Answers | Rules (a *model*) |

Imagine writing rules to detect spam: "if the email contains 'free money'..." You would never finish. With ML you show the computer thousands of emails labelled *spam* or *not spam*, and it learns the patterns on its own.

## Key vocabulary

- **Feature** - an input variable (e.g. the number of links in an email).
- **Label / target** - the answer we want to predict (spam or not spam).
- **Model** - the learned function that maps features to a prediction.
- **Training** - the process of fitting the model to data.
- **Inference / prediction** - using the trained model on new data.

## Where ML is used

Recommendations (Netflix, YouTube), fraud detection in banking, voice assistants, medical image analysis, language translation and self-driving cars.

## The ML workflow

1. Define the problem and collect data
2. Clean and explore the data
3. Choose and train a model
4. Evaluate it on data it has never seen
5. Deploy it and monitor it over time

> **Remember:** ML is not magic. A model is only as good as the data it learns from - "garbage in, garbage out".

# LESSON: Types of ML: Supervised vs Unsupervised | 25 min

## Supervised learning

The training data contains **labels**. The model learns to predict the label for new examples.

- **Classification** predicts a category: spam / not spam, disease / healthy. Algorithms: Logistic Regression, Decision Trees, k-NN, Random Forests.
- **Regression** predicts a number: house price, tomorrow's temperature. Algorithms: Linear Regression, Random Forest Regressor.

## Unsupervised learning

There are **no labels**. The model looks for structure on its own.

- **Clustering** groups similar items, e.g. customer segments (k-Means).
- **Dimensionality reduction** compresses many features into fewer ones (PCA).
- **Anomaly detection** finds unusual items such as fraudulent transactions.

## Reinforcement learning

An **agent** interacts with an environment, takes actions, and receives **rewards** or penalties. Over time it learns a strategy (policy) that maximizes total reward. Examples: game-playing AIs and robot control.

## Which one should I use?

| Question | Type |
|---|---|
| Do I have labelled examples and want to predict a category? | Supervised - classification |
| Do I want to predict a number? | Supervised - regression |
| Do I want to discover groups in unlabelled data? | Unsupervised - clustering |
| Does an agent learn by trial and error? | Reinforcement learning |

# LESSON: Setting Up Your Python Environment | 25 min

## Install Python

Download Python 3.10 or newer from python.org. Check your installation:

```bash
python --version
pip --version
```

## Use a virtual environment

A virtual environment keeps each project's libraries separate so versions never clash.

```bash
# create it
python -m venv ml-env

# activate it (macOS / Linux)
source ml-env/bin/activate

# activate it (Windows)
ml-env\Scripts\activate
```

You will see `(ml-env)` at the start of your prompt when it is active.

## Install the core libraries

```bash
pip install numpy pandas matplotlib scikit-learn jupyter
```

## Start Jupyter Notebook

```bash
jupyter notebook
```

A browser tab opens. Click **New - Python 3**, and you can run code in small blocks called *cells* with **Shift + Enter**.

## Check that everything works

```python
import numpy as np
import pandas as pd
import sklearn

print("NumPy:", np.__version__)
print("Pandas:", pd.__version__)
print("scikit-learn:", sklearn.__version__)
```

If this prints three version numbers without errors, you are ready.

> **Tip:** Save your dependencies with `pip freeze > requirements.txt` so anyone can recreate your environment with `pip install -r requirements.txt`.

# LESSON: Introduction to NumPy | 30 min

**NumPy** provides fast multi-dimensional arrays. Almost every ML library is built on top of it.

## Creating arrays

```python
import numpy as np

a = np.array([1, 2, 3, 4])
m = np.array([[1, 2, 3], [4, 5, 6]])

print(a.shape)   # (4,)
print(m.shape)   # (2, 3)
print(np.zeros((2, 2)))
print(np.arange(0, 10, 2))      # [0 2 4 6 8]
print(np.linspace(0, 1, 5))     # 5 evenly spaced numbers
```

## Vectorised operations

Operations apply to every element at once - no loops needed, and it is far faster than plain Python.

```python
prices = np.array([10, 20, 30])
print(prices * 1.18)        # add 18% tax to every price
print(prices.mean())        # 20.0
print(prices.std())         # standard deviation
```

## Indexing and slicing

```python
x = np.array([10, 20, 30, 40, 50])
print(x[0])        # 10
print(x[1:4])      # [20 30 40]
print(x[x > 25])   # boolean mask -> [30 40 50]

m = np.array([[1, 2, 3], [4, 5, 6]])
print(m[1, 2])     # 6
print(m[:, 0])     # first column -> [1 4]
```

## Useful functions

- `np.sum`, `np.mean`, `np.min`, `np.max` - with `axis=0` (columns) or `axis=1` (rows)
- `reshape` - change the shape: `np.arange(6).reshape(2, 3)`
- `np.dot(a, b)` or `a @ b` - matrix multiplication
- `np.random.rand(3, 3)` - random numbers

## Practice

Create a 3x3 matrix of random numbers, then print its column means and the largest value.

# LESSON: Working with Pandas DataFrames | 35 min

**Pandas** gives you the **DataFrame**, a table with labelled rows and columns - like a spreadsheet you can program.

## Creating and loading data

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Asha", "Ravi", "Meena", "Karan"],
    "age": [23, 31, 28, None],
    "city": ["Delhi", "Pune", "Delhi", "Goa"],
    "salary": [50000, 72000, 61000, 58000],
})

# from a file
# df = pd.read_csv("data.csv")
```

## Looking at your data

```python
df.head()        # first 5 rows
df.info()        # column types and missing values
df.describe()    # statistics for numeric columns
df.shape         # (rows, columns)
```

## Selecting data

```python
df["salary"]                       # one column
df[["name", "city"]]               # several columns
df[df["salary"] > 55000]           # filter rows
df.loc[0, "name"]                  # by label
df.iloc[1, 2]                      # by position
```

## Cleaning data

```python
df.isna().sum()                          # count missing values per column
df["age"] = df["age"].fillna(df["age"].mean())   # fill missing ages
df = df.drop_duplicates()
df["salary_k"] = df["salary"] / 1000     # new column
```

## Grouping and aggregating

```python
df.groupby("city")["salary"].mean()
```

This gives the average salary for each city. `groupby` is one of the most powerful tools in data analysis.

> **Why it matters:** around 80% of ML work is preparing data. Strong Pandas skills make you much faster.

# LESSON: Your First Model with scikit-learn | 40 min

Let's train a real classifier on the famous **Iris** dataset: predict a flower's species from its measurements.

## Step 1 - Load the data

```python
from sklearn.datasets import load_iris

iris = load_iris(as_frame=True)
X = iris.data      # features
y = iris.target    # labels (0, 1, 2)
print(X.head())
```

## Step 2 - Split into train and test sets

You must test on data the model has **never seen**, otherwise you only measure memorisation.

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

## Step 3 - Train a model

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)
```

## Step 4 - Predict and evaluate

```python
from sklearn.metrics import accuracy_score, confusion_matrix

pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, pred))
print(confusion_matrix(y_test, pred))
```

You should see accuracy around 0.95 - 1.0.

## Overfitting and underfitting

- **Overfitting** - great on training data, poor on new data (the model memorised noise).
- **Underfitting** - poor on both (the model is too simple).

If training accuracy is much higher than test accuracy, you are probably overfitting. Remedies: more data, a simpler model, regularisation, or cross-validation.

## Try other models

Every scikit-learn model has the same `fit` / `predict` interface, so swapping is easy:

```python
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(random_state=42).fit(X_train, y_train)
print(model.score(X_test, y_test))
```

Congratulations - you have completed the full ML workflow end to end.

# QUIZ

Q: What is the primary goal of supervised learning?
A) To find hidden patterns in data
B) To learn from labeled data and make predictions
C) To reduce dimensionality of data
D) To cluster similar data points
ANSWER: B

Q: Which algorithm is best suited for classification problems?
A) Linear Regression
B) K-Means Clustering
C) Logistic Regression
D) Principal Component Analysis
ANSWER: C

Q: In machine learning, what is a "feature"?
A) The final prediction of the model
B) An input variable used to make predictions
C) The error of the model
D) A type of algorithm
ANSWER: B

Q: Grouping customers into segments without any labels is an example of:
A) Supervised classification
B) Regression
C) Unsupervised clustering
D) Supervised regression
ANSWER: C

Q: Which NumPy expression selects all values in array x that are greater than 25?
A) x.greater(25)
B) x[x > 25]
C) x(>25)
D) filter(x, 25)
ANSWER: B

Q: Which Pandas method gives the count of missing values per column?
A) df.missing()
B) df.null_count()
C) df.isna().sum()
D) df.empty()
ANSWER: C

Q: Why do we split data into training and test sets?
A) To make training faster
B) To evaluate the model on data it has never seen
C) To remove duplicate rows
D) To increase the number of features
ANSWER: B

Q: A model scores 99% on training data but only 60% on test data. What is the most likely problem?
A) Underfitting
B) Overfitting
C) Perfect generalisation
D) Missing labels
ANSWER: B

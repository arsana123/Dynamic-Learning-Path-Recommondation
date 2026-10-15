---
title: Deep Learning with Neural Networks
description: Understand and build neural networks with PyTorch. Learn how networks learn through gradient descent and backpropagation, train models on real data, build CNNs for images and explore transformers and transfer learning.
difficulty: Advanced
duration: 10 weeks
instructor: Dr. Kavita Rao
image: https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop
tags: AI, Deep Learning, Python, PyTorch
rating: 4.8
ratingsCount: 167
enrolledCount: 1730
price: 159
discountPrice: 99
prerequisites: Introduction to Machine Learning
---

# LESSON: Neural Network Fundamentals | 40 min

## From machine learning to deep learning

Classic ML often needs humans to design **features** by hand. **Deep learning** uses neural networks with many layers that learn useful features **automatically** from raw data (pixels, audio, text). It powers image recognition, speech assistants, translation and modern generative AI.

## The neuron

A neuron computes a weighted sum of its inputs, adds a bias, and passes the result through an **activation function**:

```
output = activation( w1*x1 + w2*x2 + ... + wn*xn + b )
```

- **Weights (w)** - how much each input matters; learned during training.
- **Bias (b)** - shifts the output; also learned.

## Layers

- **Input layer** - receives the data (e.g. 784 pixel values).
- **Hidden layers** - transform the data step by step.
- **Output layer** - produces the prediction (e.g. 10 digit probabilities).

A network with at least one hidden layer is a **multi-layer perceptron (MLP)**; "deep" means many hidden layers.

## Activation functions

Without non-linear activations, stacking layers would just be one linear function. Activations let networks learn curves and complex patterns.

| Function | Formula / behaviour | Typical use |
|---|---|---|
| **ReLU** | max(0, x) | Default for hidden layers |
| **Sigmoid** | squashes to 0 - 1 | Binary output |
| **Tanh** | squashes to -1 - 1 | Some recurrent networks |
| **Softmax** | outputs sum to 1 (probabilities) | Multi-class output |

## A forward pass by hand with NumPy

```python
import numpy as np

x = np.array([0.5, -1.2, 3.0])           # input
W1 = np.random.randn(3, 4) * 0.1         # weights: 3 inputs -> 4 hidden neurons
b1 = np.zeros(4)
W2 = np.random.randn(4, 2) * 0.1         # 4 hidden -> 2 outputs
b2 = np.zeros(2)

relu = lambda z: np.maximum(0, z)
softmax = lambda z: np.exp(z - z.max()) / np.exp(z - z.max()).sum()

hidden = relu(x @ W1 + b1)
probs = softmax(hidden @ W2 + b2)
print(probs, probs.sum())                 # two probabilities that sum to 1
```

## Universal approximation

An MLP with enough hidden neurons can approximate any continuous function. The challenge is **finding** the right weights - which is the topic of the next lesson.

# LESSON: How Networks Learn: Loss, Gradient Descent and Backpropagation | 45 min

## Loss functions

A **loss** measures how wrong the predictions are. Training tries to **minimise** it.

| Task | Common loss |
|---|---|
| Regression | Mean Squared Error (MSE) |
| Binary classification | Binary cross-entropy |
| Multi-class classification | Cross-entropy |

```python
import numpy as np

y_true = np.array([3.0, 5.0, 2.5])
y_pred = np.array([2.5, 5.0, 4.0])
mse = np.mean((y_true - y_pred) ** 2)
print(mse)    # 0.8333...
```

## Gradient descent

Imagine standing on a foggy hill and wanting to reach the valley: feel which way is downhill and take a step. The **gradient** is the slope of the loss with respect to each weight. We update:

```
w = w - learning_rate * gradient
```

The **learning rate** is the step size: too large and training overshoots or diverges; too small and it crawls.

## Gradient descent from scratch

Fit a line `y = w*x + b` to data:

```python
import numpy as np

np.random.seed(0)
X = np.linspace(0, 1, 50)
y = 3 * X + 2 + np.random.randn(50) * 0.1

w, b, lr = 0.0, 0.0, 0.5
for epoch in range(500):
    pred = w * X + b
    error = pred - y
    dw = 2 * np.mean(error * X)      # d(loss)/dw
    db = 2 * np.mean(error)          # d(loss)/db
    w -= lr * dw
    b -= lr * db

print(round(w, 2), round(b, 2))       # close to 3 and 2
```

## Backpropagation

A network has millions of weights. **Backpropagation** efficiently computes the gradient of the loss for every weight using the **chain rule** from calculus, working backward from the output layer to the input.

1. **Forward pass** - compute predictions and the loss.
2. **Backward pass** - propagate gradients back through each layer.
3. **Update** - adjust weights using the gradients.

You rarely write this yourself: frameworks like PyTorch do it automatically (**autograd**).

```python
import torch

w = torch.tensor(2.0, requires_grad=True)
x = torch.tensor(3.0)
loss = (w * x - 12) ** 2          # (6 - 12)^2 = 36
loss.backward()                    # computes d(loss)/dw
print(w.grad)                      # tensor(-36.)
```

## Variants of gradient descent

- **Batch** - uses all the data per step (accurate, slow).
- **Stochastic (SGD)** - one example per step (noisy).
- **Mini-batch** - a small batch (e.g. 32 - 256) per step. The standard choice.

## Optimisers

**SGD with momentum** and **Adam** (adaptive learning rates) are the most common. Adam with `lr=1e-3` is an excellent starting point.

# LESSON: Building and Training Networks with PyTorch | 50 min

```bash
pip install torch torchvision
```

## Tensors

```python
import torch

a = torch.tensor([[1., 2.], [3., 4.]])
print(a.shape, a.dtype)
print(a @ a)                          # matrix multiply
print(a.mean(), a.sum(dim=0))

device = "cuda" if torch.cuda.is_available() else "cpu"
a = a.to(device)                      # move to GPU if available
```

## Step 1 - Data

```python
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

tf = transforms.ToTensor()
train_ds = datasets.MNIST("data", train=True, download=True, transform=tf)
test_ds = datasets.MNIST("data", train=False, download=True, transform=tf)

train_dl = DataLoader(train_ds, batch_size=64, shuffle=True)
test_dl = DataLoader(test_ds, batch_size=256)
```

MNIST contains 70,000 images of handwritten digits (28 x 28 pixels).

## Step 2 - Model

```python
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(28 * 28, 128), nn.ReLU(),
            nn.Linear(128, 64), nn.ReLU(),
            nn.Linear(64, 10),            # 10 classes, raw scores (logits)
        )

    def forward(self, x):
        return self.net(x)

model = MLP().to(device)
```

## Step 3 - Loss and optimiser

```python
loss_fn = nn.CrossEntropyLoss()           # includes softmax - give it raw logits
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
```

## Step 4 - The training loop

```python
for epoch in range(5):
    model.train()
    for X, y in train_dl:
        X, y = X.to(device), y.to(device)

        pred = model(X)                    # 1. forward
        loss = loss_fn(pred, y)

        optimizer.zero_grad()              # 2. clear old gradients
        loss.backward()                    # 3. backpropagation
        optimizer.step()                   # 4. update weights

    print(f"epoch {epoch + 1}: last batch loss = {loss.item():.4f}")
```

## Step 5 - Evaluate

```python
model.eval()
correct = 0
with torch.no_grad():                      # no gradients needed
    for X, y in test_dl:
        X, y = X.to(device), y.to(device)
        correct += (model(X).argmax(dim=1) == y).sum().item()

print(f"Test accuracy: {correct / len(test_ds):.2%}")     # about 97%
```

## Save and load

```python
torch.save(model.state_dict(), "mlp.pt")

model2 = MLP()
model2.load_state_dict(torch.load("mlp.pt"))
model2.eval()
```

Remember the five-line rhythm of every PyTorch training step: forward, loss, zero_grad, backward, step.

# LESSON: Training Better: Overfitting, Regularisation and Tuning | 40 min

## Diagnose with learning curves

Track **training** and **validation** loss every epoch.

| Pattern | Diagnosis | Fix |
|---|---|---|
| Both high | Underfitting | Bigger model, train longer, better features |
| Train low, validation high and rising | **Overfitting** | Regularise, more data, simplify |
| Both low and close | Good fit | Done |

Always keep three splits: **train**, **validation** (tune choices) and **test** (final score, used once).

## Regularisation techniques

### Dropout
Randomly switches off neurons during training so the network can't over-rely on any one path.

```python
nn.Sequential(
    nn.Linear(784, 256), nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(256, 10),
)
```

Remember `model.train()` (dropout on) and `model.eval()` (dropout off).

### Weight decay (L2)
```python
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
```

### Early stopping
Stop training when validation loss stops improving for several epochs, and keep the best weights.

### Data augmentation
Create variety by randomly flipping, cropping or rotating images.

```python
train_tf = transforms.Compose([
    transforms.RandomRotation(10),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
])
```

## Batch normalisation

Normalises the activations inside the network, which stabilises and speeds up training.

```python
nn.Sequential(nn.Linear(256, 128), nn.BatchNorm1d(128), nn.ReLU())
```

## Initialisation and learning rate

- PyTorch's default initialisation is a sensible start.
- The **learning rate** is the most important hyperparameter. Try 1e-2, 1e-3, 1e-4.
- Use a **scheduler** to reduce it as training progresses:

```python
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.1)
# call scheduler.step() once per epoch
```

## Debugging checklist

1. Can the model **overfit a tiny batch** (e.g. 10 examples)? If not, there's a bug.
2. Is the loss decreasing at all? Check the learning rate and labels.
3. Did you forget `optimizer.zero_grad()`?
4. Are inputs scaled to a sensible range?
5. Fix the random seed (`torch.manual_seed(42)`) when comparing experiments.

# LESSON: Convolutional Neural Networks for Images | 45 min

## Why not an MLP for images?

Flattening a photo throws away its 2-D structure and requires huge numbers of weights. **Convolutional Neural Networks (CNNs)** exploit two ideas:

- **Local patterns:** edges, textures and shapes are small regions.
- **Weight sharing:** the same small filter slides across the whole image, so the network can find a feature anywhere.

## Convolution and pooling

- A **convolution** applies a small filter (e.g. 3 x 3) across the image producing a **feature map**. Early layers detect edges, deeper layers detect shapes and objects.
- **Pooling** (e.g. max-pool 2 x 2) shrinks the maps, keeping the strongest responses and reducing computation.

Output size of a convolution: `(N - K + 2P) / S + 1` where N is input size, K kernel, P padding, S stride.

## A CNN for MNIST

```python
class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),   # 28 -> 14
            nn.Conv2d(16, 32, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),  # 14 -> 7
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32 * 7 * 7, 128), nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 10),
        )

    def forward(self, x):
        return self.classifier(self.features(x))

model = CNN().to(device)
```

Train it with exactly the same loop as before. You should reach roughly **99%** test accuracy, noticeably better than the MLP with far fewer parameters.

## Famous architectures

| Model | Contribution |
|---|---|
| LeNet | First successful CNN (digits) |
| AlexNet | Started the deep learning boom (2012) |
| VGG | Very deep stacks of 3 x 3 convolutions |
| ResNet | **Skip connections** allow very deep networks to train |
| EfficientNet | Balances depth, width and resolution |

## Transfer learning

Training from scratch needs a lot of data and compute. Instead, reuse a model **pre-trained** on millions of images (ImageNet) and adapt it to your task:

```python
from torchvision import models

model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

for p in model.parameters():          # freeze the pre-trained layers
    p.requires_grad = False

model.fc = nn.Linear(model.fc.in_features, 5)   # new head for 5 classes
optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)
```

With a few hundred images per class this can reach excellent accuracy in minutes. Use ImageNet's normalisation (mean/std) and 224 x 224 inputs for pre-trained models.

# LESSON: Sequence Models, Transformers and Responsible AI | 45 min

## Sequence data

Text, speech, time series and code are **sequences** where order matters.

- **RNN (Recurrent Neural Network)** - processes one step at a time and carries a hidden state. Struggles with long-range dependencies (vanishing gradients).
- **LSTM / GRU** - add gates that control what to remember or forget; handle longer sequences.

```python
class TextClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim=64, hidden=128, classes=2):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden, batch_first=True)
        self.fc = nn.Linear(hidden, classes)

    def forward(self, x):                       # x: (batch, seq_len) of token ids
        out, (h, c) = self.lstm(self.embed(x))
        return self.fc(h[-1])                   # use the final hidden state
```

**Embeddings** turn words (token ids) into dense vectors where similar meanings sit close together.

## Attention and Transformers

RNNs read sequentially, which is slow and forgets. **Attention** lets every position look at every other position directly and decide what is relevant.

```
Attention(Q, K, V) = softmax(Q K^T / sqrt(d)) V
```

The **Transformer** architecture (2017) is built from stacked **self-attention** and feed-forward layers, processes tokens in parallel, and scales extremely well. It is the foundation of BERT, GPT and modern large language models, and is now used for vision and audio too.

## Using pre-trained transformers

The Hugging Face library lets you use state-of-the-art models in a few lines:

```bash
pip install transformers
```

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
print(classifier("I really enjoyed this course!"))
# [{'label': 'POSITIVE', 'score': 0.99...}]
```

**Fine-tuning** a pre-trained transformer on your own labelled data is the standard way to build NLP systems today.

## Choosing an architecture

| Data | Start with |
|---|---|
| Tabular | Gradient boosting / simple MLP |
| Images | CNN or pre-trained vision model |
| Text | Pre-trained transformer |
| Time series | LSTM, temporal CNN or transformer |

## Responsible AI

Models learn from data and **inherit its biases**. As a practitioner:

1. **Check data quality and representation** - who is missing?
2. **Evaluate per group**, not just overall accuracy.
3. Be transparent about limitations; keep a human in the loop for high-stakes decisions.
4. Protect privacy and follow data-licensing rules.
5. Monitor models after deployment - data changes over time (**drift**).

## Next steps

- Reproduce a paper or Kaggle notebook
- Deploy a model with FastAPI or a Hugging Face Space
- Explore generative models (autoencoders, diffusion) and reinforcement learning

You now understand deep learning from neuron to transformer. Keep building!

# QUIZ

Q: Why do neural networks need non-linear activation functions?
A) To make training slower
B) Without them, stacked layers collapse into a single linear function
C) To reduce the number of weights
D) To normalise the data
ANSWER: B

Q: What does the learning rate control?
A) The number of layers
B) The size of each weight update step
C) The batch size
D) The number of classes
ANSWER: B

Q: What is backpropagation used for?
A) Loading data in batches
B) Efficiently computing gradients of the loss for every weight
C) Augmenting images
D) Choosing the activation function
ANSWER: B

Q: Which line in a PyTorch training loop clears old gradients?
A) loss.backward()
B) optimizer.step()
C) optimizer.zero_grad()
D) model.eval()
ANSWER: C

Q: Which loss function is typical for multi-class classification?
A) Mean Squared Error
B) Cross-entropy
C) Hinge ranking loss only
D) Mean absolute percentage
ANSWER: B

Q: Training loss keeps falling but validation loss starts rising. What is happening?
A) Underfitting
B) Overfitting
C) The learning rate is zero
D) The model is perfect
ANSWER: B

Q: What is the main advantage of weight sharing in CNNs?
A) The same filter detects a feature anywhere in the image with far fewer parameters
B) It removes the need for training
C) It makes images larger
D) It replaces activation functions
ANSWER: A

Q: What is transfer learning?
A) Moving a model between GPUs
B) Reusing a model pre-trained on a large dataset and adapting it to a new task
C) Training with no data
D) Converting a CNN into an RNN
ANSWER: B

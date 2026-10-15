---
title: UI/UX Design Fundamentals
description: Create beautiful and user-friendly interfaces with modern design principles. Learn visual design, colour, typography, layout, user research, wireframing and usability testing.
difficulty: Beginner
duration: 5 weeks
instructor: Anna Kim
image: https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop
tags: Design, Figma, UX
rating: 4.8
ratingsCount: 289
enrolledCount: 2890
price: 79
discountPrice: 39
---

# LESSON: Design Principles | 25 min

## UI vs UX

- **UX (User Experience)** is how the product *works and feels* - is it easy, useful and enjoyable to reach a goal?
- **UI (User Interface)** is how the product *looks* - colours, type, buttons, layout.

A beautiful interface that confuses people is a failed design. Good design needs both.

## Core visual principles

### 1. Hierarchy
Guide the eye to what matters most using **size, weight, colour and position**. A page where everything shouts has no hierarchy.

### 2. Contrast
Differences make things stand out: light vs dark, big vs small. Primary buttons should look clearly different from secondary ones.

### 3. Alignment
Align elements to a shared edge or grid. Misalignment looks sloppy even when users can't say why.

### 4. Proximity
Items that are related should be **close together**; unrelated groups need more space between them.

### 5. Repetition and consistency
Reuse the same colours, spacing, buttons and icons everywhere. Users learn once and feel confident.

### 6. White space
Empty space is not wasted - it gives content room to breathe and improves readability.

## Jakob Nielsen's usability heuristics (highlights)

1. **Visibility of system status** - show loading, progress and confirmation.
2. **Match with the real world** - use words users know.
3. **User control and freedom** - provide undo and easy exits.
4. **Consistency and standards** - follow conventions.
5. **Error prevention** - design so mistakes are hard to make.
6. **Recognition rather than recall** - show options instead of making people remember.

## Exercise

Pick an app you use daily. Identify one place where hierarchy is good and one where it is confusing, and sketch a fix.

# LESSON: Color Theory | 30 min

## The colour wheel

- **Primary:** red, blue, yellow
- **Secondary:** green, orange, purple
- **Tertiary:** mixes between them

## Colour properties (HSL)

| Property | Meaning |
|---|---|
| **Hue** | The colour itself (0-360 degrees on the wheel) |
| **Saturation** | Intensity - vivid vs grey |
| **Lightness** | How light or dark |

Designers often work in HSL because changing lightness gives consistent tints and shades.

## Colour harmonies

- **Monochromatic** - one hue in different lightness values; calm and safe.
- **Analogous** - neighbours on the wheel; harmonious.
- **Complementary** - opposites on the wheel; high contrast, great for call-to-action buttons.
- **Triadic** - three evenly spaced hues; vibrant, harder to balance.

## The 60-30-10 rule

A reliable proportion for an interface:

- **60%** dominant (background / neutrals)
- **30%** secondary (cards, sections)
- **10%** accent (buttons, links, highlights)

## Meaning and culture

Colours carry associations: blue suggests trust (banks), green suggests success or health, red suggests danger or urgency. Meanings vary between cultures, so research your audience.

## Accessibility - contrast ratio

Text must be readable by people with low vision or colour blindness. WCAG recommends a contrast ratio of at least:

- **4.5 : 1** for normal text
- **3 : 1** for large text and UI components

Never rely on colour alone - a red error field should also have an icon or message.

```css
:root {
  --bg: hsl(222 20% 10%);
  --text: hsl(210 20% 96%);
  --accent: hsl(172 66% 50%);
  --danger: hsl(0 84% 60%);
}
```

## Building a palette

1. Choose one brand/accent colour.
2. Add a neutral scale (greys) for backgrounds and text.
3. Add semantic colours: success, warning, error, info.
4. Generate shades (50 - 900) for each, and test contrast.

# LESSON: Typography | 30 min

Around 90% of most interfaces is text, so typography is a core design skill.

## Anatomy and key terms

- **Typeface** - the design family (Inter); **font** - a specific style/weight of it (Inter Bold).
- **Serif** (has small strokes, e.g. Georgia) feels traditional; **sans-serif** (e.g. Inter, Roboto) feels modern and clean on screens.
- **Line height (leading)** - space between lines.
- **Letter spacing (tracking)** - space between letters.

## Practical rules

1. **Limit yourself to 1-2 typefaces.** Use weight and size to create variety.
2. **Body text size:** at least 16px on the web.
3. **Line height:** about 1.4 - 1.6 for paragraphs.
4. **Line length:** 50 - 75 characters per line is the most readable.
5. **Left-align** long text; avoid centring paragraphs.
6. Avoid all caps for long text.

## A type scale

Pick a ratio and grow sizes consistently (for example 1.25):

| Role | Size |
|---|---|
| Caption | 12px |
| Body | 16px |
| H3 | 20px |
| H2 | 25px |
| H1 | 31px |

```css
body {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}
h1 { font-size: 2rem;  line-height: 1.2; font-weight: 700; }
h2 { font-size: 1.5rem; line-height: 1.3; font-weight: 600; }
p  { max-width: 65ch; }
```

## Hierarchy through type

Combine size, weight and colour: a bold dark heading, medium-grey subheading, regular body. Make sure the difference is obvious.

## Exercise

Take a block of text from a website, re-set it with the rules above, and compare the readability before and after.

# LESSON: Layout, Spacing and Grids | 30 min

## The 8-point spacing system

Use multiples of **8** (8, 16, 24, 32, 48, 64) for margins, padding and sizes. It keeps spacing consistent and makes design-to-code handoff simple.

## Grids

A grid divides the page into **columns** with **gutters** (gaps) and **margins**.

- Desktop: commonly **12 columns**
- Tablet: **8 columns**
- Mobile: **4 columns**

```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
.main    { grid-column: span 8; }
.sidebar { grid-column: span 4; }
```

## Responsive design

People use phones, tablets, laptops and big monitors. Design **mobile first**: start with the smallest screen (the most constrained), then add enhancements as space grows.

| Breakpoint | Typical width |
|---|---|
| Mobile | up to 640px |
| Tablet | 768px |
| Laptop | 1024px |
| Desktop | 1280px+ |

## Common layout patterns

- **F-pattern** - people scan text-heavy pages from the top-left in an F shape; put key content there.
- **Cards** - group related content into self-contained blocks.
- **Navigation** - bottom tab bar on mobile, top or side bar on desktop.

## Touch targets

Buttons and links should be at least **44 x 44 px** so fingers can tap accurately.

## Components and design systems

Build reusable pieces - buttons, inputs, cards, modals - and document their states: default, hover, focus, active, disabled, error. A shared **design system** keeps large products consistent and speeds up development.

# LESSON: UX Research and User Flows | 35 min

## Start with the user, not the screen

Great design solves a real problem for real people. Research helps you find out **who** they are and **what** they need.

## Research methods

| Method | What you learn |
|---|---|
| **User interviews** | Motivations, pain points, behaviour |
| **Surveys** | Opinions at scale (what, not why) |
| **Observation** | What users actually do |
| **Competitor analysis** | What exists and what is missing |
| **Analytics** | Where users drop off |

### Interview tips

- Ask **open questions**: "Tell me about the last time you booked a trip."
- Avoid leading questions: not "Don't you think this is easy?"
- Listen more than you talk; ask "why?" often.

## Personas

A **persona** is a realistic, fictional profile built from research.

> **Priya, 24, student.** Goal: find affordable study courses. Frustration: too many choices, unclear prices. Uses: phone, mostly during commute.

Use personas to keep the team focused on real needs.

## Problem statement

> Busy students need a way to find the right course quickly because browsing long lists wastes their limited study time.

## User journey and user flow

- A **journey map** shows the user's steps, thoughts and emotions across an experience, highlighting opportunities.
- A **user flow** is a diagram of the screens and decisions needed to complete a task.

```
Open app -> Search course -> Course page -> Logged in?
                                    |-- No  -> Sign up -> Enroll
                                    |-- Yes -> Enroll -> Start lesson
```

Aim to **minimise steps** to the goal. Every extra tap loses users.

## Information architecture

Organise content so it is findable: group related items, label clearly, keep menus short. **Card sorting** (asking users to group topics) reveals how people expect things to be organised.

# LESSON: Wireframing, Prototyping and Usability Testing | 40 min

## The design process

1. **Empathise** - research users
2. **Define** - the problem
3. **Ideate** - sketch many ideas
4. **Prototype** - make it testable
5. **Test** - with real users, then repeat

## Fidelity levels

| Level | Description | Use |
|---|---|---|
| **Sketch** | Paper or whiteboard | Explore ideas quickly |
| **Low-fi wireframe** | Grey boxes showing structure and layout | Agree on layout and content |
| **High-fi mockup** | Real colours, type, images | Final visual design |
| **Interactive prototype** | Clickable screens | Test flows before coding |

Start low-fidelity. It is cheap to change and keeps feedback focused on structure instead of colours.

## Working in Figma

- **Frames** represent screens (choose a device preset, e.g. iPhone 14).
- **Auto layout** makes components resize and space themselves like CSS flexbox.
- **Components and variants** let you reuse a button in many states.
- **Styles / variables** store colours and text styles so you can change them in one place.
- **Prototype mode** connects frames with interactions (on click -> navigate to).

Handy shortcuts: `F` frame, `R` rectangle, `T` text, `Shift + A` add auto layout, `Ctrl/Cmd + D` duplicate.

## Usability testing

Ask 5 people to complete realistic tasks with your prototype while you observe.

1. Write 3-5 **tasks** ("Find a beginner Python course and enrol").
2. Ask participants to **think aloud**.
3. Do **not** help or explain - note where they struggle.
4. Record **success rate**, **time on task** and **errors**.
5. Prioritise the problems and fix the biggest ones first.

Testing with just **5 users** typically uncovers around 80% of usability problems.

## Handoff to developers

Provide spacing, sizes, colours, fonts, states and exported assets. Use Figma **Dev Mode** or inspect panels. Good handoff reduces back-and-forth and keeps the build faithful to the design.

## Portfolio project

Redesign one screen of an app you use: document the problem, your research, wireframes, final UI and test results. This case study is what employers want to see.

# QUIZ

Q: What does UX primarily describe?
A) The colours used in an interface
B) How the product works and feels to the user
C) The fonts in an app
D) The code behind an app
ANSWER: B

Q: Which principle says related elements should be placed close together?
A) Contrast
B) Proximity
C) Repetition
D) Hierarchy
ANSWER: B

Q: In the 60-30-10 rule, what does the 10% usually represent?
A) Background colour
B) Secondary colour
C) Accent colour
D) Text colour
ANSWER: C

Q: What is the WCAG minimum contrast ratio for normal body text?
A) 2 : 1
B) 3 : 1
C) 4.5 : 1
D) 10 : 1
ANSWER: C

Q: What is a comfortable line length for reading on the web?
A) 10 - 20 characters
B) 50 - 75 characters
C) 120 - 150 characters
D) As wide as the screen
ANSWER: B

Q: What does "mobile first" mean?
A) Only design for mobile devices
B) Start with the smallest screen, then enhance for larger ones
C) Build the mobile app before the website is ever planned
D) Use mobile-only fonts
ANSWER: B

Q: Which research question is better for a user interview?
A) "Don't you think this app is easy to use?"
B) "Tell me about the last time you booked a course online."
C) "Would you buy this?"
D) "Is the blue button good?"
ANSWER: B

Q: Roughly how many test users usually reveal most major usability problems?
A) 1
B) 5
C) 50
D) 500
ANSWER: B

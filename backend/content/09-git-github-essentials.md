---
title: Git & GitHub Essentials
description: Master version control with Git and collaborate using GitHub. Learn commits, branches, merging, remotes, pull requests, undoing mistakes and the workflows used by professional development teams.
difficulty: Beginner
duration: 3 weeks
instructor: Neha Kapoor
image: https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop
tags: Git, GitHub, DevOps
rating: 4.9
ratingsCount: 478
enrolledCount: 5120
price: 49
discountPrice: 19
---

# LESSON: Version Control and Setting Up Git | 25 min

## The problem Git solves

Without version control you end up with files like `project_final_v2_REALLY_final.zip`. **Git** tracks every change to your files, lets you go back to any earlier version, and lets many people work on the same project without overwriting each other.

- **Git** is the tool that runs on your computer (a *distributed* version control system).
- **GitHub** is a website that hosts Git repositories and adds collaboration features (pull requests, issues, actions). GitLab and Bitbucket are alternatives.

## Install and configure

Download Git from git-scm.com, then check:

```bash
git --version
```

Tell Git who you are (used in every commit):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --list
```

## Key concepts

| Term | Meaning |
|---|---|
| **Repository (repo)** | A project folder tracked by Git |
| **Commit** | A saved snapshot of your project with a message |
| **Branch** | An independent line of development |
| **Remote** | A copy of the repo hosted elsewhere (e.g. GitHub) |
| **HEAD** | A pointer to your current commit/branch |

## The three areas

```
Working directory  --git add-->  Staging area  --git commit-->  Repository
 (your files)                  (what will be saved)             (history)
```

You choose exactly which changes go into each commit by **staging** them first.

## Create your first repository

```bash
mkdir my-project
cd my-project
git init
```

Git creates a hidden `.git` folder - that is the entire history. You're ready to start tracking.

# LESSON: The Core Workflow: add, commit, status, log | 30 min

## Make a change and check status

```bash
echo "# My Project" > README.md
git status
```

`git status` shows untracked and modified files - use it constantly.

## Stage and commit

```bash
git add README.md          # stage one file
git add .                  # stage everything in this folder
git commit -m "Add README"
```

Write messages in the imperative mood and explain **what and why**: `Fix login redirect bug`, not `stuff` or `changes`.

## View history

```bash
git log
git log --oneline
git log --oneline --graph --all
git show <commit-id>
```

## See what changed

```bash
git diff                 # unstaged changes
git diff --staged        # staged changes
git diff HEAD~1          # compare with previous commit
```

## .gitignore

Some files should never be tracked: dependencies, secrets, build output. Create a `.gitignore`:

```
node_modules/
dist/
.env
*.log
.DS_Store
```

> **Never commit secrets** (passwords, API keys, `.env` files). Once pushed, assume they are compromised.

## Daily rhythm

1. Edit files
2. `git status` and `git diff` to review
3. `git add` the relevant files
4. `git commit -m "clear message"`

**Commit small and often** - each commit should do one logical thing. It makes history readable and bugs easier to find.

## Practice

Create a folder with 3 files, make 4 separate commits, then use `git log --oneline` to view them.

# LESSON: Branching and Merging | 35 min

A **branch** lets you work on a feature or fix in isolation without breaking the main code.

## Working with branches

```bash
git branch                    # list branches
git switch -c feature/login   # create AND switch to a new branch
git switch main               # go back
git branch -d feature/login   # delete a merged branch
```

(`git checkout` does the same job in older tutorials.)

## A feature branch workflow

```bash
git switch -c feature/navbar
# ...edit files...
git add .
git commit -m "Add responsive navbar"
git switch main
git merge feature/navbar
```

## Types of merge

- **Fast-forward** - main has no new commits, so Git simply moves the pointer forward.
- **Merge commit** - both branches have new commits; Git creates a commit joining them.

## Merge conflicts

A conflict happens when two branches change the **same lines**. Git can't decide, so it asks you. The file will contain markers:

```
<<<<<<< HEAD
const title = "Welcome";
=======
const title = "Hello there";
>>>>>>> feature/navbar
```

To resolve:

1. Open the file and decide what the final code should be.
2. Delete the `<<<<<<<`, `=======` and `>>>>>>>` lines.
3. Stage and finish:

```bash
git add src/title.js
git commit
```

Don't panic - conflicts are normal. Abort a merge at any time with `git merge --abort`.

## Rebase (a quick introduction)

`git rebase main` replays your branch's commits on top of the latest main, producing a straight, linear history.

> **Golden rule:** never rebase commits that you have already pushed and shared with others.

## Branch naming

Use clear prefixes: `feature/search-bar`, `fix/login-error`, `docs/readme-update`.

# LESSON: Remotes and GitHub | 35 min

## Create a GitHub repository

1. Sign in to GitHub, click **New repository**.
2. Choose a name; don't add files if you already have a local project.
3. Copy the repository URL.

## Connect and push

```bash
git remote add origin https://github.com/yourname/my-project.git
git branch -M main
git push -u origin main
```

`-u` links your local `main` to `origin/main`, so later you can just run `git push`.

## Authentication

GitHub no longer accepts account passwords for Git. Use either:

- **HTTPS with a Personal Access Token** (or the GitHub CLI / Git Credential Manager), or
- **SSH keys**:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub      # paste this into GitHub -> Settings -> SSH keys
ssh -T git@github.com
```

## Clone, fetch, pull

```bash
git clone https://github.com/someone/project.git    # download a repo
git fetch                                            # get new commits, don't merge
git pull                                             # fetch + merge
git push                                             # upload your commits
git remote -v                                        # list remotes
```

## Keeping in sync

Before you start work each day: `git pull`. Before you push: `git pull` again, so you integrate teammates' changes first.

## Make your profile shine

- Write a clear **README.md** (what it is, screenshots, how to install and run).
- Add a **LICENSE** (MIT is popular).
- Use meaningful commit messages and descriptive repo names.
- Pin your best projects on your profile - recruiters do look.

## GitHub Pages

Free hosting for static sites: **Settings -> Pages -> choose the branch** and your site goes live at `yourname.github.io/repo`.

# LESSON: Collaboration: Forks, Pull Requests and Code Review | 35 min

## Pull requests (PRs)

A **pull request** asks the team to review and merge your branch. It is the heart of modern collaboration.

### The workflow

```bash
git switch main && git pull
git switch -c fix/button-color
# ...make changes...
git add .
git commit -m "Fix primary button contrast"
git push -u origin fix/button-color
```

Then on GitHub click **Compare & pull request**, describe the change, and request reviewers.

## Writing a good PR

- A clear **title**: `Fix primary button contrast`
- A description: **what** changed, **why**, and how to test it
- Link the issue: `Closes #12` closes it automatically on merge
- Keep PRs **small** - they get reviewed faster and more carefully
- Add screenshots for UI changes

## Code review etiquette

**As an author:** be open to feedback; reply to every comment; push fixes to the same branch.

**As a reviewer:** be kind and specific; critique the code, not the person; ask questions ("what happens if this is null?"); approve when it's good enough, not perfect.

## Contributing to open source (fork workflow)

When you don't have write access to a repo:

1. **Fork** the project to your account.
2. Clone **your fork**.
3. Add the original as `upstream`:

```bash
git remote add upstream https://github.com/original/project.git
git fetch upstream
git switch -c fix/typo
```

4. Commit, push to your fork, open a PR to the original.
5. Keep your fork updated: `git pull upstream main`.

## Issues and project boards

Use **Issues** to track bugs and tasks, **labels** to categorise them (`bug`, `good first issue`), and **Projects** to organise a board of work. Look for `good first issue` to start contributing.

## Protecting main

Teams enable **branch protection** so that main requires a reviewed PR and passing checks before merging.

# LESSON: Undoing Mistakes and Professional Best Practices | 35 min

Everybody makes mistakes. Git makes them recoverable - if you know the right tool.

## Undo changes in your working directory

```bash
git restore file.txt              # discard unstaged changes (cannot be undone!)
git restore --staged file.txt     # unstage a file, keep the edits
```

## Fix the last commit

```bash
git commit --amend -m "Better message"          # change the message
git add forgotten.js && git commit --amend --no-edit   # add a forgotten file
```

Only amend commits that you have **not pushed**.

## Undo commits

| Command | Effect | Safe for shared branches? |
|---|---|---|
| `git revert <id>` | Creates a **new commit** that reverses an old one | Yes |
| `git reset --soft HEAD~1` | Removes the commit, keeps changes staged | Local only |
| `git reset --mixed HEAD~1` | Removes the commit, keeps changes unstaged | Local only |
| `git reset --hard HEAD~1` | Removes the commit **and** the changes | Local only - dangerous |

## git stash - pause your work

```bash
git stash                  # save uncommitted work and clean the directory
git switch other-branch    # do something urgent
git switch -                # come back
git stash pop              # restore the work
```

## git reflog - the safety net

`git reflog` lists everywhere HEAD has been. Even after a bad reset, you can find the old commit and recover:

```bash
git reflog
git reset --hard <commit-id-from-reflog>
```

## Remove a committed secret

If you pushed a password or API key: **revoke and rotate it immediately.** Removing it from history is secondary - it should be treated as leaked.

## Best practices

1. Commit small, focused changes with clear messages.
2. Pull before you push; branch for every feature or fix.
3. Never commit secrets, large binaries, or `node_modules`.
4. Don't force-push shared branches.
5. Review your own diff before every commit.

### Conventional commit messages

```
feat: add course search
fix: correct progress calculation
docs: update README setup steps
refactor: split auth middleware
```

## Cheat sheet

```bash
git status / git add . / git commit -m "msg"
git switch -c name / git merge name
git pull / git push
git log --oneline --graph
git stash / git stash pop
```

Congratulations - you can now work confidently in any team that uses Git!

# QUIZ

Q: What is the difference between Git and GitHub?
A) They are the same thing
B) Git is the version control tool; GitHub is a hosting and collaboration platform
C) GitHub is a text editor
D) Git only works on GitHub
ANSWER: B

Q: Which command stages all changes in the current folder?
A) git commit .
B) git add .
C) git push .
D) git stage-all
ANSWER: B

Q: Which command creates a new branch and switches to it?
A) git branch new
B) git switch -c new
C) git merge new
D) git clone new
ANSWER: B

Q: What causes a merge conflict?
A) Using too many branches
B) Two branches changing the same lines of a file
C) A missing .gitignore
D) Committing too often
ANSWER: B

Q: What does git pull do?
A) Uploads commits to the remote
B) Fetches remote changes and merges them into your current branch
C) Deletes the remote branch
D) Creates a new repository
ANSWER: B

Q: What should you do if you accidentally pushed an API key to GitHub?
A) Delete the file and ignore it
B) Revoke and rotate the key immediately
C) Make the repo private and do nothing else
D) Rename the commit
ANSWER: B

Q: Which command safely undoes a commit that has already been pushed to a shared branch?
A) git reset --hard
B) git revert
C) git commit --amend
D) git stash
ANSWER: B

Q: In the fork workflow, what is "upstream"?
A) Your personal fork
B) The original repository you forked from
C) A local branch
D) The staging area
ANSWER: B

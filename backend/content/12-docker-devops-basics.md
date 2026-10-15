---
title: Docker & DevOps Basics
description: Learn how professional teams build, ship and run software. Containerise applications with Docker, run multi-container apps with Compose, automate testing and deployment with GitHub Actions CI/CD, and deploy to a Linux server with Nginx.
difficulty: Intermediate
duration: 6 weeks
instructor: Vikram Singh
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop
tags: Docker, DevOps, CI/CD, Linux
rating: 4.7
ratingsCount: 198
enrolledCount: 2260
price: 109
discountPrice: 59
prerequisites: Git & GitHub Essentials
---

# LESSON: Containers and Docker Fundamentals | 35 min

## The "works on my machine" problem

An app runs on your laptop but fails on the server because of a different OS, Node version or missing library. A **container** packages the application **with everything it needs** (code, runtime, libraries, settings) so it runs identically anywhere.

## Containers vs virtual machines

| | Virtual machine | Container |
|---|---|---|
| Includes | A full guest operating system | Only the app and its dependencies |
| Size | Gigabytes | Megabytes |
| Startup | Minutes | Seconds or less |
| Isolation | Strong (own kernel) | Process-level (shares host kernel) |

## Docker vocabulary

- **Image** - a read-only template (the "recipe" + ingredients) used to create containers.
- **Container** - a running instance of an image.
- **Dockerfile** - a text file with instructions for building an image.
- **Registry** - a place to store images (Docker Hub, GitHub Container Registry, AWS ECR).
- **Volume** - persistent storage outside the container.

## Install and verify

Install **Docker Desktop** (Windows/macOS) or Docker Engine (Linux), then:

```bash
docker --version
docker run hello-world
```

## Essential commands

```bash
docker pull nginx                      # download an image
docker run -d -p 8080:80 --name web nginx   # run in background, map port 8080 -> 80
docker ps                              # running containers
docker ps -a                           # all containers
docker logs web                        # view output
docker exec -it web sh                 # open a shell inside
docker stop web                        # stop it
docker rm web                          # remove it
docker images                          # list images
docker rmi nginx                       # remove an image
```

Open `http://localhost:8080` - you are running Nginx without installing it.

## Port mapping

`-p HOST:CONTAINER` connects a port on your machine to a port in the container. A container's ports are **not** reachable from outside until you publish them.

## Run a database in seconds

```bash
docker run -d --name mongo -p 27017:27017 mongo:7
```

That is a full MongoDB server - ideal for local development.

## Clean up

```bash
docker system prune          # remove stopped containers and unused data
```

# LESSON: Writing Dockerfiles | 40 min

## A Dockerfile for a Node.js API

```dockerfile
FROM node:20-alpine

WORKDIR /app

# copy dependency files first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev

# then copy the source code
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
```

### Instruction reference

| Instruction | Purpose |
|---|---|
| `FROM` | Base image to start from |
| `WORKDIR` | Set the working directory |
| `COPY` | Copy files from your machine into the image |
| `RUN` | Run a command **at build time** (install packages) |
| `ENV` | Set environment variables |
| `EXPOSE` | Document the port the app uses |
| `CMD` | Default command **when the container starts** |

## Build and run

```bash
docker build -t my-api:1.0 .
docker run -d -p 5000:5000 --env-file .env --name api my-api:1.0
docker logs -f api
```

## Layer caching

Every instruction creates a **layer**, and Docker reuses unchanged layers. That is why `package.json` is copied and dependencies installed **before** copying the rest of the code: when only your code changes, the slow `npm ci` layer is reused.

## .dockerignore

Keep images small and secrets out:

```
node_modules
.git
.env
Dockerfile
npm-debug.log
```

## Multi-stage builds - a React frontend

Build with Node, serve with a tiny Nginx image. Only the final stage is shipped.

```dockerfile
# stage 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# stage 2: serve static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

The final image is tens of megabytes instead of hundreds.

## Best practices

1. Use specific tags (`node:20-alpine`), not `latest`.
2. Prefer small base images (alpine, slim).
3. Run as a **non-root user** (`USER node`).
4. One process per container.
5. Never bake secrets into an image - pass them at runtime.

## Publishing an image

```bash
docker login
docker tag my-api:1.0 yourname/my-api:1.0
docker push yourname/my-api:1.0
```

# LESSON: Docker Compose: Multi-Container Applications | 40 min

Real apps have several parts: frontend, API, database. **Docker Compose** defines and runs them together with one file and one command.

## A MERN stack in docker-compose.yml

```yaml
services:
  mongo:
    image: mongo:7
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db

  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      MONGO_URI: mongodb://mongo:27017/myapp
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mongo

  web:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  mongo-data:
```

## Key ideas

- **Service names are hostnames.** Inside the network the API reaches the database at `mongo`, not `localhost`.
- **Volumes** keep data when containers are removed - without one, your database vanishes with the container.
- **`depends_on`** controls start order (it does not wait for the service to be *ready*; add a healthcheck for that).
- **`${JWT_SECRET}`** is read from a `.env` file next to the compose file.

## Commands

```bash
docker compose up -d            # build (if needed) and start everything
docker compose ps
docker compose logs -f api
docker compose exec api sh
docker compose up -d --build    # rebuild after code changes
docker compose down             # stop and remove containers
docker compose down -v          # ... and delete volumes (erases data!)
```

## A healthcheck

```yaml
mongo:
  image: mongo:7
  healthcheck:
    test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
    interval: 10s
    timeout: 5s
    retries: 5

api:
  depends_on:
    mongo:
      condition: service_healthy
```

## Development tip - bind mounts

Mount your source folder into the container so code changes appear instantly:

```yaml
api:
  volumes:
    - ./backend:/app
    - /app/node_modules
  command: npm run dev
```

## Networks

Compose creates a private network automatically, so only services you publish with `ports:` are exposed to the outside. Keep databases **unpublished** in production.

# LESSON: CI/CD with GitHub Actions | 40 min

## What are CI and CD?

- **Continuous Integration (CI)** - every push is automatically built and tested, so problems are found within minutes.
- **Continuous Delivery/Deployment (CD)** - every change that passes is automatically released (or ready to release).

Benefits: fewer bugs, faster releases, no manual error-prone deployments.

## GitHub Actions concepts

| Term | Meaning |
|---|---|
| **Workflow** | An automated process defined in YAML |
| **Event** | What triggers it (push, pull request, schedule) |
| **Job** | A group of steps running on one machine (a *runner*) |
| **Step** | One command or reusable *action* |
| **Secret** | An encrypted value stored in repo settings |

Workflows live in `.github/workflows/`.

## A CI workflow for a Node project

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run tests
        working-directory: backend
        run: npm test --if-present

      - name: Build frontend
        working-directory: frontend
        run: |
          npm ci
          npm run build
```

Push this file and open the **Actions** tab to watch it run. Add a status badge to your README.

## Build and push a Docker image (CD)

```yaml
  docker:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/my-api:latest
```

`needs: test` makes this job wait until tests pass.

## Secrets

Add them under **Settings -> Secrets and variables -> Actions**. Reference them as `${{ secrets.NAME }}`. They are masked in logs - **never print them**.

## Good pipeline habits

1. Keep the pipeline **fast** (cache dependencies).
2. **Fail early** - lint and unit tests first.
3. Require the pipeline to pass before merging (branch protection).
4. The same artifact should move through environments - build once, deploy many.

# LESSON: Linux, Nginx and Deploying to a Server | 40 min

## Essential Linux commands

```bash
pwd                      # where am I
ls -la                   # list files with details
cd /var/www              # change directory
mkdir app && cd app
cat file.txt             # show a file
nano file.txt            # edit a file
cp a.txt b.txt && mv b.txt c.txt && rm c.txt
grep "error" app.log     # search text
tail -f app.log          # follow a log live
chmod 600 key.pem        # change permissions
sudo apt update && sudo apt install -y nginx
ps aux | grep node       # find processes
df -h && free -m         # disk and memory
```

## Permissions in 30 seconds

`-rwxr-xr--` means owner can read/write/execute, group can read/execute, others can only read. Numbers: `r=4, w=2, x=1`, so `755 = rwxr-xr-x` and `600 = rw-------`.

## SSH into a server

```bash
ssh -i my-key.pem ubuntu@203.0.113.10
```

Use **key-based** login and disable password login. Keep the firewall tight:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Deploy with Docker on the server

```bash
# install Docker (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

git clone https://github.com/yourname/my-app.git
cd my-app
docker compose up -d --build
```

## Nginx as a reverse proxy

Nginx receives requests on ports 80/443 and forwards them to your app. It also serves static files efficiently and handles HTTPS.

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;      # support React Router
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo nginx -t                    # test config
sudo systemctl reload nginx
```

## Free HTTPS with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

Certificates renew automatically.

## Keep the app running

Containers with `restart: unless-stopped` (or a process manager like **PM2**) restart automatically after crashes and reboots.

```bash
pm2 start server.js --name api
pm2 save && pm2 startup
```

# LESSON: Monitoring, Security and DevOps Practices | 35 min

## You can't fix what you can't see

Monitor four things (the "golden signals"): **latency**, **traffic**, **errors** and **saturation** (how full your resources are).

## Logging

- Write logs to **stdout**; let Docker or the platform collect them.
- Use structured logs (JSON) with timestamp, level and request id.
- Don't log passwords, tokens or personal data.

```bash
docker compose logs -f --tail=100 api
```

## Health checks

Expose an endpoint like `/api/health` and let your platform or load balancer check it:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:5000/api/health || exit 1
```

## Monitoring tools

| Need | Popular tools |
|---|---|
| Metrics and dashboards | Prometheus + Grafana |
| Logs | ELK / Loki / CloudWatch |
| Uptime alerts | UptimeRobot, Better Stack |
| Error tracking | Sentry |

Set **alerts** on things that matter to users (error rate, response time), not on every small blip.

## Security basics

1. **Least privilege** for users, containers and tokens.
2. Keep **secrets** out of Git and images - use environment variables or a secrets manager.
3. **Update** base images and dependencies regularly; scan them (`docker scout`, `npm audit`, Dependabot).
4. Expose only needed ports; keep databases private.
5. Use HTTPS everywhere.
6. Back up data - and **test restoring** it.

## Infrastructure as Code

Define servers and networks in files (Terraform, CloudFormation, Ansible) instead of clicking in a console. The result is repeatable, reviewable in Git and easy to recreate.

## The twelve-factor mindset (highlights)

- One codebase, many deploys
- Configuration in environment variables
- Treat backing services (databases) as attached resources
- Stateless processes
- Logs as event streams
- Dev and production as similar as possible

## DevOps culture

DevOps is not just tools - it is developers and operations sharing responsibility for the whole lifecycle: **plan, code, build, test, release, deploy, operate, monitor**. Key habits are automation, small frequent releases, fast feedback and **blameless post-mortems** that focus on fixing systems, not blaming people.

## Capstone

Take any app (for example the MERN project from this platform) and:

1. Write Dockerfiles for the frontend and backend
2. Create a `docker-compose.yml` including MongoDB
3. Add a GitHub Actions workflow that tests and builds on every push
4. Deploy to a cloud VM behind Nginx with HTTPS
5. Add a health check and uptime monitor

Document each step in your README - this is a standout portfolio project.

# QUIZ

Q: What is the difference between a Docker image and a container?
A) They are the same thing
B) An image is a read-only template; a container is a running instance of it
C) A container is a template; an image is running
D) Images only exist in registries
ANSWER: B

Q: What does -p 8080:80 do in docker run?
A) Sets the memory limit
B) Maps port 8080 on the host to port 80 in the container
C) Runs 80 copies of the container
D) Opens a shell
ANSWER: B

Q: Why do we COPY package.json and run npm install before copying the rest of the code in a Dockerfile?
A) It is required by Docker syntax
B) To take advantage of layer caching so dependencies are not reinstalled on every code change
C) To make the image run faster
D) To hide the source code
ANSWER: B

Q: What is the main benefit of a multi-stage build?
A) Running many containers at once
B) The final image contains only what is needed to run the app, making it smaller
C) It makes builds slower but safer
D) It removes the need for a Dockerfile
ANSWER: B

Q: In Docker Compose, how does the api service reach a database service called mongo?
A) Using localhost
B) Using the service name mongo as the hostname
C) Using the host's public IP
D) It cannot
ANSWER: B

Q: What happens to database data stored inside a container if you remove the container and used no volume?
A) It is automatically saved
B) It is lost
C) It moves to Docker Hub
D) It is encrypted
ANSWER: B

Q: What does Continuous Integration (CI) mean?
A) Deploying manually once a month
B) Automatically building and testing every change that is pushed
C) Writing documentation continuously
D) Integrating hardware devices
ANSWER: B

Q: Where should API keys and passwords used by a GitHub Actions workflow be stored?
A) In the workflow YAML file
B) In the repository's encrypted Secrets
C) In the README
D) In a public gist
ANSWER: B

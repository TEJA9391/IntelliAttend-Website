# IntelliAttend Team Protocol

> **This document is the single source of truth for how the IntelliAttend team works.**
> Every team member must read this before making their first commit.

---

## 1. Welcome

IntelliAttend is a K-12 school attendance system used by real schools. Teachers mark attendance per period, SmartBoards display live classroom status, and parents receive automatic notifications when their child is marked absent. Students do NOT carry phones.

You are building software that affects real students and teachers. Every bug matters. Every deployment matters. This protocol exists to make sure we ship quality code, consistently.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     IntelliAttend-Server                         │
│                     (FastAPI / Python 3.11)                      │
│                     api.intelliattend.app                        │
│                                                                  │
│  PostgreSQL ─── Redis ─── Firebase (Auth + FCM) ─── R2 (S3)    │
└────────┬──────────────┬──────────────┬──────────────┬───────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  AdminPanel  │ │ SmartBoard   │ │ Faculty App  │ │ Student App  │
│  React/Vite  │ │ Flutter/Win  │ │ Flutter/Mob  │ │ Flutter/Mob  │
│  Dashboard   │ │ Classroom    │ │ Teacher phone│ │ (not deployed│
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

┌──────────────┐
│  IntelliAttend-Web │
│  Next.js Marketing │
│  www.intelliattend.com │
└──────────────┘
```

**Data flow:** SmartBoard/Faculty App → Server API → PostgreSQL → Admin Panel reads via API.

---

## 3. Repository Map

| Repo | Purpose | Tech Stack | Primary Use |
|------|---------|-----------|-------------|
| **IntelliAttend-Server** | Central API server | Python 3.11, FastAPI, PostgreSQL, Redis, Firebase | Backend |
| **IntelliAttend-AdminPanel** | Admin dashboard | React 19, TypeScript, Vite 8, MUI, Tailwind | Web admin |
| **IntelliAttend-SmartBoard** | Classroom kiosk app | Flutter 3.44, Dart, Windows desktop | SmartBoard device |
| **IntelliAttend-Faculty-Mobile-App** | Teacher mobile app | Flutter, Dart, Android/iOS | Faculty phone |
| **IntelliAttend-Student-Mobile-App** | Student mobile app | Flutter, Dart, Android/iOS | Student phone (not deployed) |
| **IntelliAttend-Web** | Marketing website | Next.js 16, TypeScript, Three.js | www.intelliattend.com |

---

## 4. First Day Setup

### Prerequisites

Install these on your MacBook:

```bash
# Python 3.11
brew install python@3.11

# Node.js 18+
brew install node

# PostgreSQL 16
brew install postgresql@16
brew services start postgresql@16

# Redis (for Server)
brew install redis
brew services start redis

# Flutter SDK (for SmartBoard/Mobile)
# Download from https://flutter.dev/docs/get-started/install/macos

# GitHub CLI
brew install gh
gh auth login
```

### Clone & Setup

```bash
# Clone all repos
mkdir -p ~/Dev/IntelliAttend && cd ~/Dev/IntelliAttend
git clone git@github.com:IntelliAttend/IntelliAttend-Server.git
git clone git@github.com:IntelliAttend/IntelliAttend-AdminPanel.git
# Clone others as needed for your role
```

### Server Setup

```bash
cd IntelliAttend-Server/backend

# Create virtual environment
python3.11 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy env template
cp ../.env.dev.example .env
# Edit .env with your local database credentials

# Create database
createdb intelliattend_school

# Run migrations
alembic upgrade head

# Start server
uvicorn main:app --port 8000 --reload
# Server runs at http://localhost:8000
```

### AdminPanel Setup

```bash
cd IntelliAttend-AdminPanel

# Install dependencies
npm install

# Create local env (points Vite proxy to localhost:8000)
cat > .env.local << EOF
VITE_PROXY_TARGET=http://localhost:8000
EOF

# Start dev server
npm run dev
# Admin panel runs at http://localhost:5173
```

### SmartBoard Setup (Windows only)

```bash
cd IntelliAttend-SmartBoard

# Get Flutter SDK 3.44.6+
flutter pub get

# Run in dev mode
flutter run -d windows
```

### Verify Everything Works

1. Server: `curl http://localhost:8000/health` → `{"status":"ok"}`
2. Admin Panel: Open `http://localhost:5173` → login page appears
3. SmartBoard: Window opens with boot screen

---

## 5. Development Workflow

### Branch Naming

```
feature/<your-name>/<short-description>
fix/<your-name>/<short-description>
chore/<your-name>/<short-description>
```

**Examples:**
- `feature/rahul/attendance-export-csv`
- `fix/teja/session-timezone-display`
- `chore/sohail/update-dependencies`

**Why your name?** So we know who's working on what and can resolve conflicts quickly.

### The Flow

```
1. Create branch off school-dev
   git checkout school-dev && git pull
   git checkout -b feature/your-name/your-feature

2. Make changes, commit, push
   git add .
   git commit -m "feat: add CSV export to reports"
   git push origin feature/your-name/your-feature

3. Open PR → school-dev (NOT school-main)
   Go to GitHub, create PR targeting school-dev

4. Wait for review + approval
   Bala reviews and approves

5. Merge to school-dev
   Your code is now on the dev branch

6. After validation → Bala creates PR to school-main
   This goes to production
```

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(reports): add CSV export to attendance reports
fix(server): correct timezone handling in session engine
chore(deps): update FastAPI to 0.115.0
docs(readme): update setup instructions
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`

---

## 6. Coding Standards

### Python (Server)

```bash
# Linting — must pass before PR
ruff check backend/
ruff format backend/ --check

# Type checking
cd backend && mypy app/ --ignore-missing-imports

# Tests
pytest
```

- Use type hints on all functions
- No `# type: ignore` unless absolutely necessary (and add a comment why)
- No hardcoded URLs, ports, or credentials

### TypeScript (AdminPanel)

```bash
# Type checking — MUST use this command (not tsc --noEmit)
npx tsc -b

# Lint
npm run lint

# Build
npm run build
```

- Strict TypeScript — no `any` types
- Use path aliases (`@features/*`, `@shared/*`)
- No hardcoded API URLs — use `apiClient` from `@config/apiClient`

### Dart (SmartBoard / Mobile)

```bash
# Analysis
dart analyze lib/

# Tests
flutter test

# Format
dart format lib/ --set-exit-if-changed
```

- Follow Dart style guide
- Use `const` constructors where possible
- No `print()` — use the project's logger

### General Rules

- **Never commit secrets** — no API keys, passwords, tokens, certificates
- **Never commit `.env` files** — they're gitignored for a reason
- **No hardcoded URLs** — use environment variables or config files
- **Delete branches after merging** — keep the repo clean
- **Pull with rebase** — always `git pull --rebase origin school-dev` before pushing

---

## 7. Testing Requirements

### Before Opening a PR

Every PR must pass these checks:

| Check | Server | AdminPanel | SmartBoard |
|-------|--------|-----------|------------|
| Linting | `ruff check` | `npm run lint` | `dart analyze lib/` |
| Type check | `mypy app/` | `npx tsc -b` | `dart analyze lib/` |
| Tests | `pytest` | — | `flutter test` |
| Build | `docker build` | `npm run build` | `flutter build windows` |

### Manual Testing Checklist

Before requesting review, verify:

- [ ] Feature works as expected in the UI
- [ ] No regressions in existing features
- [ ] Edge cases handled (empty states, errors, loading)
- [ ] Works with local database (not just mock data)
- [ ] No console errors or warnings

### CI Checks (Automated)

These run on every PR and push to `school-dev` / `school-main`:

**Server:** Lint → Type Check → Test → Security Scan → Docker Build
**AdminPanel:** Lint & Type Check → Build
**SmartBoard:** Dart Analyze → Flutter Test

**All CI checks must pass before a PR can be merged.**

---

## 8. Pull Request Process

### Creating a PR

1. Push your branch to GitHub
2. Go to the repo → "Pull requests" → "New pull request"
3. Select your branch → target `school-dev` (NOT `school-main`)
4. Fill in the PR template (see below)
5. Add Bala as reviewer

### PR Template

```markdown
## Summary
<!-- One sentence: what does this PR change? -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / optimization
- [ ] Infrastructure / CI / tooling
- [ ] Documentation

## How to Test
<!-- Step-by-step instructions to verify this works -->

1. Pull this branch
2. Run `...`
3. Click on `...`
4. Verify `...`

## Screenshots
<!-- If UI changes, include before/after screenshots -->

## Checklist
- [ ] Code follows project conventions
- [ ] Self-reviewed the diff
- [ ] No secrets or credentials committed
- [ ] Local testing passed
- [ ] CI checks pass (lint, typecheck, tests)
- [ ] Branch is up to date with school-dev
```

### Code Review

- **Bala reviews all PRs** before they merge to `school-dev`
- Reviewer will approve, request changes, or comment
- Address all feedback before re-requesting review
- Do NOT self-merge your own PR

### After Merge

- Delete your feature branch
- Pull latest `school-dev`: `git checkout school-dev && git pull`
- Your code will be included in the next production deployment

---

## 9. Deployment

### school-dev (Development)

- Auto-deploys on every merge to `school-dev`
- **Server:** Runs on local MacBook (not deployed — test locally)
- **AdminPanel:** Cloudflare Pages preview → dev API (`api-dev.balaseetharamanjaneyulu.com`)
- **SmartBoard:** No auto-deploy (manual build for testing)

### school-main (Production)

- **Only Bala merges to `school-main`**
- Guard job in CI rejects direct pushes (except `(#hotfix)` emergencies)
- Deployment happens automatically on merge:
  - **Server:** DigitalOcean droplet → `api.intelliattend.app`
  - **AdminPanel:** Cloudflare Pages → `dashboard.intelliattend.app`
  - **SmartBoard:** GitHub Release → auto-update on SmartBoard devices

### What Happens on Production Deploy

1. CI guard job verifies PR discipline
2. Database backup (server only)
3. Code is deployed
4. Health checks verify the deployment
5. Automatic rollback if health checks fail

### Emergency Hotfix

If you need to push directly to `school-main`:

1. Add `(#hotfix)` to your commit message
2. Push directly
3. **Immediately** port the fix back to `school-dev` via PR
4. Document what happened

---

## 10. Getting Help

### Who to Ask

| Question | Ask |
|----------|-----|
| Architecture / design decisions | Bala |
| Server / backend issues | Bala |
| AdminPanel / frontend issues | Bala |
| SmartBoard / Flutter issues | Bala |
| Database / migration questions | Bala |
| Deployment / infrastructure | Bala |
| Git / workflow questions | Bala |

### Where to Find Docs

| Document | Location |
|----------|----------|
| Project context | `PROJECT_CONTEXT.md` (root) |
| Server architecture | `IntelliAttend-Server/docs/architecture/` |
| Database schema | `IntelliAttend-Server/docs/database/DATABASE.md` |
| API contracts | `IntelliAttend-Server/docs/contracts/` |
| SmartBoard architecture | `IntelliAttend-SmartBoard/docs/ARCHITECTURE.md` |
| Branching strategy | `IntelliAttend-Server/docs/BRANCHING_STRATEGY.md` |

### How to Report Bugs

1. Check if the bug already exists in GitHub Issues
2. If not, create a new issue with:
   - Clear title: `[Server] Session timezone displays incorrectly`
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment (OS, browser, app version)

---

## 11. Rules (Non-Negotiable)

These rules exist for a reason. No exceptions.

### 1. Never Push to `school-main`

All changes go through: `feature/*` → PR → `school-dev` → PR → `school-main`.

The CI guard job enforces this. If you somehow bypass it, the deployment will fail.

### 2. Never Commit Secrets

No API keys, passwords, tokens, certificates, or `.env` files. If you accidentally commit a secret:
1. Remove it immediately
2. Rotate the secret (it's compromised)
3. Tell Bala

### 3. Always Pull with Rebase

```bash
git pull --rebase origin school-dev
```

This prevents merge commits and keeps history clean. The auto-deploy workflow pushes version bumps frequently, so you WILL get merge conflicts if you don't rebase.

### 4. Delete Branches After Merging

```bash
git branch -d feature/your-name/your-feature
git push origin --delete feature/your-name/your-feature
```

Stale branches confuse everyone.

### 5. Test Before You PR

Never open a PR with code you haven't tested locally. CI catches some things, but it can't catch everything. Your local testing is the first line of defense.

---

## Quick Reference

```bash
# Start a new feature
git checkout school-dev && git pull
git checkout -b feature/your-name/your-feature

# Work on your feature
# ... make changes ...

# Before pushing
ruff check backend/          # Server
npx tsc -b                   # AdminPanel
dart analyze lib/            # SmartBoard

# Commit and push
git add .
git commit -m "feat: your description"
git push origin feature/your-name/your-feature

# Open PR on GitHub → target school-dev
# Wait for review → address feedback → merge

# After merge
git checkout school-dev && git pull
git branch -d feature/your-name/your-feature
```

---

*Last updated: 2026-09-13*
*Maintained by: BalaSeethaRamanjaneyulu*

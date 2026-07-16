# IntelliAttend Collaboration Guide

## Overview

Welcome to the IntelliAttend project! This guide explains how to safely contribute **cosmetic-only changes** (UI, themes, assets) without risking the core app logic.

---

## Repository Structure

```
IntelliAttend/
├── lib/
│   ├── Core/           # DO NOT TOUCH - Core business logic
│   ├── Data/           # DO NOT TOUCH - Data models and repositories
│   ├── Services/       # DO NOT TOUCH - Backend services
│   ├── engine/         # DO NOT TOUCH - App engine/initialization
│   ├── Theme/          # SAFE TO EDIT - App themes and styles
│   ├── presentation/   # SAFE TO EDIT - UI screens and widgets
│   └── main.dart       # DO NOT TOUCH - App entry point
├── assets/             # SAFE TO EDIT - Images, fonts, etc.
├── .github/            # GitHub config (PR template, CODEOWNERS)
└── ...
```

---

## What You CAN Edit

| Directory | Purpose | Examples |
|-----------|---------|----------|
| `lib/presentation/screens/` | App screens/pages | Login screen, home screen |
| `lib/presentation/widgets/` | Reusable UI components | Buttons, cards, dialogs |
| `lib/Theme/` | Colors, typography, styles | `app_theme.dart` |
| `assets/images/` | Image assets | Icons, backgrounds |
| `assets/fonts/` | Custom fonts | Google Fonts files |

## What You CANNOT Edit

| Directory | Reason |
|-----------|--------|
| `lib/Core/` | Core business logic |
| `lib/Data/` | Data models and repositories |
| `lib/Services/` | Backend service integrations |
| `lib/engine/` | App initialization engine |
| `main.dart` | App entry point |

---

## Contribution Workflow

### Step 1: Fork the Repository
1. Go to the IntelliAttend GitHub repo
2. Click the **Fork** button (top-right)
3. This creates a copy under your GitHub account

### Step 2: Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/IntelliAttend.git
cd IntelliAttend
```

### Step 3: Read the Guides
- **QUICK_START.md** — 1-minute setup
- **This file** — Full collaboration details

### Step 4: Create a Feature Branch
```bash
git checkout -b cosmetic/your-feature-name
```

Branch naming convention: `cosmetic/` prefix (e.g., `cosmetic/dark-mode-toggle`, `cosmetic/new-login-screen`)

### Step 5: Make Your Changes
- Edit ONLY files in `lib/presentation/`, `lib/Theme/`, or `assets/`
- Follow the existing code style
- Test your changes locally with `flutter run`

### Step 6: Commit & Push
```bash
git add .
git commit -m "cosmetic: describe your change"
git push origin cosmetic/your-feature-name
```

### Step 7: Open a Pull Request
1. Go to your fork on GitHub
2. Click **Compare & pull request**
3. Fill out the PR template checklist
4. Submit the PR

### Step 8: Review Process
- The repo owner will review your PR
- You may be asked to make changes
- Once approved, your PR will be merged

---

## Safety Features

| Protection | Status | Description |
|-----------|--------|-------------|
| Read-only access | Active | Collaborators cannot push directly to main |
| CODEOWNERS | Active | Repo owner must review all PRs |
| PR template | Active | Enforces cosmetic-only checklist |
| Branch protection | Recommended | Requires PR for all changes |

---

## Code Style

- Follow existing patterns in the codebase
- Use meaningful variable/function names
- Keep widgets small and composable
- Prefer `const` constructors where possible
- Use `flutter analyze` before committing

---

## Getting Help

- Open a GitHub Discussion for questions
- Tag the repo owner in PRs for review
- Reference this guide if unsure about what you can edit

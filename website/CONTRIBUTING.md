# Contributing to IntelliAttend Web

Thank you for your interest in contributing to IntelliAttend! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 20.x (see `.nvmrc`)
- npm 10.x or later
- Git
- Cloudflare account (for deployment)

### Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone
   git clone https://github.com/YOUR_USERNAME/IntelliAttend-Web.git
   cd IntelliAttend-Web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

5. **Verify setup**
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New features | `feat/dark-mode` |
| `fix/` | Bug fixes | `fix/login-redirect` |
| `docs/` | Documentation | `docs/api-reference` |
| `refactor/` | Code refactoring | `refactor/auth-flow` |
| `test/` | Tests | `test/navbar-component` |
| `chore/` | Maintenance | `chore/update-deps` |

### Development Process

1. **Create a branch from `main`**
   ```bash
   git checkout -b feat/your-feature
   ```

2. **Make your changes**
   - Write code following our [Code Standards](#code-standards)
   - Add tests if applicable
   - Update documentation if needed

3. **Verify your changes**
   ```bash
   npm run lint        # Fix linting issues
   npm run typecheck   # Ensure type safety
   npm run build       # Verify build passes
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add dark mode toggle"
   ```

5. **Push and create a PR**
   ```bash
   git push origin feat/your-feature
   ```

## Code Standards

### TypeScript

- Use strict TypeScript (`strict: true` in tsconfig)
- Avoid `any` types - use proper type definitions
- Define interfaces in `src/types/`
- Export types from `src/types/index.ts`

### React

- Use functional components with hooks
- Keep components small and focused (single responsibility)
- Use proper prop types with interfaces
- Avoid inline styles - use Tailwind CSS classes
- Use `"use client"` directive only when needed

### File Structure

```
src/
├── app/              # Routes only - minimal logic
├── components/       # Reusable UI components
│   ├── ui/          # Base primitives (button, card, etc.)
│   ├── layout/      # Layout components (navbar, footer)
│   └── [feature]/   # Feature-specific components
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── config/          # Constants and configuration
└── lib/             # Utility functions
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `HeroSection.tsx` |
| Hooks | camelCase with `use` | `useMediaQuery.ts` |
| Utils | camelCase | `cn.ts` |
| Types | PascalCase | `index.ts` |
| Constants | UPPER_SNAKE_CASE | `NAV_LINKS` |
| Files | PascalCase for components | `HeroSection.tsx` |
| Files | camelCase for others | `useMediaQuery.ts` |

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow the design system in `globals.css`
- Use semantic color tokens (e.g., `text-primary`, `bg-secondary`)
- Keep responsive design mobile-first

### Testing

- Write tests for critical functionality
- Use descriptive test names
- Test edge cases and error states
- Aim for meaningful coverage, not 100%

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add OAuth login` |
| `fix` | Bug fix | `fix(navbar): resolve mobile menu` |
| `docs` | Documentation | `docs: update API reference` |
| `style` | Formatting, no code change | `style: fix indentation` |
| `refactor` | Code restructuring | `refactor: extract auth hook` |
| `test` | Adding tests | `test: add navbar tests` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `perf` | Performance improvements | `perf: optimize image loading` |
| `ci` | CI/CD changes | `ci: add Cloudflare deploy` |
| `revert` | Revert commit | `revert: undo auth changes` |

### Examples

```bash
# Simple feature
git commit -m "feat: add dark mode toggle"

# Feature with scope
git commit -m "feat(auth): implement OAuth login"

# Bug fix with body
git commit -m "fix(navbar): resolve mobile menu not closing

- Added click outside handler
- Fixed z-index stacking issue
- Closes #123"

# Breaking change
git commit -m "feat(api)!: change authentication flow

BREAKING CHANGE: Auth token format changed from JWT to opaque"
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Build passes locally
- [ ] Branch is up to date with `main`

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. **Automated checks** must pass (lint, typecheck, build)
2. **At least one review** required from a maintainer
3. **Address feedback** promptly
4. **Squash and merge** for clean history

### After Merge

- Delete your feature branch
- Update local `main` branch
- Deploy happens automatically via CI/CD

## Reporting Issues

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

### Feature Requests

Include:
- Clear description of the feature
- Use case / motivation
- Proposed solution (if any)
- Alternatives considered

### Security Issues

**Do NOT open public issues for security vulnerabilities.**

See [SECURITY.md](SECURITY.md) for responsible disclosure process.

## Questions?

- Check existing [issues](https://github.com/IntelliAttend/IntelliAttend-Web/issues)
- Start a [discussion](https://github.com/IntelliAttend/IntelliAttend-Web/discussions)
- Email: dev@intelliattend.app

---

Thank you for contributing to IntelliAttend!

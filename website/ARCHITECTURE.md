# Architecture Overview

This document describes the technical architecture of the IntelliAttend Web application.

## Table of Contents

- [System Overview](#system-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Data Flow](#data-flow)
- [Deployment](#deployment)
- [Performance](#performance)
- [Security](#security)

## System Overview

IntelliAttend Web is a modern, server-rendered web application built with Next.js. It serves as the public-facing website and marketing platform for the IntelliAttend intelligent campus management system.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN (Cloudflare)                      │
│                    DDoS Protection + Edge Cache               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                           │
│              Static Site + Server Functions                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   App Router │  │  Components │  │   Static    │         │
│  │   (Pages)   │  │   (UI)      │  │   Assets    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 | React framework with App Router |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Animation** | Framer Motion | Declarative animations |
| **3D** | React Three Fiber | 3D product visualizations |
| **Forms** | React Hook Form + Zod | Form management & validation |
| **Charts** | Recharts | Data visualization |
| **Deployment** | Cloudflare Pages | Global CDN hosting |

## Project Structure

```
IntelliAttend-Web/
├── .github/                    # GitHub configuration
│   ├── workflows/             # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   ├── CODEOWNERS             # Code ownership
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                     # Static assets
│   └── images/               # Image assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (portal)/         # Dashboard pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── ui/               # Base UI primitives
│   │   ├── home/             # Homepage sections
│   │   ├── auth/             # Auth components
│   │   ├── portal/           # Dashboard components
│   │   └── [feature]/        # Feature modules
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   ├── config/                # Configuration constants
│   └── lib/                   # Utility functions
├── .github/workflows/         # CI/CD pipelines
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── wrangler.toml              # Cloudflare configuration
└── package.json               # Dependencies and scripts
```

## Key Components

### App Router Structure

The application uses Next.js App Router with route groups:

- **`(marketing)/`** - Public marketing pages (no auth required)
- **`(auth)/`** - Authentication pages (login, register)
- **`(portal)/`** - Protected dashboard pages

### Component Hierarchy

```
RootLayout
├── SmoothScrollProvider
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   └── CTA Buttons
├── <main>
│   └── [Page Content]
│       └── [Feature Components]
└── Footer
    ├── Navigation Links
    ├── Social Links
    └── Legal Links
```

### Component Categories

| Category | Purpose | Example |
|----------|---------|---------|
| `ui/` | Base primitives | Button, Card |
| `layout/` | Structure components | Navbar, Footer |
| `home/` | Homepage sections | HeroSection, AIFeatures |
| `auth/` | Authentication | AnimatedMap, SignInDemo |
| `portal/` | Dashboard widgets | Stats, Charts |
| `[feature]/` | Feature modules | PricingCards, BlogHero |

## Data Flow

### Client-Side Data

```
User Interaction
      │
      ▼
React Component
      │
      ▼
State Update (useState/useReducer)
      │
      ▼
Re-render
      │
      ▼
DOM Update
```

### Form Handling

```
User Input
      │
      ▼
React Hook Form
      │
      ├─► Zod Validation
      │         │
      │         ▼
      │    Error Messages
      │
      └─► Valid Data
                │
                ▼
         Submit Handler
                │
                ▼
         API Call / State Update
```

## Deployment

### CI/CD Pipeline

```
Push to main
      │
      ▼
GitHub Actions
      │
      ├─► Lint (ESLint)
      ├─► Type Check (TypeScript)
      ├─► Build (Next.js)
      │
      ▼
Deploy to Cloudflare Pages
      │
      ▼
Live at www.intelliattend.app
```

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `CLOUDFLARE_API_TOKEN` | Deployment authentication | Yes (CI) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account | Yes (CI) |

## Performance

### Optimization Strategies

1. **Static Generation** - Pre-rendered pages at build time
2. **Image Optimization** - Next.js Image component with CDN
3. **Code Splitting** - Automatic chunking by route
4. **Font Optimization** - Next.js font loading
5. **Bundle Analysis** - Regular dependency audits

### Core Web Vitals

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | Optimized |
| FID | < 100ms | Optimized |
| CLS | < 0.1 | Optimized |

## Security

### Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Best Practices

1. Input validation with Zod schemas
2. XSS protection via React's built-in escaping
3. HTTPS enforcement
4. Secure dependency management
5. Regular security audits

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

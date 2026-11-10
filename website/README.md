<div align="center">

# IntelliAttend Web

**The official website for IntelliAttend - Intelligent Attendance. Smart Campus.**

[![CI](https://github.com/IntelliAttend/IntelliAttend-Web/actions/workflows/ci.yml/badge.svg)](https://github.com/IntelliAttend/IntelliAttend-Web/actions/workflows/ci.yml)
[![Deploy](https://github.com/IntelliAttend/IntelliAttend-Web/actions/workflows/deploy.yml/badge.svg)](https://github.com/IntelliAttend/IntelliAttend-Web/actions/workflows/deploy.yml)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

[![Website](https://img.shields.io/badge/Website-www.intelliattend.app-2DD4BF)](https://www.intelliattend.app)

</div>

---

## Overview

IntelliAttend Web is the official marketing website for the IntelliAttend intelligent campus management platform. Built with modern web technologies, it showcases the SmartBoard, Faculty, and Student products with interactive 3D visualizations and a beautiful, responsive design.

### Features

- **Interactive 3D Product Showcases** - React Three Fiber-powered product visualizations
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Framer Motion + GSAP for fluid interactions
- **Performance Optimized** - Static generation, code splitting, and CDN delivery
- **Accessible** - WCAG 2.1 AA compliant

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| 3D | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) + [Three.js](https://threejs.org/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com/) |

## Getting Started

### Prerequisites

- **Node.js** 20.x (see `.nvmrc`)
- **npm** 10.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/IntelliAttend/IntelliAttend-Web.git
cd IntelliAttend-Web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler |
| `npm run deploy` | Deploy to Cloudflare Pages |
| `npm run deploy:prod` | Deploy to production |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (portal)/          # Dashboard pages
│   └── (marketing)/       # Public marketing pages
├── components/
│   ├── layout/            # Navbar, Footer, providers
│   ├── ui/                # Reusable UI primitives
│   ├── home/              # Homepage sections
│   ├── auth/              # Auth components
│   ├── portal/            # Dashboard components
│   └── [feature]/         # Feature-specific components
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
├── config/                # Constants and configuration
└── lib/                   # Utility functions
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and Cloudflare Pages for deployment.

### Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| CI | Push/PR to `main` | Lint, typecheck, build verification |
| Deploy | Push to `main` | Auto-deploy to Cloudflare Pages |

### Setup

1. **Add GitHub Secrets:**
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. **Cloudflare Pages:**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Output directory: `out`

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup instructions.

## Deployment

### Automatic Deployment

Push to `main` triggers automatic deployment:

```bash
git push origin main
```

### Manual Deployment

```bash
# Deploy preview
npm run deploy

# Deploy to production
npm run deploy:prod
```

### Custom Domain

The site is configured for: **[www.intelliattend.app](https://www.intelliattend.app)**

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community standards
- [SECURITY.md](SECURITY.md) - Security policy
- [LICENSE](LICENSE) - License terms

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

- **Documentation:** [docs.intelliattend.app](https://docs.intelliattend.app)
- **Issues:** [GitHub Issues](https://github.com/IntelliAttend/IntelliAttend-Web/issues)
- **Email:** support@intelliattend.app

## License

This is proprietary software. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with care by the [IntelliAttend](https://intelliattend.app) team**

</div>

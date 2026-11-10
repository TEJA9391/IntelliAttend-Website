# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

### How to Report

If you discover a security vulnerability within IntelliAttend, please send an email to our security team at:

**security@intelliattend.app**

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, CSRF, SQL injection, etc.)
- Full paths of source file(s) related to the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 24 hours.
- **Assessment**: Our security team will assess the vulnerability and determine its impact.
- **Updates**: We will keep you informed of our progress as we work to address the issue.
- **Resolution**: Once the vulnerability is fixed, we will coordinate disclosure with you.
- **Recognition**: With your permission, we will acknowledge your contribution in our security advisory.

### Response Timeline

| Stage | Timeframe |
|-------|-----------|
| Initial acknowledgment | Within 24 hours |
| Vulnerability assessment | Within 72 hours |
| Fix development | Depends on severity |
| Public disclosure | After fix is deployed |

## Security Measures

### Infrastructure

- **Cloudflare Pages**: DDoS protection, WAF, and edge caching
- **HTTPS**: Enforced on all routes
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy

### Application

- **Input Validation**: All user inputs are validated using Zod schemas
- **XSS Protection**: React's built-in XSS protection + CSP headers
- **CSRF Protection**: SameSite cookies and CSRF tokens
- **Authentication**: Secure session management with HTTP-only cookies

### Development

- **Dependencies**: Regular automated updates via Dependabot
- **Code Review**: All changes require peer review
- **CI/CD**: Automated security scanning in pipeline
- **Secrets**: Never committed to repository

## Best Practices for Contributors

1. **Never commit secrets** (API keys, passwords, tokens)
2. **Use environment variables** for sensitive configuration
3. **Validate all inputs** on both client and server
4. **Follow OWASP guidelines** for web security
5. **Report vulnerabilities** responsibly through private channels

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/basic-features/security)
- [Cloudflare Security](https://www.cloudflare.com/learning/)

## Contact

For security-related inquiries, contact:

- **Email**: security@intelliattend.app
- **PGP Key**: Available upon request

---

Thank you for helping keep IntelliAttend and its users safe!

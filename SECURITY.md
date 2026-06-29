# Security Policy

## Supported Versions

We actively maintain the latest release. Security fixes are backported where feasible.

| Version              | Supported              |
| -------------------- | ---------------------- |
| Latest (main branch) | ✅ Yes                 |
| Previous minor       | ⚠️ Critical fixes only |
| Older                | ❌ No                  |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, send a report to:

**security@onlineutility.io** _(update with your actual address)_

Include as much of the following as possible:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Affected version(s) or commit hash
- Any suggested remediation

You will receive an acknowledgement within **48 hours**. We aim to provide a full response — including a timeline for a fix — within **7 business days**.

---

## Responsible Disclosure

We ask that you:

- Give us a reasonable time to investigate and fix the issue before public disclosure
- Not access or modify data that belongs to others
- Not perform actions that could degrade the service for other users
- Act in good faith

In return, we will:

- Work with you to understand and resolve the issue quickly
- Keep you informed of our progress
- Publicly acknowledge your responsible disclosure (if you wish) once the fix is released

We do not currently offer a bug bounty programme, though we intend to establish one as the project matures.

---

## Scope

The following are **in scope**:

- The OnlineUtility web application (onlineutility.io)
- Cross-site scripting (XSS) vulnerabilities
- Data exposure or privacy leaks affecting users
- Authentication or authorisation bypasses (if applicable)
- Dependency vulnerabilities with a realistic attack vector in this project

The following are **out of scope**:

- Vulnerabilities in third-party services (Vercel, GitHub, etc.) — report those directly to the respective vendor
- Issues requiring physical access to a device
- Social engineering attacks
- Denial-of-service attacks
- Self-XSS (attacks that require the victim to execute the payload themselves)
- Findings from automated scanners with no demonstrated impact

---

## Security Best Practices in This Codebase

- **Most tools run entirely in the browser** — no user data is sent to our servers
- **No authentication** — there are no user accounts or sessions to compromise
- **Content Security Policy** headers are configured at the hosting layer
- **Dependencies are reviewed** before addition; we avoid packages with known CVEs
- **`npm audit`** is run on the CI pipeline
- User-supplied content is never rendered as raw HTML without sanitisation

---

## Privacy Statement

OnlineUtility is designed to minimise data collection:

- Most tools process data exclusively in the browser — nothing is transmitted
- We use Vercel Analytics for aggregate, anonymised traffic metrics only
- No personally identifiable information is stored on our servers
- We do not sell data to third parties

For detailed privacy information see our Privacy Policy (link when published).

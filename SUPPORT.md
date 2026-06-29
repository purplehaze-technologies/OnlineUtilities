# Support

This document describes how to get help with OnlineUtility.

---

## Before Asking

1. Search [existing issues](https://github.com/your-org/OnlineUtility/issues) — your question may already be answered.
2. Check [GitHub Discussions](https://github.com/your-org/OnlineUtility/discussions) for similar questions.
3. Review the [documentation](docs/) for the area you are working in.

---

## How to Get Help

### GitHub Discussions — for questions and ideas

[GitHub Discussions](https://github.com/your-org/OnlineUtility/discussions) is the best place for:

- Questions about using the site or a specific tool
- Questions about the codebase, architecture, or contributing
- Ideas for new tools or features
- General discussion about the project

Start a new discussion under the most relevant category.

### GitHub Issues — for bugs and confirmed problems

[Open an issue](https://github.com/your-org/OnlineUtility/issues/new/choose) when you have:

- A reproducible bug (include steps to reproduce, expected behaviour, and actual behaviour)
- A broken tool
- A visual or accessibility defect

Use the issue templates provided. Do not open issues to ask general questions — use Discussions for those.

---

## Reporting a Bug

When reporting a bug please include:

| Field                  | Example                                           |
| ---------------------- | ------------------------------------------------- |
| Browser + version      | Chrome 126, macOS 14                              |
| Steps to reproduce     | 1. Open QR Code Generator → 2. Enter a URL → 3. … |
| Expected behaviour     | A QR code is generated                            |
| Actual behaviour       | The canvas remains blank                          |
| Screenshot / recording | If applicable                                     |

---

## Requesting a Feature or New Tool

Open a [GitHub Discussion](https://github.com/your-org/OnlineUtility/discussions) under the **Ideas** category. Describe:

- What problem the tool solves
- Who would use it
- Any existing tools or references

For tools you want to build yourself, see [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/adding-a-tool.md](docs/adding-a-tool.md).

---

## Security Issues

**Do not open a public issue for security vulnerabilities.** See [SECURITY.md](SECURITY.md) for the responsible disclosure process.

---

## Documentation

The project documentation lives in [`docs/`](docs/). Key pages:

| Document                                       | Description                           |
| ---------------------------------------------- | ------------------------------------- |
| [docs/adding-a-tool.md](docs/adding-a-tool.md) | How to contribute a new utility       |
| [docs/architecture.md](docs/architecture.md)   | Why things are built the way they are |
| [docs/design-system.md](docs/design-system.md) | Tokens, components, CSS conventions   |
| [CONTRIBUTING.md](CONTRIBUTING.md)             | Full contributor guide                |
| [ROADMAP.md](ROADMAP.md)                       | What is planned and what is coming    |

---

## Frequently Asked Questions

**Are the tools really free?**
Yes. All tools are free and have no usage limits. There is no premium tier.

**Is my data safe?**
Most tools process data entirely in your browser — nothing is sent to our servers. See [SECURITY.md](SECURITY.md) for details.

**Can I self-host OnlineUtility?**
Yes. Clone the repository, run `npm install && npm run build && npm start`, and deploy anywhere that runs Node.js. See [README.md](README.md) for environment variable requirements.

**How do I add a tool?**
Read [docs/adding-a-tool.md](docs/adding-a-tool.md) and [CONTRIBUTING.md](CONTRIBUTING.md), then open a PR.

**How long does it take for PRs to be reviewed?**
We aim to review pull requests within 3 business days.

**I found a bug. What should I do?**
Check [existing issues](https://github.com/your-org/OnlineUtility/issues) first, then open a new one using the bug report template.

---

## Community

- [GitHub Discussions](https://github.com/your-org/OnlineUtility/discussions) — the primary community space
- [Issues](https://github.com/your-org/OnlineUtility/issues) — bugs and confirmed improvements

We do not have a Discord or Slack at this time. GitHub Discussions is where the community lives.

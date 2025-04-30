---
title: Docs Contribution Guide
---
# Contributing to Documentation

This site is built with [Docusaurus](https://docusaurus.io/) and lives in the `website/` directory of the monorepo.

---

## 📁 Docs Structure

- Docs are stored in `website/docs/`
- Organized into:
    - `features/` — One `.md` file per feature/module
    - `intro.md`, `getting-started.md`, etc. — General pages
- Sidebar is managed in `website/sidebars.ts`

---

## ✍️ Writing Docs

### 1. Create a Markdown File

Add a new `.md` file in the appropriate folder. Use this structure:

```md
# Feature Name

## Overview
What this feature/module does.

## Flow
How it works internally.

## API or Usage
Key endpoints or code usage examples.

## Key Files
Paths in the repo and what they do.

## How to Extend
Steps to contribute further or modify this feature.

```

### 2. Add It to the Sidebar

Edit `website/sidebars.ts` and insert your file under the right category.

### 3. Run the Docs Locally

```bash
npm run docs
# or, if inside website/
npm run start

```

Docs will be available at: `http://localhost:3000`

----------

## ✅ Best Practices

-   Use headings (`#`, `##`, `###`) for clear structure

-   Use fenced code blocks for code or CLI examples

-   Link to other docs with relative paths (e.g. `[see here](../environment-variables)`)

-   Be concise and use bullet points when helpful


----------

## 🔄 Version Control

At this stage, we are not using versioned docs. All updates go to the latest version.

----------

## 🙌 Thank You!

Your contributions help the next developer get up to speed faster!
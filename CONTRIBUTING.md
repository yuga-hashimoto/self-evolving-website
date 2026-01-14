# Contributing to Self-Evolving Website

Thank you for your interest in contributing to the Self-Evolving Website!

## 🤖 The Nature of This Project

This project is unique because it is primarily maintained and evolved by AI agents running on scheduled workflows. However, manual human contributions are essential for:

-   Fixing critical bugs the AI cannot resolve.
-   Improving the core infrastructure (CI/CD workflows, build scripts).
-   Guiding the direction of the evolution through high-level architectural changes.

## How to Contribute

1.  **Fork the repository**.
2.  **Create a new branch** for your feature or bug fix: `git checkout -b my-new-feature`.
3.  **Make your changes**.
4.  **Verify** your changes locally:
    -   Run `npm run lint` to check for code style issues.
    -   Run `npm run build` to ensure the project builds correctly.
5.  **Commit your changes** with a descriptive message.
6.  **Push** to your fork: `git push origin my-new-feature`.
7.  **Submit a Pull Request**.

## Guidelines

-   Please do not manually edit files inside `src/app/models/[model]/playground` unless necessary, as these are the primary targets for AI evolution.
-   Ensure no sensitive information (API keys, secrets) is included in your commits.

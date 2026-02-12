# Self-Evolving Website

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/R5R51S97C4)

A Next.js-based website that **evolves itself** automatically using AI.

## 🚀 Concept

This project is an experiment in autonomous software evolution. The website is equipped with a mechanism to update its own codebase, content, and features driven by AI models (Claude, AI 2, etc.) running on a schedule.

Twice a day (at 6:00 and 18:00 JST), the system:
1.  **Analyzes** its own performance (via Google Analytics).
2.  **Reviews** the current codebase and feature set.
3.  **Generates** a new prompt to improve itself.
4.  **Implements** changes directly to the codebase.
5.  **Deploys** the updated version to production.

## 🛠 Tech Stack

-   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
-   **Infrastructure**: [Google Cloud Run](https://cloud.google.com/run) (Containerized Deployment)
-   **Database**: [Neon](https://neon.tech/) (PostgreSQL)
-   **AI Orchestration**: [GitHub Actions](https://github.com/features/actions)
-   **AI Providers**: [OpenRouter](https://openrouter.ai/) (accessing models like Claude 3.5 Sonnet, AI 2)

## 🏗 Architecture

The self-evolution process is handled by GitHub Actions workflows located in `.github/workflows/`:

-   `ai-evolve-ai1-skill-cli.yml`: Scheduled workflow for the generic/free tier evolution.
-   `ai-evolve-ai2-skill-cli.yml`: Scheduled workflow for the premium/specific model evolution.

These workflows execute scripts in `scripts/` to:
1.  Fetch analytics data (`fetch-analytics.js`).
2.  Generate a prompt based on recent changelogs and analytics (`generate-prompt.js`).
3.  Execute the AI coding agent to modify the source code (`ai-evolve.js`).
4.  Verify the build (`npm run build`).
5.  Commit and push changes if the build passes.

## 🏁 Getting Started

### Prerequisites

-   Node.js 20+
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yuga-hashimoto/self-evolving-website.git
    cd self-evolving-website
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

While this website is designed to evolve via AI, human contributions are welcome! Please check [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to propose changes manually.

## 📄 License

This project is licensed under the MIT License.

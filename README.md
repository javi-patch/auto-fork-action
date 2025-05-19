<!--
SPDX-FileCopyrightText: 2025 INDUSTRIA DE DISEÑO TEXTIL S.A. (INDITEX S.A.)

SPDX-License-Identifier: Apache-2.0
-->

<!-- markdownlint-disable first-line-heading -->

<p align="center">
  <img height="250" alt="Action Logo" src="logo.png">
</p>

<p align="center">
  <a href="https://github.com/InditexTech/auto-fork-action/blob/main/LICENSE">
    <img alt="GitHub License" src="https://img.shields.io/github/license/InditexTech/auto-fork-action">
  </a>
  <a href="https://github.com/InditexTech/auto-fork-action/actions/workflows/linter.yml">
    <img alt="GitHub Super-Linter" src="https://github.com/InditexTech/auto-fork-action/actions/workflows/linter.yml/badge.svg">
  </a>
  <a href="https://github.com/InditexTech/auto-fork-action/actions?query=workflow%3Acheck-dist">
    <img alt="Check dist/" src="https://github.com/InditexTech/auto-fork-action/actions/workflows/check-dist.yml/badge.svg">
  </a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/InditexTech/auto-fork-action">
    <img alt="OpenSSF Scorecard" src="https://api.scorecard.dev/projects/github.com/InditexTech/auto-fork-action/badge">
  </a>
</p>

# auto-fork-action

A GitHub Action that automatically forks a repository into your organization, creates a `<repo>-maintainers` team,
assigns specified users as maintainers and grants permissions.

> Simplify onboarding of forked repos and team setup for your organization.

## Features

- 🔧 Automatically fork any public repository into your org
- 👥 Bootstrap a maintainers team and assign roles
- 🔒 Grant fine-grained permissions (`pull`│`push`│`maintain`)
- 📦 Reusable action with configurable inputs

## Getting Started

### Usage

<!-- prettier-ignore -->
```yml
# in your workflow file
uses: InditexTech/auto-fork-action@v1
with:
  repository: owner/repo             # or full URL like https://github.com/owner/repo
  maintainers: alice,bob,charlie     # comma-separated list
  token: ${{ secrets.ORG_PAT }}      # PAT with repo + admin:org
  org: InditexTech                   # optional, defaults to the workflow repo owner
  team-name: custom-maintainers      # optional, defaults to <repo>-maintainers
  permission: maintain               # optional: pull | triage | push | maintain | admin (default: maintain)
  poll-interval: '5'                 # optional, seconds between fork-ready checks (default: 3)
  poll-retries: '15'                 # optional, number of retries before timing out (default: 10)
```

### Example workflow

```yml

```

## Contributing

We welcome contributions!

Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) and follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and development goals.

## Acknowledgments

- Based on the [TypeScript Action template](https://github.com/actions/typescript-action/).
- Thanks to the [GitHub Actions Toolkit](https://github.com/actions/toolkit) for providing libraries and examples.

## License

This project is licensed under the [Apache-2.0 License](./LICENSE).

© 2025 INDUSTRIA DE DISEÑO TEXTIL S.A. (INDITEX S.A.)

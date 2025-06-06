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

A GitHub Action that automatically forks a repository into your organization, creates a maintainers team, assigns
specified users and grants permissions.

> Simplify onboarding of forked repos and team setup for your organization.

## Features

- 🔧 Automatically fork any public repository into your org
- 🏷️ Optionally specify a custom name for the forked repository
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
  custom-name: custom-repo-name      # optional, custom name for the forked repository
  team-name: custom-maintainers      # optional, defaults to <repo>-maintainers
  permission: maintain               # optional: pull | triage | push | maintain | admin (default: maintain)
  poll-interval: '5'                 # optional, seconds between fork-ready checks (default: 3)
  poll-retries: '15'                 # optional, number of retries before timing out (default: 10)
```

### Example workflow

```yml
name: auto-fork action

on:
  workflow_dispatch:
  issues:
    types: [opened]

jobs:
  fork-and-team:
    if: ${{ contains(github.event.issue.labels.*.name, 'auto-fork') }}
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          sparse-checkout: |
            .github/ISSUE_TEMPLATE/fork-request.yml
          sparse-checkout-cone-mode: false

      - uses: stefanbuck/github-issue-parser@v3
        id: issue-parser
        with:
          template-path: .github/ISSUE_TEMPLATE/fork-request.yml

      - uses: InditexTech/auto-fork-action@v1
        id: auto-fork
        with:
          repository: ${{ steps.issue-parser.outputs.issueparser_repo_url }}
          maintainers: ${{ steps.issue-parser.outputs.issueparser_maintainers }}
          token: ${{ secrets.YOUR_TOKEN }}

      - run: gh issue close --comment "$BODY" "$NUMBER"
        env:
          GH_TOKEN: ${{ steps.generate-token.outputs.token }}
          GH_REPO: ${{ github.repository }}
          NUMBER: ${{ github.event.issue.number }}
          BODY: >
            Repository has been forked: [${{ steps.auto-fork.outputs.fork-repo }}](${{ steps.auto-fork.outputs.fork-url
            }}).
```

This example workflow assumes you have a issue template similar to the following:

```yml
name: Fork + team request
description: fork a repo, create team and assign maintainers
title: Fork repository request
labels: [auto-fork]
body:
  - type: input
    id: repo_url
    attributes:
      label: GitHub repo to fork
      description: full URL, e.g. https://github.com/foo/bar
    validations:
      required: true

  - type: textarea
    id: maintainers
    attributes:
      label: Maintainer usernames
      description: comma-separated, e.g. alice, bob, charlie
    validations:
      required: true
```

## Contributing

We welcome contributions!

Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) and follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Roadmap

While this first release provides the core functionality, future iterations may include:

- 🐛 Bugfixes and reliability improvements
- 🧪 Enhanced error handling and logging
- 🔄 Support for updating existing teams and repos

Have an idea or use case? [Open an issue](https://github.com/InditexTech/auto-fork-action/issues)!

## Acknowledgments

- Based on the [TypeScript Action template](https://github.com/actions/typescript-action/).
- Thanks to the [GitHub Actions Toolkit](https://github.com/actions/toolkit) for providing libraries and examples.

## License

This project is licensed under the [Apache-2.0 License](./LICENSE).

© 2025 INDUSTRIA DE DISEÑO TEXTIL S.A. (INDITEX S.A.)

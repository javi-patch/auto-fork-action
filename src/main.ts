// SPDX-FileCopyrightText: 2025 INDUSTRIA DE DISEÑO TEXTIL S.A. (INDITEX S.A.)
//
// SPDX-License-Identifier: Apache-2.0

import * as core from '@actions/core'
import { getOctokit, context } from '@actions/github'

export async function run(): Promise<void> {
  try {
    core.info('🔨 Starting Auto Fork & Team')

    // 1. inputs
    const repoInput = core.getInput('repository', { required: true }).trim()
    const token = core.getInput('token', { required: true })
    const org = core.getInput('org', { required: false }) || context.repo.owner
    const maintainers = core.getInput('maintainers', { required: true })
    const customName = core.getInput('custom-name', { required: false })
    const customTeamName = core.getInput('team-name', { required: false })
    const permission = core.getInput('permission', { required: false }) || 'maintain'
    const pollInterval = parseInt(core.getInput('poll-interval', { required: false }) || '3', 10)
    const pollRetries = parseInt(core.getInput('poll-retries', { required: false }) || '10', 10)

    core.info(`🔨 Repository: ${repoInput}`)
    core.info(`🔨 Organization: ${org}`)

    const github = getOctokit(token)
    const users = maintainers.split(/[, ]+/).map((u) => u.replace(/^@/, ''))

    // Parse owner/repo
    let srcOwner, srcRepo

    // Case 1: owner/repo format (e.g., kubernetes/kubernetes)
    if (/^[^/]+\/[^/]+$/.test(repoInput)) {
      const result = repoInput.split('/')
      if (result) {
        srcOwner = result[0]
        srcRepo = result[1]
      }
    }
    // Case 2: https://github.com/owner/repo
    else if (repoInput.includes('github.com/')) {
      const match = repoInput.match(/github\.com\/([^/]+)\/([^/]+)(\/|\.git|$)/)
      if (match) {
        srcOwner = match[1]
        srcRepo = match[2]
      }
    }

    if (!srcOwner || !srcRepo) {
      throw new Error('Invalid repository format. Expected: owner/repo or GitHub URL format')
    }

    // Define the fork repository name (either custom or the original repo name)
    const forkRepoName = customName || srcRepo

    // Create fork
    const forkParams: { owner: string; repo: string; organization: string; name?: string } = {
      owner: srcOwner,
      repo: srcRepo,
      organization: org,
      ...(customName && { name: customName })
    }

    // Log the fork creation with simple message
    core.info(`🔨 Creating fork of ${srcOwner}/${srcRepo} to ${org}${customName ? ` as ${customName}` : ''}`)

    await github.rest.repos.createFork(forkParams)

    // Wait until fork exists (simple poll)
    core.info(`🔨 Waiting for fork to be available...`)
    let ready = false
    for (let i = 0; i < pollRetries && !ready; i++) {
      try {
        await github.rest.repos.get({ owner: org, repo: forkRepoName })
        ready = true
        core.info(`🔨 Fork is ready!`)
      } catch {
        core.info(`🔨 Fork not ready yet, waiting...`)
        await new Promise((r) => setTimeout(r, pollInterval * 1000))
      }
    }
    if (!ready) throw new Error(`Fork not available after ${pollRetries * pollInterval}s`)

    // Create/get team
    const teamSlug = customTeamName || srcRepo.toLowerCase().replaceAll('.', '-') + '-maintainers'
    core.info(`🔨 Creating team: ${teamSlug}`)
    try {
      await github.rest.teams.create({
        org,
        name: teamSlug,
        privacy: 'closed'
      })
    } catch {
      core.info(`🔨 Team might already exist, continuing...`)
    }

    // Add members as maintainers
    core.info(`🔨 Adding ${users.length} maintainers to the team`)
    for (const username of users) {
      core.info(`🔨 Adding ${username} to the team`)
      await github.rest.teams.addOrUpdateMembershipForUserInOrg({
        org,
        team_slug: teamSlug,
        username
      })
    }

    // Give team permissions on the fork
    core.info(`🔨 Setting team permissions on the fork: ${permission}`)
    await github.rest.teams.addOrUpdateRepoPermissionsInOrg({
      org,
      team_slug: teamSlug,
      owner: org,
      repo: forkRepoName,
      permission
    })

    // Set outputs
    const forkRepo = `${org}/${forkRepoName}`
    const forkUrl = `https://github.com/${forkRepo}`

    core.setOutput('fork-repo', forkRepo)
    core.setOutput('fork-url', forkUrl)
    core.setOutput('team-slug', teamSlug)

    core.info(`🔨 Auto Fork & Team completed successfully!`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

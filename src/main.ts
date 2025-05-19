// SPDX-FileCopyrightText: 2025 INDUSTRIA DE DISEÑO TEXTIL S.A. (INDITEX S.A.)
//
// SPDX-License-Identifier: Apache-2.0

import * as core from '@actions/core'

/**
 * Main entrypoint for the Auto Fork & Team action.
 */
export async function run(): Promise<void> {
  try {
    core.info('Starting Auto Fork & Team action')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

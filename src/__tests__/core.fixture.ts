// SPDX-FileCopyrightText: 2023 GitHub
//
// SPDX-License-Identifier: MIT

import type * as core from '@actions/core'
import { jest } from '@jest/globals'

export const debug = jest.fn<typeof core.debug>(console.log)
export const info = jest.fn<typeof core.info>(console.log)
export const warning = jest.fn<typeof core.warning>(console.log)
export const error = jest.fn<typeof core.error>(console.error)
export const getInput = jest.fn<typeof core.getInput>((name) => {
  // Format is INPUT_<UPPERCASE_NAME> as per GitHub Actions convention
  const key = `INPUT_${name.replace(/-/g, '_').toUpperCase()}`
  return process.env[key] || ''
})
export const setOutput = jest.fn<typeof core.setOutput>(console.log)
export const setFailed = jest.fn<typeof core.setFailed>(console.error)

import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadRawPreference,
  saveRawPreference,
  loadJSONPreference,
  saveJSONPreference,
} from './preferencesStorage'

beforeEach(() => {
  localStorage.clear()
})

describe('raw preferences', () => {
  it('roundtrips a raw string value', () => {
    saveRawPreference('theme', 'dark')
    expect(loadRawPreference('theme')).toBe('dark')
  })

  it('returns null when nothing is stored', () => {
    expect(loadRawPreference('missing')).toBeNull()
  })
})

describe('JSON preferences', () => {
  it('roundtrips a JSON-serializable value', () => {
    saveJSONPreference('config', { limits: { maxRows: 100 } })
    expect(loadJSONPreference('config')).toEqual({ limits: { maxRows: 100 } })
  })

  it('returns null for malformed stored JSON instead of throwing', () => {
    saveRawPreference('config', '{not valid json')
    expect(loadJSONPreference('config')).toBeNull()
  })

  it('returns null when nothing is stored', () => {
    expect(loadJSONPreference('missing')).toBeNull()
  })
})

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  isAnalyticsEnabled,
  loadAnalyticsScript,
  trackAnalyticsEvent,
} from './analytics'

function stubAnalyticsEnv(overrides: Record<string, string> = {}) {
  vi.stubEnv('VITE_PUBLIC_ENV', 'production')
  vi.stubEnv('VITE_ANALYTICS_ENABLED', 'true')
  vi.stubEnv('VITE_ANALYTICS_SRC', 'https://analytics.example.com/fetch.js')
  vi.stubEnv('VITE_ANALYTICS_WEBSITE_ID', 'test-website-id')
  for (const [key, value] of Object.entries(overrides)) {
    vi.stubEnv(key, value)
  }
}

beforeEach(() => {
  document
    .querySelectorAll('#sys-analytics-script')
    .forEach((el) => el.remove())
  delete window.umami
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('isAnalyticsEnabled', () => {
  it('is false with no env configured', () => {
    expect(isAnalyticsEnabled()).toBe(false)
  })

  it('is true only when production + enabled + src + website id all hold', () => {
    stubAnalyticsEnv()
    expect(isAnalyticsEnabled()).toBe(true)
  })

  it('is false outside production even if otherwise fully configured', () => {
    stubAnalyticsEnv({ VITE_PUBLIC_ENV: 'development' })
    expect(isAnalyticsEnabled()).toBe(false)
  })

  it('is false when the enabled flag is not "true"', () => {
    stubAnalyticsEnv({ VITE_ANALYTICS_ENABLED: 'false' })
    expect(isAnalyticsEnabled()).toBe(false)
  })

  it('is false when the src is missing', () => {
    stubAnalyticsEnv({ VITE_ANALYTICS_SRC: '' })
    expect(isAnalyticsEnabled()).toBe(false)
  })

  it('is false when the website id is missing', () => {
    stubAnalyticsEnv({ VITE_ANALYTICS_WEBSITE_ID: '' })
    expect(isAnalyticsEnabled()).toBe(false)
  })
})

describe('loadAnalyticsScript', () => {
  it('does not inject a script when disabled', () => {
    loadAnalyticsScript()
    expect(document.getElementById('sys-analytics-script')).toBeNull()
  })

  it('injects a deferred script with the configured src and website id', () => {
    stubAnalyticsEnv()
    loadAnalyticsScript()
    const script = document.getElementById(
      'sys-analytics-script'
    ) as HTMLScriptElement | null
    expect(script).not.toBeNull()
    expect(script?.src).toBe('https://analytics.example.com/fetch.js')
    expect(script?.getAttribute('data-website-id')).toBe('test-website-id')
    expect(script?.defer).toBe(true)
  })

  it('does not inject a second script on repeated calls', () => {
    stubAnalyticsEnv()
    loadAnalyticsScript()
    loadAnalyticsScript()
    expect(document.querySelectorAll('#sys-analytics-script')).toHaveLength(1)
  })
})

describe('trackAnalyticsEvent', () => {
  it('no-ops when analytics is disabled', () => {
    const track = vi.fn()
    window.umami = { track }
    trackAnalyticsEvent('upload_dataset')
    expect(track).not.toHaveBeenCalled()
  })

  it('no-ops when enabled but the script/global is unavailable', () => {
    stubAnalyticsEnv()
    expect(() => trackAnalyticsEvent('upload_dataset')).not.toThrow()
  })

  it('forwards the event name and data to window.umami.track when enabled', () => {
    stubAnalyticsEnv()
    const track = vi.fn()
    window.umami = { track }
    trackAnalyticsEvent('create_chart_from_suggestion', { chartType: 'bar' })
    expect(track).toHaveBeenCalledWith('create_chart_from_suggestion', {
      chartType: 'bar',
    })
  })
})

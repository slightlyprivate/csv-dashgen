import { useEffect } from 'react'
import { loadAnalyticsScript } from '../lib/analytics'

/**
 * Injects the self-hosted analytics script on mount. Renders nothing.
 * `loadAnalyticsScript` is itself a no-op unless VITE_ANALYTICS_ENABLED is
 * "true" in a production build with a src and website id configured — see
 * src/lib/analytics and docs/ANALYTICS.md.
 */
export default function ProductionAnalytics() {
  useEffect(() => {
    loadAnalyticsScript()
  }, [])

  return null
}

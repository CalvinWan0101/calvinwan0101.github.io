import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = 'G-Q832LS5V68'
const ANALYTICS_SCRIPT_ID = 'google-analytics-gtag'

let analyticsConfigured = false

declare global {
  interface Window {
    dataLayer: unknown[][]
    gtag?: (...args: unknown[]) => void
  }
}

const ensureAnalytics = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dataLayer ??= []
  window.gtag ??= (...args: unknown[]) => {
    window.dataLayer.push(args)
  }

  if (!document.getElementById(ANALYTICS_SCRIPT_ID)) {
    const script = document.createElement('script')
    script.id = ANALYTICS_SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)
  }

  if (!analyticsConfigured) {
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
    analyticsConfigured = true
  }
}

export const AnalyticsTracker = () => {
  const location = useLocation()

  useEffect(() => {
    ensureAnalytics()

    window.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_path: `${location.pathname}${location.search}${location.hash}`,
      page_location: window.location.href,
    })
  }, [location.hash, location.pathname, location.search])

  return null
}
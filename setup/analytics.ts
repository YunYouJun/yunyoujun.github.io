import type { App } from 'vue'
import VueGtag, { useGtag } from 'vue-gtag-next'

type Clarity = ((...args: unknown[]) => void) & { q: unknown[][] }

function startClarity() {
  const browser = window as Window & { clarity?: Clarity }
  if (browser.clarity)
    return

  const queue: unknown[][] = []
  browser.clarity = Object.assign((...args: unknown[]) => queue.push(args), { q: queue })

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.clarity.ms/tag/90e9nf70bx'
  document.head.append(script)
}

export function startAnalytics(app: App) {
  startClarity()
  app.use(VueGtag, { property: { id: 'G-1LL0D86CY9' } })
  return useGtag().pageview
}

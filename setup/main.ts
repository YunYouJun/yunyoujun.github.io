import type { PageView } from 'vue-gtag-next'
import { defineAppSetup } from 'valaxy'

export default defineAppSetup(({ app, isClient, router }) => {
  if (!isClient)
    return

  const pendingViews: PageView[] = []
  let sendView: ((view: PageView) => void) | undefined
  let lastPath: string | undefined

  function trackView({ path, fullPath, name }: Pick<typeof router.currentRoute.value, 'path' | 'fullPath' | 'name'>) {
    if (lastPath === path)
      return

    lastPath = path
    const view: PageView = {
      page_path: path,
      page_location: new URL(router.resolve(fullPath).href, window.location.href).href,
      page_title: typeof name === 'string' ? name : undefined,
    }
    if (sendView)
      sendView(view)
    else
      pendingViews.push(view)
  }

  // Keep the landing page and any early SPA navigation while the trackers are deferred.
  router.afterEach((to, _from, failure) => {
    if (!failure)
      trackView(to)
  })

  function loadAnalytics() {
    const start = () => {
      void import('./analytics').then(({ startAnalytics }) => {
        const track = startAnalytics(app)
        sendView = track
        pendingViews.splice(0).forEach(track)
      }).catch((error: unknown) => {
        pendingViews.length = 0
        sendView = () => {}
        console.warn('Could not load analytics', error)
      })
    }

    if (typeof window.requestIdleCallback === 'function')
      window.requestIdleCallback(start, { timeout: 1500 })
    else
      window.setTimeout(start, 0)
  }

  if (document.readyState === 'complete')
    loadAnalytics()
  else
    window.addEventListener('load', loadAnalytics, { once: true })
})

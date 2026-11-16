import notFoundPage from './.edgeone-not-found.mjs'

const legacyNovelPrefix = '/2017/07/10/creation/novel'

export const config = {
  matcher: [
    '/404',
    '/404/',
    '/404.html',
    '/404.html/',
    // Match the full path before EdgeOne decodes or normalizes the apostrophe.
    '^/2017/07/10/creation/novel/aqua[^/]+s-planet/?$',
  ],
}

export function middleware({ request, next }) {
  const url = new URL(request.url)
  // The EdgeOne JSON redirect matcher misses this old slug's apostrophe.
  const path = url.pathname.replace(/%27/g, '\'').replace(/\/$/, '')
  if (path === `${legacyNovelPrefix}/aqua's-planet`) {
    const target = new URL(`/posts/planet-of-aqua${url.search}`, url)
    return new Response(null, { status: 301, headers: { Location: target.href } })
  }

  if (path !== '/404' && path !== '/404.html')
    return next()

  return new Response(request.method === 'HEAD' ? null : notFoundPage, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

const notFoundPage = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 · 云游君的小站</title>
</head>
<body>
<main>
<h1>404</h1>
<p>未曾触及的未来</p>
<p><a href="/">返回首页</a></p>
</main>
</body>
</html>`

const directNotFoundPaths = ['/404', '/404.html']
const legacyNovelPrefix = '/2017/07/10/creation/novel'

export const config = {
  matcher: [
    '/404',
    '/404/',
    '/404.html',
    '/404.html/',
    // Check the legacy slug in the handler so both literal and encoded apostrophes work.
    '/2017/07/10/creation/novel/:path*',
  ],
}

export function middleware(context) {
  // EdgeOne supplies a context object. Vercel passes a Request directly.
  const request = context.request ?? context
  const url = new URL(request.url)
  // The EdgeOne JSON redirect matcher misses this old slug's apostrophe.
  const path = url.pathname.replace(/%27/g, '\'').replace(/\/$/, '')
  if (path === `${legacyNovelPrefix}/aqua's-planet`) {
    const target = new URL(`/posts/planet-of-aqua${url.search}`, url)
    return new Response(null, { status: 301, headers: { Location: target.href } })
  }

  if (!directNotFoundPaths.includes(path)) {
    return context.next
      ? context.next()
      : new Response(null, { headers: { 'x-middleware-next': '1' } })
  }

  return new Response(request.method === 'HEAD' ? null : notFoundPage, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export default middleware

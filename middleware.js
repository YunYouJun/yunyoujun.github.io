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

export const config = {
  matcher: ['/404', '/404.html'],
}

export function middleware({ request, next }) {
  const { pathname } = new URL(request.url)
  if (!config.matcher.includes(pathname))
    return next()

  return new Response(request.method === 'HEAD' ? null : notFoundPage, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

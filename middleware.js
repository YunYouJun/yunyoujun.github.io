const notFoundPage = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>404 · 云游君的小站</title>
<style>
  body {
    display: grid;
    min-height: 100vh;
    min-height: 100svh;
    margin: 0;
    place-items: center;
    font: 1rem/1.5 system-ui, sans-serif;
  }
  main {
    padding: 2rem 1rem;
    text-align: center;
  }
  h1 {
    display: inline-flex;
    margin: 0;
    font: 900 clamp(4rem, 18vw, 8rem)/1 ui-serif, serif;
  }
  h1 span {
    padding: 0.08em 0.16em;
    border: 1px solid GrayText;
  }
  h1 span + span { border-inline-start: 0; }
  p { font: 700 1.25rem ui-serif, serif; }
  nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
  a {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    padding-inline: 0.875rem;
    border-radius: 9999px;
    font-size: 0.875rem;
  }
  .home {
    border: 1px solid GrayText;
    color: CanvasText;
    text-decoration: none;
  }
  .report {
    text-decoration-style: dashed;
    text-underline-offset: 0.26em;
  }
  .report:is(:hover, :focus-visible) {
    text-decoration-style: solid;
  }
  a:focus-visible {
    outline: 2px solid LinkText;
    outline-offset: 2px;
  }
</style>
</head>
<body>
<main>
<h1 aria-label="404"><span aria-hidden="true">4</span><span aria-hidden="true">0</span><span aria-hidden="true">4</span></h1>
<p>未曾触及的未来</p>
<nav>
<a class="home" href="/">返回首页</a>
<a class="report" href="https://github.com/YunYouJun/yunyoujun.github.io/issues/new?title=404" target="_blank" rel="noreferrer">在 GitHub 反馈失效链接</a>
</nav>
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

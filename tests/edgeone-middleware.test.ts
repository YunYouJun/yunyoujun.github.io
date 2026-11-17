import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test
import { test } from 'node:test'
import { config, middleware } from '../middleware.js'

const origin = 'https://www.yunyoujun.cn'

function next() {
  return new Response('original response')
}

test('returns a real 404 for direct requests to the fallback document', async () => {
  const bodies = new Set<string>()
  for (const path of ['/404', '/404/', '/404.html', '/404.html/']) {
    assert.ok(config.matcher.includes(path), `EdgeOne middleware must match ${path}`)
    const url = `${origin}${path}?from=old-link`
    const response = middleware({ request: new Request(url), next })
    assert.equal(response.status, 404)
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8')
    const body = await response.text()
    assert.match(body, /未曾触及的未来/)
    bodies.add(body)

    const head = middleware({ request: new Request(url, { method: 'HEAD' }), next })
    assert.equal(head.status, 404)
    assert.equal(head.body, null)
  }
  assert.equal(bodies.size, 1)
})

test('leaves normal pages, redirects, and other missing paths to EdgeOne', async () => {
  for (const path of ['/', '/rss', '/404/other', '/posts/404-notes', '/2017/07/10/creation/novel/other', '/2017/07/10/creation/novel/aquaxs-planet']) {
    const response = middleware({ request: new Request(`${origin}${path}`), next })
    assert.equal(await response.text(), 'original response')
  }
})

test('redirects the historical novel URL with either apostrophe spelling', () => {
  const matcher = new RegExp(config.matcher.find(pattern => pattern.includes('/creation/novel/'))!)
  for (const slug of ['aqua\'s-planet', 'aqua%27s-planet']) {
    for (const slash of ['', '/']) {
      const request = new Request(`${origin}/2017/07/10/creation/novel/${slug}${slash}?from=old`)
      assert.match(new URL(request.url).pathname, matcher)
      const response = middleware({ request, next })
      assert.equal(response.status, 301)
      assert.equal(response.headers.get('location'), `${origin}/posts/planet-of-aqua?from=old`)
    }
  }
})

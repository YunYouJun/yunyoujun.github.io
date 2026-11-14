import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test
import { test } from 'node:test'
import { config, middleware } from '../middleware.js'

const origin = 'https://www.yunyoujun.cn'

function next() {
  return new Response('original response')
}

test('returns a real 404 for direct requests to the fallback document', async () => {
  assert.deepEqual(config.matcher, ['/404', '/404.html'])
  for (const path of config.matcher) {
    const response = middleware({ request: new Request(`${origin}${path}?from=old-link`), next })
    assert.equal(response.status, 404)
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8')
    assert.match(await response.text(), /未曾触及的未来/)
    assert.equal(middleware({ request: new Request(`${origin}${path}`, { method: 'HEAD' }), next }).body, null)
  }
})

test('leaves normal pages, redirects, and other missing paths to EdgeOne', async () => {
  for (const path of ['/', '/rss', '/404/', '/posts/404-notes']) {
    const response = middleware({ request: new Request(`${origin}${path}`), next })
    assert.equal(await response.text(), 'original response')
  }
})

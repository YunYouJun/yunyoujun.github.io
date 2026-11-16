import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test
import { after, test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const origin = 'https://www.yunyoujun.cn'
const fixture = '<!doctype html><main class="yun-404">未曾触及的未来</main>'
const root = await mkdtemp(join(tmpdir(), 'blog-edgeone-404-'))
after(() => rm(root, { force: true, recursive: true }))
await mkdir(join(root, 'dist'))
await writeFile(join(root, 'dist', '404.html'), fixture)
await copyFile(new URL('../middleware.js', import.meta.url), join(root, 'middleware.mjs'))
execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/build-edgeone-404.mjs', import.meta.url))], { cwd: root })
const { config, middleware }: typeof import('../middleware.js') = await import(pathToFileURL(join(root, 'middleware.mjs')).href)

function next() {
  return new Response('original response')
}

test('returns a real 404 for direct requests to the fallback document', async () => {
  for (const path of ['/404/', '/404', '/404.html', '/404.html/']) {
    assert.ok(config.matcher.includes(path))
    const response = middleware({ request: new Request(`${origin}${path}?from=old-link`), next })
    assert.equal(response.status, 404)
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8')
    assert.equal(await response.text(), fixture)
    const head = middleware({ request: new Request(`${origin}${path}`, { method: 'HEAD' }), next })
    assert.equal(head.status, 404)
    assert.equal(head.body, null)
  }
})

test('leaves normal pages, redirects, and other missing paths to EdgeOne', async () => {
  for (const path of ['/', '/rss', '/404/index.html', '/posts/missing', '/2017/07/10/creation/novel/other', '/2017/07/10/creation/novel/aquaxs-planet']) {
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

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'
import { studioVideos } from '../config/studio.ts'
import { getAiDisclosure } from '../utils/ai.ts'

test('AI disclosure never invents author review or labels unmarked posts', () => {
  for (const value of [undefined, null, false, 'generated', {}, { mode: 'unknown' }])
    assert.equal(getAiDisclosure(value), null)
  assert.equal(getAiDisclosure({ mode: 'generated', reviewed: false }), 'AI 生成')
  assert.equal(getAiDisclosure({ mode: 'generated', reviewed: 'true' }), 'AI 生成')
  assert.equal(getAiDisclosure({ mode: 'assisted', reviewed: true }), 'AI 辅助创作 · 作者已审阅')
})

test('episodes have unique IDs and link to real articles with a return to the column', async () => {
  assert.equal(new Set(Object.values(studioVideos).map(episode => episode.id)).size, Object.keys(studioVideos).length)
  for (const [articlePath, episode] of Object.entries(studioVideos)) {
    assert.match(episode.id, /^BV[\da-z]{10}$/i)
    assert.equal(new URL(episode.cover).protocol, 'https:')
    const article = await readFile(new URL(`../pages${articlePath}.md`, import.meta.url), 'utf8')
    assert.match(article, /\]\(\/collections\/xiaoyun\/\)/)
    assert.match(article, /<StudioVideo /)
  }
})

import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'
import { syncFriends } from '../scripts/sync-friends.ts'

const friend = {
  avatar: 'https://example.com/avatar.png',
  name: 'Friend',
  url: 'https://example.com',
  color: '#fff',
  desc: 'Description',
}

test('writes normalized remote friends as a generated TypeScript module', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'friends-sync-'))
  const outputFile = join(directory, 'friends.generated.ts')
  const fetchImpl = async () => Response.json([{ ...friend, category: 'friend' }])

  const result = await syncFriends({ fetchImpl, outputFile })
  const generated = await readFile(outputFile, 'utf8')

  assert.deepEqual(result, { count: 1, source: 'remote' })
  assert.match(generated, /export default friends/)
  assert.match(generated, /"blog": "Friend"/)
  assert.doesNotMatch(generated, /category/)
})

test('writes an empty fallback module and succeeds when the remote request fails', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'friends-sync-'))
  const outputFile = join(directory, 'friends.generated.ts')
  const warnings: string[] = []
  const fetchImpl = async () => new Response('unavailable', { status: 503 })

  const result = await syncFriends({
    fetchImpl,
    logger: {
      info() {},
      warn(message) {
        warnings.push(message)
      },
    },
    outputFile,
  })
  const generated = await readFile(outputFile, 'utf8')

  assert.deepEqual(result, { count: 0, source: 'fallback' })
  assert.match(generated, /const friends = \[\]/)
  assert.equal(warnings.length, 1)
})

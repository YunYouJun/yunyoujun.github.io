import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'
import {
  checkFriends,
  checkFriendSite,
  classifyHttpStatus,
} from '../scripts/check-friends.ts'

const friend = {
  avatar: 'https://example.com/avatar.png',
  name: 'Friend',
  url: 'https://example.com',
  color: '#fff',
  blog: 'Blog',
  desc: 'Description',
}

test('classifies successful, restricted, and broken HTTP responses', () => {
  assert.equal(classifyHttpStatus(204), 'reachable')
  assert.equal(classifyHttpStatus(302), 'reachable')
  assert.equal(classifyHttpStatus(403), 'restricted')
  assert.equal(classifyHttpStatus(429), 'restricted')
  assert.equal(classifyHttpStatus(404), 'unreachable')
  assert.equal(classifyHttpStatus(503), 'unreachable')
})

test('retries server and network failures', async () => {
  let serverAttempts = 0
  const serverResult = await checkFriendSite(friend, {
    attempts: 2,
    fetchImpl: async () => {
      serverAttempts++
      return new Response('', { status: serverAttempts === 1 ? 503 : 200 })
    },
  })

  assert.equal(serverAttempts, 2)
  assert.equal(serverResult.status, 'reachable')
  assert.equal(serverResult.knownHidden, false)

  let networkAttempts = 0
  const networkResult = await checkFriendSite(friend, {
    attempts: 2,
    fetchImpl: async () => {
      networkAttempts++
      throw new Error('connection refused')
    },
  })

  assert.equal(networkAttempts, 2)
  assert.equal(networkResult.status, 'unreachable')
  assert.equal(networkResult.reason, 'connection refused')
})

test('checks friends concurrently while preserving source order', async () => {
  const another = { ...friend, name: 'Another', url: 'https://another.example' }
  const results = await checkFriends([friend, another], {
    concurrency: 2,
    fetchImpl: async input => new Response('', {
      status: String(input).includes('another') ? 403 : 200,
    }),
  })

  assert.deepEqual(results.map(result => result.name), ['Friend', 'Another'])
  assert.deepEqual(results.map(result => result.status), ['reachable', 'restricted'])
})

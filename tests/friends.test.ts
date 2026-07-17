import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'
import {
  chooseInitialFriends,
  fetchFriends,
  FRIENDS_CACHE_KEY,
  FRIENDS_CACHE_MAX_BYTES,
  FRIENDS_CACHE_TTL_MS,
  normalizeFriends,
  readFriendsCache,
  refreshFriends,
  sameFriends,
  shuffleFriends,
  writeFriendsCache,
} from '../utils/friends.ts'

const friend = {
  avatar: 'https://example.com/avatar.png',
  name: 'Friend',
  url: 'https://example.com',
  color: '#fff',
  blog: 'Blog',
  desc: 'Description',
}

class MemoryStorage {
  values = new Map<string, string>()

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }

  removeItem(key: string) {
    this.values.delete(key)
  }
}

test('normalizes a complete non-empty array and fills a missing blog name', () => {
  assert.deepEqual(normalizeFriends([{ ...friend, category: 'friend' }]), [friend])
  assert.deepEqual(normalizeFriends([{ ...friend, blog: undefined }]), [{ ...friend, blog: friend.name }])
  assert.deepEqual(normalizeFriends([{ ...friend }, { name: 'broken' }]), [])
  assert.deepEqual(normalizeFriends([]), [])
})

test('fetch rejects non-2xx responses', async () => {
  const fetchImpl = async () => new Response('no', { status: 503 })
  await assert.rejects(fetchFriends('https://example.com/links.json', fetchImpl))
})

test('fetch returns normalized friends', async () => {
  const fetchImpl = async () => Response.json([{ ...friend, category: 'friend' }])
  assert.deepEqual(await fetchFriends('https://example.com/links.json', fetchImpl), [friend])
})

test('cache is bounded, expires, and uses one key', () => {
  const storage = new MemoryStorage()
  const now = Date.now()

  assert.equal(writeFriendsCache(storage, [friend], now), true)
  assert.equal(storage.values.size, 1)
  assert.deepEqual(readFriendsCache(storage, now), [friend])
  assert.equal(readFriendsCache(storage, now + FRIENDS_CACHE_TTL_MS + 1), null)
  assert.equal(storage.getItem(FRIENDS_CACHE_KEY), null)
  assert.equal(FRIENDS_CACHE_MAX_BYTES, 128 * 1024)
})

test('oversized and corrupt cache records are rejected', () => {
  const storage = new MemoryStorage()
  const oversized = [{ ...friend, desc: 'x'.repeat(FRIENDS_CACHE_MAX_BYTES) }]

  assert.equal(writeFriendsCache(storage, oversized), false)
  assert.equal(storage.values.size, 0)

  storage.setItem(FRIENDS_CACHE_KEY, '{broken')
  assert.equal(readFriendsCache(storage), null)
  assert.equal(storage.getItem(FRIENDS_CACHE_KEY), null)
})

test('storage failures never break page rendering', () => {
  const storage = {
    getItem() {
      throw new Error('blocked')
    },
    setItem() {
      throw new Error('blocked')
    },
    removeItem() {
      throw new Error('blocked')
    },
  }

  assert.equal(readFriendsCache(storage), null)
  assert.equal(writeFriendsCache(storage, [friend]), false)
})

test('friend equality ignores display order', () => {
  const another = { ...friend, url: 'https://b.example' }
  assert.equal(sameFriends([friend, another], [another, friend]), true)
})

test('background refresh only replaces changed data and always refreshes the cache', async () => {
  const storage = new MemoryStorage()
  const reordered = [{ ...friend, url: 'https://b.example' }, friend]
  const current = [friend, reordered[0]]
  const unchangedFetch = async () => Response.json(reordered)

  const unchanged = await refreshFriends(current, {
    fetchImpl: unchangedFetch,
    storage,
    url: 'https://example.com/links.json',
  })

  assert.equal(unchanged.changed, false)
  assert.equal(unchanged.links, current)
  assert.deepEqual(readFriendsCache(storage), reordered)

  const updatedFriend = { ...friend, desc: 'Updated' }
  const changedFetch = async () => Response.json([updatedFriend])
  const changed = await refreshFriends(current, {
    fetchImpl: changedFetch,
    storage,
    url: 'https://example.com/links.json',
  })

  assert.equal(changed.changed, true)
  assert.deepEqual(changed.links, [updatedFriend])
})

test('shuffle returns a new array without mutating its input', () => {
  const another = { ...friend, url: 'https://b.example' }
  const input = [friend, another]

  assert.deepEqual(shuffleFriends(input, () => 0), [another, friend])
  assert.deepEqual(input, [friend, another])
})

test('build data wins and cache is only the empty-build fallback', () => {
  const cached = [{ ...friend, url: 'https://cached.example' }]

  assert.deepEqual(chooseInitialFriends([friend], cached), [friend])
  assert.deepEqual(chooseInitialFriends([], cached), cached)
  assert.deepEqual(chooseInitialFriends([], null), [])
})

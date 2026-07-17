export interface FriendLink {
  avatar: string
  name: string
  url: string
  color: string
  blog: string
  desc: string
}

export interface FriendsStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

interface FriendsCacheRecord {
  savedAt: number
  links: FriendLink[]
}

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

export const FRIENDS_CACHE_KEY = 'yunyoujun:friends:v1'
export const FRIENDS_CACHE_MAX_BYTES = 128 * 1024
export const FRIENDS_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000
export const FRIENDS_SOURCE_URL = 'https://friends.yunyoujun.cn/links.json'

function byteLength(value: string) {
  return new TextEncoder().encode(value).byteLength
}

function removeCache(storage: FriendsStorage) {
  try {
    storage.removeItem(FRIENDS_CACHE_KEY)
  }
  catch {
    // Storage may be disabled or unavailable in privacy mode.
  }
}

export function normalizeFriends(value: unknown): FriendLink[] {
  if (!Array.isArray(value) || value.length === 0)
    return []

  const links: FriendLink[] = []

  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item))
      return []

    const link = item as Record<string, unknown>
    const requiredFields = ['avatar', 'name', 'url', 'color', 'desc'] as const

    if (requiredFields.some(field => typeof link[field] !== 'string'))
      return []

    if (!link.avatar || !link.name || !link.url)
      return []

    if (link.blog != null && typeof link.blog !== 'string')
      return []

    links.push({
      avatar: link.avatar as string,
      name: link.name as string,
      url: link.url as string,
      color: link.color as string,
      blog: (link.blog as string | undefined) || link.name as string,
      desc: link.desc as string,
    })
  }

  return links
}

export async function fetchFriends(
  url: string,
  fetchImpl: FetchLike = fetch,
): Promise<FriendLink[]> {
  const response = await fetchImpl(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok)
    throw new Error(`Failed to fetch friends: HTTP ${response.status}`)

  const links = normalizeFriends(await response.json())

  if (links.length === 0)
    throw new Error('Failed to fetch friends: invalid or empty data')

  return links
}

export function readFriendsCache(
  storage: FriendsStorage,
  now = Date.now(),
): FriendLink[] | null {
  let raw: string | null

  try {
    raw = storage.getItem(FRIENDS_CACHE_KEY)
  }
  catch {
    return null
  }

  if (!raw)
    return null

  if (byteLength(raw) > FRIENDS_CACHE_MAX_BYTES) {
    removeCache(storage)
    return null
  }

  try {
    const record = JSON.parse(raw) as Partial<FriendsCacheRecord>

    if (
      !Number.isFinite(record.savedAt)
      || record.savedAt! < 0
      || record.savedAt! > now
      || now - record.savedAt! > FRIENDS_CACHE_TTL_MS
    ) {
      removeCache(storage)
      return null
    }

    const links = normalizeFriends(record.links)
    if (links.length === 0) {
      removeCache(storage)
      return null
    }

    return links
  }
  catch {
    removeCache(storage)
    return null
  }
}

export function writeFriendsCache(
  storage: FriendsStorage,
  value: unknown,
  savedAt = Date.now(),
) {
  const links = normalizeFriends(value)
  if (links.length === 0)
    return false

  const serialized = JSON.stringify({ savedAt, links } satisfies FriendsCacheRecord)
  if (byteLength(serialized) > FRIENDS_CACHE_MAX_BYTES)
    return false

  try {
    storage.setItem(FRIENDS_CACHE_KEY, serialized)
    return true
  }
  catch {
    return false
  }
}

function canonicalFriends(links: FriendLink[]) {
  return [...links].sort((a, b) => {
    const urlOrder = a.url.localeCompare(b.url)
    return urlOrder || a.name.localeCompare(b.name)
  })
}

export function sameFriends(left: FriendLink[], right: FriendLink[]) {
  return JSON.stringify(canonicalFriends(left)) === JSON.stringify(canonicalFriends(right))
}

export async function refreshFriends(
  current: FriendLink[],
  options: {
    fetchImpl?: FetchLike
    storage: FriendsStorage
    url: string
  },
) {
  const links = await fetchFriends(options.url, options.fetchImpl)
  writeFriendsCache(options.storage, links)

  if (sameFriends(current, links))
    return { changed: false as const, links: current }

  return { changed: true as const, links }
}

export function chooseInitialFriends(buildLinks: unknown, cachedLinks: unknown) {
  const normalizedBuildLinks = normalizeFriends(buildLinks)
  if (normalizedBuildLinks.length > 0)
    return normalizedBuildLinks

  return normalizeFriends(cachedLinks)
}

export function shuffleFriends(
  links: FriendLink[],
  random: () => number = Math.random,
) {
  const shuffled = [...links]

  for (let index = shuffled.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }

  return shuffled
}

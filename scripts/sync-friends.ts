import type { FriendLink } from '../utils/friends.ts'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { fetchFriends } from '../utils/friends.ts'

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

interface SyncLogger {
  info: (message: string) => void
  warn: (message: string) => void
}

export interface SyncFriendsOptions {
  fetchImpl?: FetchLike
  logger?: SyncLogger
  outputFile?: string
  url?: string
}

export const FRIENDS_SOURCE_URL = 'https://friends.yunyoujun.cn/links.json'
export const FRIENDS_GENERATED_FILE = resolve('.valaxy/friends.generated.ts')

function renderFriendsModule(links: FriendLink[]) {
  return `import type { FriendLink } from '../utils/friends'

const friends = ${JSON.stringify(links, null, 2)} satisfies FriendLink[]

export default friends
`
}

async function writeFriendsModule(outputFile: string, links: FriendLink[]) {
  await mkdir(dirname(outputFile), { recursive: true })

  const temporaryFile = `${outputFile}.${process.pid}.${Date.now()}.tmp`
  await writeFile(temporaryFile, renderFriendsModule(links), 'utf8')
  await rename(temporaryFile, outputFile)
}

export async function syncFriends(options: SyncFriendsOptions = {}) {
  const {
    fetchImpl = fetch,
    logger = console,
    outputFile = FRIENDS_GENERATED_FILE,
    url = FRIENDS_SOURCE_URL,
  } = options

  try {
    const links = await fetchFriends(url, fetchImpl)
    await writeFriendsModule(outputFile, links)
    logger.info(`[friends] Synced ${links.length} links from ${url}`)
    return { count: links.length, source: 'remote' as const }
  }
  catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    await writeFriendsModule(outputFile, [])
    logger.warn(`[friends] Remote sync failed, using runtime fallback: ${reason}`)
    return { count: 0, source: 'fallback' as const }
  }
}

const isExecutedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isExecutedDirectly)
  await syncFriends()

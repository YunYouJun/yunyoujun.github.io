import type { FriendLink } from '../utils/friends.ts'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import hiddenFriends, { friendOverrides } from '../config/friends.ts'
import {
  applyFriendOverrides,
  fetchFriends,
  FRIENDS_SOURCE_URL,
  friendUrlKey,
} from '../utils/friends.ts'

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

export type FriendHealthStatus = 'reachable' | 'restricted' | 'unreachable'

export interface FriendHealthResult {
  durationMs: number
  finalUrl?: string
  httpStatus?: number
  knownHidden: boolean
  name: string
  reason?: string
  status: FriendHealthStatus
  url: string
}

export interface FriendHealthReport {
  checkedAt: string
  results: FriendHealthResult[]
  source: string
  summary: {
    knownHidden: number
    newUnreachable: number
    reachable: number
    recovered: number
    restricted: number
    unreachable: number
  }
}

interface CheckFriendOptions {
  attempts?: number
  fetchImpl?: FetchLike
  timeoutMs?: number
}

interface CheckFriendsOptions extends CheckFriendOptions {
  concurrency?: number
}

interface RunHealthCheckOptions extends CheckFriendsOptions {
  friends?: FriendLink[]
  outputFile?: string
  sourceUrl?: string
}

const DEFAULT_ATTEMPTS = 2
const DEFAULT_CONCURRENCY = 8
const DEFAULT_OUTPUT_FILE = resolve('.valaxy/friends-health.json')
const DEFAULT_TIMEOUT_MS = 10_000

export function classifyHttpStatus(status: number): FriendHealthStatus {
  if (status >= 200 && status < 400)
    return 'reachable'

  if ([401, 403, 407, 429].includes(status))
    return 'restricted'

  return 'unreachable'
}

function describeError(error: unknown) {
  if (!(error instanceof Error))
    return String(error)

  const cause = (error as Error & {
    cause?: { code?: string, message?: string }
  }).cause
  const detail = [cause?.code, cause?.message].filter(Boolean).join(': ')

  return detail || error.message
}

export async function checkFriendSite(
  friend: FriendLink,
  options: CheckFriendOptions = {},
): Promise<FriendHealthResult> {
  const {
    attempts = DEFAULT_ATTEMPTS,
    fetchImpl = fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options
  const startedAt = Date.now()
  let lastReason = 'Unknown error'

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetchImpl(friend.url, {
        headers: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'user-agent': 'Mozilla/5.0 (compatible; YunYouJunFriendsHealth/1.0; +https://www.yunyoujun.cn/links/)',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
      })
      const status = classifyHttpStatus(response.status)
      await response.body?.cancel().catch(() => {})

      if (status === 'unreachable' && response.status >= 500 && attempt + 1 < attempts) {
        lastReason = `HTTP ${response.status}`
        continue
      }

      return {
        durationMs: Date.now() - startedAt,
        finalUrl: response.url || friend.url,
        httpStatus: response.status,
        knownHidden: false,
        name: friend.name,
        reason: status === 'reachable' ? undefined : `HTTP ${response.status}`,
        status,
        url: friend.url,
      }
    }
    catch (error) {
      lastReason = describeError(error)
      if (attempt + 1 < attempts)
        continue
    }
  }

  return {
    durationMs: Date.now() - startedAt,
    knownHidden: false,
    name: friend.name,
    reason: lastReason,
    status: 'unreachable',
    url: friend.url,
  }
}

export async function checkFriends(
  friends: FriendLink[],
  options: CheckFriendsOptions = {},
) {
  const concurrency = Math.max(1, options.concurrency ?? DEFAULT_CONCURRENCY)
  const results: FriendHealthResult[] = []
  let nextIndex = 0

  async function worker() {
    while (nextIndex < friends.length) {
      const index = nextIndex++
      results[index] = await checkFriendSite(friends[index], options)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, friends.length) }, () => worker()),
  )

  return results
}

export async function runHealthCheck(options: RunHealthCheckOptions = {}) {
  const sourceUrl = options.sourceUrl ?? FRIENDS_SOURCE_URL
  const sourceFriends = options.friends ?? await fetchFriends(sourceUrl)
  const friends = applyFriendOverrides(sourceFriends, friendOverrides)
  const knownUrls = new Set(friends.map(friend => friend.url))
  for (const friend of hiddenFriends) {
    if (!knownUrls.has(friend.url))
      friends.push(friend)
  }
  const hiddenUrls = new Set(hiddenFriends.map(friend => friendUrlKey(friend.url)))
  const results = (await checkFriends(friends, options)).map(result => ({
    ...result,
    knownHidden: hiddenUrls.has(friendUrlKey(result.url)),
  }))
  const knownHidden = results.filter(result => result.knownHidden).length
  const newUnreachable = results.filter(
    result => result.status === 'unreachable' && !result.knownHidden,
  ).length
  const recovered = results.filter(
    result => result.status === 'reachable' && result.knownHidden,
  ).length
  const report: FriendHealthReport = {
    checkedAt: new Date().toISOString(),
    results,
    source: sourceUrl,
    summary: {
      knownHidden,
      newUnreachable,
      reachable: results.filter(result => result.status === 'reachable').length,
      recovered,
      restricted: results.filter(result => result.status === 'restricted').length,
      unreachable: results.filter(result => result.status === 'unreachable').length,
    },
  }
  const outputFile = options.outputFile ?? DEFAULT_OUTPUT_FILE

  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  return { outputFile, report }
}

function numberArgument(name: string, fallback: number) {
  const prefix = `--${name}=`
  const argument = process.argv.find(value => value.startsWith(prefix))
  const value = Number(argument?.slice(prefix.length))
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function stringArgument(name: string, fallback: string) {
  const prefix = `--${name}=`
  return process.argv.find(value => value.startsWith(prefix))?.slice(prefix.length) || fallback
}

async function main() {
  const { outputFile, report } = await runHealthCheck({
    attempts: numberArgument('attempts', DEFAULT_ATTEMPTS),
    concurrency: numberArgument('concurrency', DEFAULT_CONCURRENCY),
    outputFile: resolve(stringArgument('output', DEFAULT_OUTPUT_FILE)),
    timeoutMs: numberArgument('timeout', DEFAULT_TIMEOUT_MS),
  })

  for (const result of report.results) {
    if (result.status === 'reachable' && result.knownHidden) {
      console.info(`[friends] recovered: ${result.name} <${result.url}>`)
      continue
    }

    if (result.status === 'reachable')
      continue

    const detail = result.httpStatus ? `HTTP ${result.httpStatus}` : result.reason
    const status = result.knownHidden ? 'known-hidden' : result.status
    console.warn(`[friends] ${status}: ${result.name} <${result.url}> (${detail})`)
  }

  console.info(
    `[friends] Checked ${report.results.length}: ${report.summary.reachable} reachable, ${report.summary.restricted} restricted, ${report.summary.unreachable} unreachable; ${report.summary.knownHidden} known hidden, ${report.summary.newUnreachable} new candidates, ${report.summary.recovered} recovered`,
  )
  console.info(`[friends] Report: ${outputFile}`)

  if (process.argv.includes('--strict') && report.summary.newUnreachable > 0)
    process.exitCode = 1
}

const isExecutedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isExecutedDirectly)
  await main()

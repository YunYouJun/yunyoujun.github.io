import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { DevframeServiceInput } from 'devframe/types'
// eslint-disable-next-line test/no-import-node-test
import type { TestContext } from 'node:test'
import type { Plugin } from 'vite'
import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'
import ValaxyDevtools from '@valaxyjs/devtools'
import { createPluginFromDevframe } from '@vitejs/devtools-kit/node'
import { createServer } from 'vite'

const openService = '@devframes/service-open'
const testFrameMetadata = {
  version: '0.0.0',
  packageName: '@test/devtools',
  homepage: 'https://example.invalid',
  description: 'DevTools service lifecycle test',
  importMetaUrl: import.meta.url,
}

async function startDevtools(t: TestContext, plugins: Plugin[]) {
  const installations: DevframeServiceInput[] = []
  let context: ViteDevToolsNodeContext | undefined
  const probe: Plugin = {
    name: 'test:devtools-services',
    configResolved(config) {
      for (const plugin of config.plugins) {
        if (!plugin.devtools)
          continue
        const hooks = plugin.devtools as typeof plugin.devtools & {
          prepare?: (ctx: ViteDevToolsNodeContext) => void | Promise<void>
        }
        for (const phase of ['prepare', 'setup'] as const) {
          const hook = hooks[phase]
          if (!hook)
            continue
          hooks[phase] = async (ctx) => {
            if (!context) {
              context = ctx
              const install = ctx.services.install.bind(ctx.services)
              t.mock.method(ctx.services, 'install', (input: DevframeServiceInput, options: Parameters<typeof install>[1]) => {
                if (input.package === openService)
                  installations.push(input)
                return install(input, options)
              })
            }
            await hook(ctx)
          }
        }
      }
    },
  }
  const server = await createServer({
    configFile: false,
    plugins: [...plugins, probe],
    devtools: { banner() {} },
    server: { middlewareMode: true, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  })
  t.after(() => server.close())
  assert.ok(context, 'DevTools must initialize')
  return { context, installations }
}

test('Valaxy owns its RPCs while Vite messages keep the shared open service', async (t) => {
  const previousEditor = process.env.LAUNCH_EDITOR
  process.env.LAUNCH_EDITOR = 'code'
  t.after(() => {
    if (previousEditor === undefined)
      delete process.env.LAUNCH_EDITOR
    else
      process.env.LAUNCH_EDITOR = previousEditor
  })

  const { context, installations } = await startDevtools(t, [ValaxyDevtools({ userRoot: process.cwd() })])
  assert.equal(installations.length, 1, 'service-open must not be installed again after initialization')
  const getOptions = context.rpc.invokeLocal.bind(context.rpc) as (method: string) => Promise<{ editor: string }>
  assert.equal((await getOptions('valaxy:get-options')).editor, 'code')
  const highlight = context.rpc.invokeLocal.bind(context.rpc) as (name: string, input: { code: string, lang: string }) => Promise<{ html: string }>
  assert.match((await highlight('valaxy:service:shiki:highlight', { code: '{\"ready\":true}', lang: 'json' })).html, /ready/)
  assert.equal(context.services.has('@devframes/service-shiki'), false)
  const titles = context.frames.map(frame => frame.title)
  for (const title of ['Valaxy', 'Messages', 'Terminals', 'Devframe Inspector'])
    assert.ok(titles.includes(title), `${title} must remain available`)
})

test('Vite messages still install the open service without Valaxy', async (t) => {
  const { installations } = await startDevtools(t, [])
  assert.equal(installations.length, 1)
})

test('Valaxy services finish installing when another frame initialized the host first', async (t) => {
  const earlierFrame = createPluginFromDevframe({
    ...testFrameMetadata,
    id: 'earlier-frame',
    name: 'Earlier frame',
    setup() {},
  })
  const { context, installations } = await startDevtools(t, [earlierFrame, ValaxyDevtools({ userRoot: process.cwd() })])
  assert.equal(installations.length, 1, 'Valaxy must not reinstall the host open service')
  const highlight = context.rpc.invokeLocal.bind(context.rpc) as (name: string, input: { code: string, lang: string }) => Promise<{ html: string }>
  assert.match((await highlight('valaxy:service:shiki:highlight', { code: 'const x = 1', lang: 'typescript' })).html, /const/)
})

test('a late Valaxy frame initializes independently of pending host services', async (t) => {
  const { context } = await startDevtools(t, [])
  const started = Promise.withResolvers<void>()
  const release = Promise.withResolvers<void>()
  const installing = context.services.install({
    package: '@test/delayed-service',
    version: '1.0.0',
    scope: 'test:delayed',
    async setup() {
      started.resolve()
      await release.promise
      return { ready: true }
    },
  })
  try {
    await started.promise
    const plugin = ValaxyDevtools({ userRoot: process.cwd() })
    t.after(async () => {
      if (typeof plugin.closeBundle === 'function')
        await plugin.closeBundle.call({} as never)
    })
    await plugin.devtools!.setup(context)
    const highlight = context.rpc.invokeLocal.bind(context.rpc) as (name: string, input: { code: string, lang: string }) => Promise<{ html: string }>
    assert.match((await highlight('valaxy:service:shiki:highlight', { code: 'late', lang: 'text' })).html, /late/)
  }
  finally {
    release.resolve()
    await installing
  }
})

import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'

interface CmsCollection {
  fields?: Record<string, { type: string }>
  id: string
  root: string
}

interface CmsManifest {
  collections: CmsCollection[]
  help?: {
    url?: string
  }
  onboarding?: {
    steps: Array<{
      collectionId?: string
    }>
  }
  version: number
  workflow?: {
    defaultBaseRef?: string
  }
}

const repositoryRoot = resolve(import.meta.dirname, '..')
const manifestPath = resolve(repositoryRoot, '.yunlefun/cms.json')

async function readManifest() {
  return JSON.parse(await readFile(manifestPath, 'utf8')) as CmsManifest
}

test('CMS manifest targets the content branch and existing collection roots', async () => {
  const manifest = await readManifest()

  assert.equal(manifest.version, 1)
  assert.equal(manifest.workflow?.defaultBaseRef, 'valaxy')
  assert.match(manifest.help?.url ?? '', /\/blob\/valaxy\/docs\/cms\.md$/)

  const collectionIds = manifest.collections.map(collection => collection.id)
  assert.equal(new Set(collectionIds).size, collectionIds.length)

  await Promise.all(manifest.collections.map(collection =>
    access(resolve(repositoryRoot, collection.root)),
  ))
})

test('CMS onboarding only links to declared collections', async () => {
  const manifest = await readManifest()
  const collectionIds = new Set(manifest.collections.map(collection => collection.id))
  const linkedCollectionIds = manifest.onboarding?.steps
    .flatMap(step => step.collectionId ? [step.collectionId] : []) ?? []

  for (const collectionId of linkedCollectionIds)
    assert.equal(collectionIds.has(collectionId), true, `Unknown collection: ${collectionId}`)
})

test('CMS keeps Valaxy date-time frontmatter editable without truncation', async () => {
  const manifest = await readManifest()

  for (const collection of manifest.collections) {
    for (const fieldName of ['date', 'updated']) {
      const field = collection.fields?.[fieldName]
      if (field)
        assert.equal(field.type, 'string', `${collection.id}.${fieldName} must preserve date and time`)
    }
  }
})

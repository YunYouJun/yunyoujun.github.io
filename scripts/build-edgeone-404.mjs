import { readFile, writeFile } from 'node:fs/promises'

// EdgeOne bundles this document into its middleware, so direct requests can
// serve the same HTML as the static fallback without an extra request.
const html = await readFile('dist/404.html', 'utf8')
await writeFile('.edgeone-not-found.mjs', `export default ${JSON.stringify(html)}\n`)

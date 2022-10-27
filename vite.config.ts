import { defineConfig } from 'vite'
import RemoteAssets from 'vite-plugin-remote-assets'

export default defineConfig({
  plugins: [RemoteAssets()],
})

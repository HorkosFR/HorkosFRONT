import path from 'node:path'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'
import prerender from '@prerenderer/rollup-plugin'
import vue from '@vitejs/plugin-vue'
import axios from 'axios'
import { defineConfig, loadEnv } from 'vite'
import vuetify from 'vite-plugin-vuetify'

async function getRoutes (apiBaseUrl: string) {
  const routes = ['/', '/us']

  try {
    const response = await axios.get(`${apiBaseUrl}/render/ids`)
    const ids = response.data

    ids.forEach((id: string) => {
      routes.push(id)
    })
    console.log(`${routes.length} routes prêtes pour le pré-rendu.`)
  } catch (error) {
    console.error('Erreur lors de la récupération des routes, pré-rendu limité aux pages de base.', error.message)
  }
  return routes
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const apiBaseUrl = env.VITE_API_BASE_URL
  const shouldPrerender = env.VITE_PRERENDER === 'true'
  const allRoutes = shouldPrerender ? await getRoutes(apiBaseUrl) : []
  const plugins = [
    vue(),
    vuetify({ autoImport: true }),
  ]
  if (shouldPrerender) {
    plugins.push(
      prerender({
        routes: allRoutes,
        renderer: new PuppeteerRenderer({
          renderAfterTime: 2000,
          maxConcurrentRoutes: 10,
          headless: false,
          args: [
            '--disable-web-security',
            '--allow-running-insecure-content',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-site-isolation-trials',
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        }),
      }),
    )
  }
  return {
    plugins,
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    css: {
      preprocessorOptions: {
        scss: { additionalData: `@use "@/styles/_variables.scss" as *;` },
      },
    },
    define: {
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL || ''),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
  }
})

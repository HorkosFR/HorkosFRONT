// scripts/generate-sitemap.mjs (en .mjs pour le support de l'import/export)
import fs from 'node:fs'
import axios from 'axios'

async function generate () {
  const BASE_URL = 'https://horkos.fr'
  const ENTITY_ENDPOINT = 'https://horkos-prod-as.azurewebsites.net/api/render/ids'

  try {
    const response = await axios.get(ENTITY_ENDPOINT)
    const routeRsp = response.data

    const routes = ['', '/us', '/home']

    for (const r of routeRsp) {
      routes.push(r)
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      route => `
    <url>
      <loc>${BASE_URL}${route}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>`,
    )
    .join('')}
</urlset>`

    fs.writeFileSync('./public/sitemap.xml', sitemap)
    console.log(`✅ Sitemap généré avec ${routes.length} entités.`)
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error.message)
  }
}

generate()

import 'dotenv/config'
import express from 'express'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.API_PORT || 4174)
const apiKey = process.env.NEWS_API_KEY
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

app.get('/api/health', (_request, response) => response.json({ ok: true, configured: Boolean(apiKey) }))
app.get('/api/news', async (request, response) => {
  if (!apiKey) {
    response.json({ configured: false, articles: [] })
    return
  }
  const query = String(request.query.q || 'artificial intelligence').trim().slice(0, 120)
  if (!query) {
    response.status(400).json({ error: 'A search query is required.' })
    return
  }
  try {
    const params = new URLSearchParams({ q: query, language: 'en', sortBy: 'publishedAt', pageSize: '12', apiKey })
    const upstream = await fetch(`https://newsapi.org/v2/everything?${params}`, { signal: AbortSignal.timeout(9000) })
    const payload = await upstream.json()
    if (!upstream.ok || payload.status !== 'ok') {
      response.status(502).json({ error: payload.message || 'The news source could not complete this request.' })
      return
    }
    const articles = (payload.articles || []).filter((item) => item.title && item.title !== '[Removed]').map((item, index) => ({
      slug: `source-${index}-${slugify(item.title)}`,
      title: item.title,
      excerpt: item.description || 'Open the original source for the full story.',
      category: 'AI & Tech',
      author: item.source?.name || item.author || 'News source',
      readTime: '4 min read',
      image: item.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      body: [item.description || item.title, item.content || 'Continue to the original publisher for the complete article.'],
      sourceUrl: item.url,
      sourceType: 'live',
    }))
    response.json({ configured: true, articles })
  } catch (error) {
    const message = error.name === 'TimeoutError' ? 'The news source took too long to respond.' : 'The news source is temporarily unavailable.'
    response.status(502).json({ error: message })
  }
})

app.use(express.static(resolve(projectRoot, 'dist')))
app.use((request, response, next) => {
  if (request.method === 'GET' && !request.path.startsWith('/api/')) {
    return response.sendFile(resolve(projectRoot, 'dist', 'index.html'))
  }
  next()
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Signal API listening on http://127.0.0.1:${port}`)
  console.log(apiKey ? 'NewsAPI key found; live headlines are enabled.' : 'No NewsAPI key found; serving the sample edition.')
})

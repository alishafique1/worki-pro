import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'deploy', 'dist')
const API_PORT = parseInt(process.env.API_PORT || '3001', 10)
const WEB_PORT = parseInt(process.env.PORT || process.env.WEB_PORT || '3003', 10)

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  // Proxy API and auth requests to the Wasp server
  if (req.url.startsWith('/api/') || req.url.startsWith('/auth/')) {
    const options = {
      hostname: '127.0.0.1',
      port: API_PORT,
      path: req.url,
      method: req.method,
      headers: { ...req.headers },
    }
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res)
    })
    proxyReq.on('error', () => {
      res.writeHead(502, { 'Content-Type': 'text/plain' })
      res.end('Bad Gateway')
    })
    req.pipe(proxyReq)
    return
  }

  // Serve static SPA files
  let filePath = req.url === '/' ? '/index.html' : req.url
  const fullPath = path.join(distDir, filePath)

  fs.access(fullPath, fs.constants.R_OK, (err) => {
    if (err) {
      // SPA fallback — serve index.html for client-side routing
      const fallback = path.join(distDir, 'index.html')
      fs.readFile(fallback, (err2, data) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' })
          res.end('Not Found')
          return
        }
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(data)
      })
      return
    }
    const ext = path.extname(fullPath)
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    fs.readFile(fullPath, (err2, data) => {
      if (err2) {
        res.writeHead(404)
        res.end()
        return
      }
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable' })
      res.end(data)
    })
  })
})

server.listen(WEB_PORT, () => {
  console.log(`Web-app server listening on port ${WEB_PORT}, proxying API to :${API_PORT}`)
})

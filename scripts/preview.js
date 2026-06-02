'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const PORT = 8080
const DOCS = path.resolve(__dirname, '..', 'docs')
const BASE = '/chillshse/'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

http.createServer(function (req, res) {
  var pathname = url.parse(req.url).pathname

  if (pathname.startsWith(BASE)) {
    pathname = '/' + pathname.slice(BASE.length)
  }

  if (pathname === '/') pathname = '/index.html'

  var filePath = path.join(DOCS, pathname)

  function serve(fPath) {
    fs.readFile(fPath, function (err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('404 Not found: ' + pathname)
        return
      }
      var ext = path.extname(fPath).toLowerCase()
      var mime = MIME[ext] || 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': mime })
      res.end(data)
    })
  }

  fs.access(filePath, function (err) {
    if (!err) {
      serve(filePath)
    } else {
      serve(filePath + '.html')
    }
  })
}).listen(PORT, function () {
  console.log('Preview: http://localhost:' + PORT + '/')
})

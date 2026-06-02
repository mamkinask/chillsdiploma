const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    /**
     * dev_build — страницы из webpack (таймлайн, гиды и т.д.).
     * docs/pages — 100+ статических карточек произведений (generate-pages.js).
     * Без второй папки ссылки с таймлайна дают Cannot GET /pages/frankenstein.html.
     */
    static: [
      { directory: path.join(projectRoot, 'dev_build') },
      { directory: path.join(projectRoot, 'docs/pages'), publicPath: '/pages' }
    ],
    devMiddleware: { writeToDisk: true },
    /**
     * Запросы без расширения .html (например /pages/diagnostics) иначе дают 404:
     * на диске лежит pages/diagnostics.html. Переписываем URL до *.html.
     * Учитывается publicPath /chillshse/.
     */
    setupMiddlewares: function (middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }
      middlewares.unshift({
        name: 'pages-strip-extensionless',
        middleware: function (req, _res, next) {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next()
          }
          try {
            var raw = req.url || '/'
            var q = raw.indexOf('?')
            var pathPart = q === -1 ? raw : raw.slice(0, q)
            var search = q === -1 ? '' : raw.slice(q)
            var m = pathPart.match(/^(\/chillshse)?\/pages\/([^/.?]+)$/)
            if (m && !pathPart.endsWith('.html')) {
              var prefix = m[1] || ''
              req.url = prefix + '/pages/' + m[2] + '.html' + search
            }
          } catch (e) {
            /* ignore */
          }
          next()
        }
      })
      return middlewares
    }
  },
  output: {
    path: path.resolve('.', 'dev_build'),
    clean: true
  }
})

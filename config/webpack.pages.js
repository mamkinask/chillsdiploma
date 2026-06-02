const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const path = require('path')

function createPage(template, filename, chunks, extraOptions = {}) {
  return new HtmlWebpackPlugin({
    template: template,
    filename: filename,
    chunks: chunks,
    ...extraOptions
  })
}

function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildTimelinePrerenderHtml() {
  const projectRoot = path.resolve(__dirname, '..')
  const timelinePath = path.join(projectRoot, 'src', 'assets', 'data', 'timeline_media.json')
  const placeholder = '../assets/media/elements_pictures/place-holder-picture.png'

  let items = []
  try {
    items = JSON.parse(fs.readFileSync(timelinePath, 'utf8'))
  } catch (e) {
    return '<div class="timeline-loading">НЕТ ДАННЫХ</div>'
  }

  const byYear = new Map()
  for (const item of items) {
    const y = Number(item?.Year)
    if (!y || Number.isNaN(y)) continue
    if (!byYear.has(y)) byYear.set(y, [])
    byYear.get(y).push(item)
  }

  const years = Array.from(byYear.keys()).sort((a, b) => a - b)
  if (years.length === 0) return '<div class="timeline-loading">НЕТ ДАННЫХ</div>'

  function renderCard(item) {
    const title = escHtml(item?.Title || '')
    const type = escHtml(item?.Type || 'Неизвестно')
    const cover = escHtml(item?.Cover || placeholder)
    const genreStr = String(item?.Subgenres || item?.Genres || '')
    const genres = genreStr.split('|').map(s => s.trim()).filter(Boolean).slice(0, 3)
    const genreHtml = genres.length ? '<div class="genres">' + genres.map(g => '‼ ' + escHtml(g)).join('<br>') + '</div>' : ''
    const descRaw = String(item?.Description || '')
    const desc = descRaw ? escHtml(descRaw.slice(0, 80) + (descRaw.length > 80 ? '…' : '')) : ''
    const descHtml = desc ? '<div class="desc">' + desc + '</div>' : ''
    const href = item?.id ? ' href="' + escHtml(item.id) + '.html?from=timeline.html&root=timeline.html"' : ''

    return (
      '<a class="timeline-card"' + href + '>' +
        '<div class="timeline-card-img">' +
          '<img src="' + cover + '" alt="' + title + '" loading="lazy" onerror="this.src=' + escHtml("'" + placeholder + "'") + ';this.onerror=null;">' +
        '</div>' +
        '<div class="timeline-card-info">' +
          '<div class="media-type">▷ ' + type + '</div>' +
          genreHtml +
          descHtml +
        '</div>' +
      '</a>'
    )
  }

  return years.map((year) => {
    const cards = byYear.get(year) || []
    return (
      '<div class="year-group">' +
        '<div class="year-header">' +
          '<div class="year-label">[ ' + escHtml(year) + ' ]</div>' +
          '<div class="year-tick"></div>' +
        '</div>' +
        '<div class="card-row">' + cards.map(renderCard).join('') + '</div>' +
      '</div>'
    )
  }).join('')
}

const htmlPages = [
  createPage('./src/pages/index.html', './index.html', ['shared', 'home']),
  createPage('./src/pages/diagnostics.html', './pages/diagnostics.html', ['shared', 'diagnostics']),
  createPage('./src/pages/diagnostics-test.html', './pages/diagnostics-test.html', ['shared', 'diagnostics-test']),
  new HtmlWebpackPlugin({
    filename: './pages/timeline.html',
    chunks: ['shared', 'timeline'],
    templateContent: function () {
      const projectRoot = path.resolve(__dirname, '..')
      const templatePath = path.join(projectRoot, 'src', 'pages', 'timeline.html')
      const base = fs.readFileSync(templatePath, 'utf8')
      const prerender = buildTimelinePrerenderHtml()
      // html-loader мешает lodash-шаблонам, поэтому делаем подстановку вручную
      return base.replace('<!-- TIMELINE_PRERENDER -->', prerender)
    }
  }),
  createPage('./src/pages/articles.html', './pages/articles.html', ['shared', 'articles']),
  createPage('./src/pages/guide_horror_robot.html', './pages/guide_horror_robot.html', ['shared', 'guide-robot']),
  createPage('./src/pages/found_footage.html', './pages/found_footage.html', ['shared', 'guide-found-footage']),
  createPage('./src/pages/pagan_cults.html', './pages/pagan_cults.html', ['shared', 'guide-pagan-cults']),
  createPage('./src/pages/survival_horror.html', './pages/survival_horror.html', ['shared', 'guide-survival-horror']),
  createPage('./src/pages/body_horror.html', './pages/body_horror.html', ['shared', 'guide-body-horror']),
  createPage('./src/pages/child_imagery.html', './pages/child_imagery.html', ['shared', 'guide-child-imagery']),
  createPage('./src/pages/without_monster.html', './pages/without_monster.html', ['shared', 'guide-without-monster']),
  createPage('./src/pages/scandinavian.html', './pages/scandinavian.html', ['shared', 'guide-scandinavian']),
  createPage('./src/pages/paper_nightmares.html', './pages/paper_nightmares.html', ['shared', 'guide-paper-nightmares']),
  createPage('./src/pages/gothic.html', './pages/gothic.html', ['shared', 'guide-gothic']),
  createPage('./src/pages/object.html', './pages/object.html', ['shared', 'object-from', 'object']),
  createPage('./src/pages/search.html', './pages/search.html', ['shared', 'search']),
  createPage('./src/pages/routes.html', './pages/routes.html', ['shared', 'routes'])
]

module.exports = htmlPages

'use strict'

const fs = require('fs')
const path = require('path')

const DATA_PATH = path.resolve(__dirname, '../src/assets/data/horror_media.json')
const TIMELINE_DATA_PATH = path.resolve(__dirname, '../src/assets/data/timeline_media.json')
const OUTPUT_DIR = path.resolve(__dirname, '../docs/pages')
const PROJECT_ROOT = path.resolve(__dirname, '..')
const PLACEHOLDER = '../assets/media/elements_pictures/place-holder-picture.png'

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))

function coverExists(item) {
  if (!item.Cover || String(item.Cover).includes('place-holder')) return false
  var rel = String(item.Cover).replace(/^\.\.\//, '')
  return fs.existsSync(path.join(PROJECT_ROOT, 'src', rel))
}

var timelineData = data.filter(coverExists)

var TRAILER_FALLBACK_COVERS = [
  '../assets/media/trailers_pictures/trailer-cover-2.png',
  '../assets/media/trailers_pictures/trailer-cover-3.png'
]

function pickTrailerFallbackCover(seed) {
  var s = String(seed || '')
  var hash = 0
  for (var i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0
  }
  return TRAILER_FALLBACK_COVERS[Math.abs(hash) % TRAILER_FALLBACK_COVERS.length]
}

function trailerImageExists(relative) {
  if (!relative) return false
  var rel = String(relative).replace(/^\.\.\//, '')
  return fs.existsSync(path.join(PROJECT_ROOT, 'src', rel))
}

function resolveTrailerSrc(item) {
  if (item.TrailerCover && trailerImageExists(item.TrailerCover)) return item.TrailerCover
  var byId = '../assets/media/trailers_pictures/' + item.id + '.jpg'
  if (trailerImageExists(byId)) return byId
  return pickTrailerFallbackCover(item.id)
}

const byTitle = {}
data.forEach(function (item) {
  if (item.Title) byTitle[item.Title] = item
})

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildMetaRowU(label, value) {
  if (!value || !String(value).trim()) return ''
  return '<div class="meta-row">'
    + '<span class="meta-label">' + esc(label) + ':</span>'
    + '<span class="meta-value">' + esc(String(value)) + '</span>'
    + '</div>'
}

function buildMetaRowPlain(label, value) {
  if (!value || !String(value).trim()) return ''
  return '<div class="meta-row">'
    + '<span class="meta-label">' + esc(label) + ':</span>'
    + '<span class="meta-value meta-value--plain">' + esc(String(value)) + '</span>'
    + '</div>'
}

function buildMetaRowTags(label, value) {
  if (!value || !String(value).trim()) return ''
  var tags = String(value).split('|').map(function (s) { return s.trim() }).filter(Boolean)
  if (!tags.length) return ''
  return '<div class="meta-row">'
    + '<span class="meta-label">' + esc(label) + ':</span>'
    + '<div class="meta-tags">'
    + tags.map(function (t) { return '<span class="meta-tag">' + esc(t) + '</span>' }).join('')
    + '</div>'
    + '</div>'
}

var WORK_ARTICLES = {
  'alien': [
    { title: '«Анатомия паники»: полная эволюция жанра «боди-хоррор»', href: 'body_horror.html', cover: '../assets/media/guides_pictures/cover-body-horror.png', guide: 'body-horror', section: 'НАВИГАТОРЫ', readTime: '5 минут' },
    { title: 'Аниматроники и механическая резня: о том, почему нас пугают роботы', href: 'guide_horror_robot.html', cover: '../assets/media/elements_pictures/GuideRobot.png', guide: 'robot', section: 'НАВИГАТОРЫ', readTime: '7 минут' }
  ],
  'dead-space': [
    { title: '«Анатомия паники»: полная эволюция жанра «боди-хоррор»', href: 'body_horror.html', cover: '../assets/media/guides_pictures/cover-body-horror.png', guide: 'body-horror', section: 'НАВИГАТОРЫ', readTime: '5 минут' }
  ],
  'the-thing': [
    { title: '«Анатомия паники»: полная эволюция жанра «боди-хоррор»', href: 'body_horror.html', cover: '../assets/media/guides_pictures/cover-body-horror.png', guide: 'body-horror', section: 'НАВИГАТОРЫ', readTime: '5 минут' }
  ],
  'alien-isolation': [
    { title: 'Искусство Выживания: Эволюция Survival Horror в видеоиграх', href: 'survival_horror.html', cover: '../assets/media/guides_pictures/cover-survival-horror.png', guide: 'survival-horror', section: 'НАВИГАТОРЫ', readTime: '5 минут' }
  ],
  'amnesia-the-dark-descent': [
    { title: 'Искусство Выживания: Эволюция Survival Horror в видеоиграх', href: 'survival_horror.html', cover: '../assets/media/guides_pictures/cover-survival-horror.png', guide: 'survival-horror', section: 'НАВИГАТОРЫ', readTime: '5 минут' }
  ],
  'silent-hill-1-game': [
    { title: 'Искусство Выживания: Эволюция Survival Horror в видеоиграх', href: 'survival_horror.html', cover: '../assets/media/guides_pictures/cover-survival-horror.png', guide: 'survival-horror', section: 'НАВИГАТОРЫ', readTime: '5 минут' }
  ],
  'rosemarys-baby': [
    { title: 'Не мило, а очень страшно: Образ ребёнка в хорроре', href: 'child_imagery.html', cover: '../assets/media/guides_pictures/cover-child-imagery.png', guide: 'child-imagery', section: 'НАВИГАТОРЫ', readTime: '5 минут' }
  ],
  'the-shining': [
    { title: 'Не мило, а очень страшно: Образ ребёнка в хорроре', href: 'child_imagery.html', cover: '../assets/media/guides_pictures/cover-child-imagery.png', guide: 'child-imagery', section: 'НАВИГАТОРЫ', readTime: '5 минут' }
  ],
  'it': [
    { title: 'Не мило, а очень страшно: Образ ребёнка в хорроре', href: 'child_imagery.html', cover: '../assets/media/guides_pictures/cover-child-imagery.png', guide: 'child-imagery', section: 'НАВИГАТОРЫ', readTime: '5 минут' }
  ]
}

function buildMetaHtml(item, year) {
  var t = item.Type
  var col1 = '', col2 = '', col3 = ''

  if (t === 'Фильм' || t === 'Сериал') {
    col1 = buildMetaRowU('Медиаформат', t)
         + buildMetaRowU('Год выпуска', year)
         + buildMetaRowTags('Поджанры', item.Subgenres)
    col2 = buildMetaRowU('Франшизы', item.FranchiseName)
         + buildMetaRowTags('Страны', item.Country)
         + buildMetaRowU('Режиссёр', item.Director)
         + buildMetaRowPlain('Рейтинг', item.Rating)
    col3 = buildMetaRowU('Платформы', item.Platform)
         + buildMetaRowPlain('Длительность', item.Duration)
         + buildMetaRowPlain('Возраст', item.AgeRating)
  } else if (t === 'Игра') {
    col1 = buildMetaRowU('Медиаформат', t)
         + buildMetaRowU('Год выпуска', year)
         + buildMetaRowTags('Поджанры', item.Subgenres)
    col2 = buildMetaRowU('Разработчик', item.Developer)
         + buildMetaRowU('Издатель', item.Publisher)
         + buildMetaRowPlain('Рейтинг', item.Rating)
    col3 = buildMetaRowU('Платформы', item.Platform)
         + buildMetaRowPlain('Возраст', item.AgeRating)
  } else if (t === 'Книга') {
    col1 = buildMetaRowU('Медиаформат', t)
         + buildMetaRowU('Год выпуска', year)
         + buildMetaRowTags('Поджанры', item.Subgenres)
    col2 = buildMetaRowU('Автор', item.Author)
         + buildMetaRowU('Издательство', item.Publisher)
         + buildMetaRowPlain('Страниц', item.Pages)
         + buildMetaRowPlain('Рейтинг', item.Rating)
    col3 = buildMetaRowPlain('Возраст', item.AgeRating)
  } else if (t === 'Комикс') {
    col1 = buildMetaRowU('Медиаформат', t)
         + buildMetaRowU('Год выпуска', year)
         + buildMetaRowTags('Поджанры', item.Subgenres)
    col2 = buildMetaRowU('Автор', item.Author)
         + buildMetaRowU('Издательство', item.Publisher)
         + buildMetaRowPlain('Выпусков', item.Issues)
         + buildMetaRowPlain('Рейтинг', item.Rating)
    col3 = buildMetaRowPlain('Возраст', item.AgeRating)
  } else {
    col1 = buildMetaRowU('Медиаформат', t)
         + buildMetaRowU('Год выпуска', year)
         + buildMetaRowTags('Поджанры', item.Subgenres)
    col2 = buildMetaRowPlain('Рейтинг', item.Rating)
    col3 = buildMetaRowPlain('Возраст', item.AgeRating)
  }

  return (col1 ? '<div class="meta-col">' + col1 + '</div>' : '')
       + (col2 ? '<div class="meta-col">' + col2 + '</div>' : '')
       + (col3 ? '<div class="meta-col">' + col3 + '</div>' : '')
}

function buildMediaCard(item) {
  var cover = item.Cover || PLACEHOLDER
  var href = item.id ? item.id + '.html' : '#'
  return '<a class="media-card" href="' + esc(href) + '">'
    + '<div class="media-card-img">'
    + '<img src="' + esc(cover) + '" alt="' + esc(item.Title) + '" loading="lazy"'
    + ' onerror="this.src=\'' + PLACEHOLDER + '\';this.onerror=null;">'
    + '</div>'
    + '<div class="media-card-title">' + esc(item.Title) + '</div>'
    + '</a>'
}

function buildCardSection(headerClass, title, fieldValue) {
  if (!fieldValue || !fieldValue.trim()) return ''
  var names = fieldValue.split('|').map(function (s) { return s.trim() }).filter(Boolean)
  var cards = names.map(function (name) { return byTitle[name] }).filter(Boolean)
  if (!cards.length) return ''
  return '<div class="sec-blk">'
    + '<div class="' + headerClass + '">' + esc(title) + '</div>'
    + '<div class="cards-scroll-wrap"><div class="cards-row">'
    + cards.map(buildMediaCard).join('')
    + '</div></div>'
    + '</div>'
}

function buildTrailerSection(item) {
  var t = item.Type
  if (t !== 'Фильм' && t !== 'Сериал' && t !== 'Игра') return ''
  var typeLabel = t === 'Игра' ? 'ГЕЙМПЛЕЙ'
    : 'ТРЕЙЛЕР ' + (t === 'Сериал' ? 'СЕРИАЛА' : 'ФИЛЬМА')
  var trailerSrc = resolveTrailerSrc(item)
  var trailerFallback = pickTrailerFallbackCover(item.id)
  var trailerLink = item.TrailerLink || item.Link || '#'
  return '<div class="obj-trailer">'
    + '<div class="obj-trailer-header">▷ ' + esc(typeLabel) + '</div>'
    + '<div class="obj-trailer-thumb">'
    + '<img src="' + esc(trailerSrc) + '" alt="Трейлер"'
    + ' style="width:100%;height:100%;object-fit:cover;display:block;"'
    + ' onerror="this.src=\'' + esc(trailerFallback) + '\';this.onerror=null;">'
    + '</div>'
    + '<a class="obj-trailer-link" href="' + esc(trailerLink) + '" target="_blank" rel="noopener noreferrer">Посмотреть трейлер ←</a>'
    + '<img src="../assets/media/elements_pictures/AlienBloodDecor.png" class="obj-trailer-decor" alt="" aria-hidden="true">'
    + '</div>'
}

function generatePage(item) {
  var year = item.YearEnd && String(item.YearEnd).trim()
    ? String(item.YearEnd)
    : String(item.Year || '')
  var posterSrc = item.Cover || PLACEHOLDER

  var tropesHtml = ''
  if (item.Tropes && item.Tropes.trim()) {
    tropesHtml = item.Tropes.split('|').map(function (t) {
      return '<span class="trope-tag">' + esc(t.trim()) + '</span>'
    }).join('')
  }

  var rightColHtml = ''

  rightColHtml += '<div class="sec-blk" id="sec-meta">'
    + '<div class="sec-h-black">Метаданные:</div>'
    + '<div class="meta-block">' + buildMetaHtml(item, year) + '</div>'
    + '</div>'

  if (tropesHtml) {
    rightColHtml += '<div class="sec-blk">'
      + '<div class="sec-h-grey">ТРОПЫ:</div>'
      + '<div class="tropes-bar">' + tropesHtml + '</div>'
      + '</div>'
  }

  if (item.Description && item.Description.trim()) {
    rightColHtml += '<div class="obj-desc">'
      + '<div class="obj-desc-hdr">Описание:</div>'
      + '<p class="obj-desc-text">' + esc(item.Description) + '</p>'
      + '</div>'
  }

  if (item.Quote && item.Quote.trim()) {
    rightColHtml += '<div class="obj-quote">'
      + '<p class="obj-quote-text">«' + esc(item.Quote) + '»</p>'
      + '</div>'
  }

  var workArticles = WORK_ARTICLES[item.id]
  if (workArticles && workArticles.length) {
    rightColHtml += '<div class="sec-blk">'
      + '<div class="sec-h-red">СТАТЬИ НА ТЕМУ:</div>'
      + '<div class="cards-scroll-wrap"><div class="cards-row">'
      + workArticles.map(function (a) {
          return '<a class="article-card dark" href="' + esc(a.href) + '"'
            + ' data-guide="' + esc(a.guide || '') + '" style="text-decoration:none;">'
            + '<div class="card-img">'
            + '<img src="' + esc(a.cover) + '" alt="' + esc(a.title) + '" loading="lazy"'
            + ' onerror="this.src=\'' + PLACEHOLDER + '\';this.onerror=null;">'
            + '</div>'
            + '<div class="card-info">'
            + '<p class="card-title">' + esc(a.title) + '</p>'
            + '<div class="card-meta">'
            + '<div class="card-tags">'
            + '<p>!' + esc(a.section || 'НАВИГАТОРЫ') + '!</p>'
            + '<p>⁕Время чтения ~ ' + esc(a.readTime || '5 минут') + '⁕</p>'
            + '</div>'
            + '<div class="read-btn-outer"><div class="read-btn-inner">'
            + '<span class="read-btn-text">Читать статью</span>'
            + '<span class="read-btn-arrow"><img src="../assets/media/elements_pictures/Q_BlackArrowGuide.svg" alt="→"></span>'
            + '</div></div>'
            + '</div>'
            + '</div>'
            + '</a>'
        }).join('')
      + '</div></div>'
      + '</div>'
  }

  rightColHtml += buildCardSection('sec-h-darkred', 'ВЛИЯНИЕ (ЧТО ВДОХНОВИЛО):', item.Influence)
  rightColHtml += buildCardSection('sec-h-darkred', 'НАСЛЕДИЕ (ЧТО ПОРОДИЛО):', item.Legacy)
  rightColHtml += buildCardSection('sec-h-darkred', 'ВСЕЛЕННАЯ ФРАНШИЗЫ:', item.Franchise)
  rightColHtml += buildCardSection('sec-h-darkred', 'В ТОМ ЖЕ ЖАНРЕ:', item.SameGenre)

  return '<!DOCTYPE html>\n'
    + '<html lang="ru">\n'
    + '<head>\n'
    + '  <meta charset="UTF-8">\n'
    + '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    + '  <title>' + esc(item.Title) + ' — ЧИЛЛС</title>\n'
    + '  <link href="/chillshse/shared.css" rel="stylesheet">\n'
    + '  <link href="/chillshse/object.css" rel="stylesheet">\n'
    + '</head>\n'
    + '<body>\n\n'
    + '  <header class="o-header" data-name="O_Header">\n'
    + '    <a href="../index.html" class="a-logo" aria-label="На главную">\n'
    + '      <img src="../assets/media/elements_pictures/FillColorRed.svg" alt="">\n'
    + '    </a>\n'
    + '    <nav class="o-header-nav">\n'
    + '      <a href="diagnostics.html" class="btn"><span class="blue">Д</span>ИАГНОСТИКА</a>\n'
    + '      <a href="articles.html" class="btn"><span class="blue">Г</span>ИД</a>\n'
    + '      <a href="timeline.html" class="btn"><span class="blue">Т</span>АЙМЛАЙН</a>\n'
    + '    </nav>\n'
    + '  </header>\n\n'
    + '  <div class="scale-wrap">\n'
    + '    <div class="object-page object-page--static" id="object-page">\n\n'
    + '      <div class="obj-bg" aria-hidden="true">\n'
    + '        <img src="../assets/media/background_pictures/AlienPageBackground.png" alt="">\n'
    + '        <div class="obj-bg-overlay"></div>\n'
    + '      </div>\n\n'
    + '      <div class="obj-nav">\n'
    + '        <a href="timeline.html" class="obj-nav-btn" aria-label="Назад">\n'
    + '          <div class="obj-nav-btn-inner">\n'
    + '            <span class="arrow">←</span>\n'
    + '            <span class="label">Назад</span>\n'
    + '          </div>\n'
    + '        </a>\n'
    + '        <a href="timeline.html" class="obj-nav-btn" aria-label="К таймлайну">\n'
    + '          <div class="obj-nav-btn-inner">\n'
    + '            <span class="arrow">←</span>\n'
    + '            <span class="label">К таймлайну</span>\n'
    + '          </div>\n'
    + '        </a>\n'
    + '      </div>\n\n'
    + '      <div class="obj-content">\n'
    + '        <div class="obj-top">\n'
    + '          <div class="obj-title-bar">\n'
    + '            <div class="obj-title-inner">\n'
    + '              <p class="obj-title-name">▷ ' + esc(item.Title) + ' ◁</p>\n'
    + '              <p class="obj-title-year">' + (year ? '(' + esc(year) + ')' : '') + '</p>\n'
    + '            </div>\n'
    + '          </div>\n\n'
    + '          <div class="obj-cols">\n\n'
    + '            <div class="obj-col-left">\n'
    + '              <div class="obj-poster">\n'
    + '                <img src="' + esc(posterSrc) + '" alt="' + esc(item.Title) + '"'
    + ' style="width:100%;height:100%;object-fit:cover;display:block;"'
    + ' onerror="this.src=\'' + PLACEHOLDER + '\';this.onerror=null;">\n'
    + '              </div>\n'
    + buildTrailerSection(item)
    + '            </div>\n\n'
    + '            <div class="obj-col-right">\n'
    + rightColHtml
    + '            </div>\n'
    + '          </div>\n'
    + '        </div>\n'
    + '      </div>\n\n'
    + '      <footer class="o-footer">\n'
    + '        <div class="footer-logo">\n'
    + '          <img src="../assets/media/elements_pictures/FillColorRed.svg" alt="ЧИЛЛС">\n'
    + '        </div>\n'
    + '        <div class="footer-right">\n'
    + '          <div class="footer-info">\n'
    + '            <div class="footer-col footer-col--info">\n'
    + '              <div>\n'
    + '                <p class="bold">Выполнила работу:</p>\n'
    + '                <p class="regular">Мамкина Софья</p>\n'
    + '              </div>\n'
    + '              <div>\n'
    + '                <p class="bold">Куратор:</p>\n'
    + '                <p class="regular">Харитонов Захар</p>\n'
    + '              </div>\n'
    + '              <p class="red">Материалы защищены авторским правом,<br>и все права сохранены</p>\n'
    + '            </div>\n'
    + '            <div class="footer-col footer-col--contacts">\n'
    + '              <div>\n'
    + '                <p class="bold">Телеграм-канал</p>\n'
    + '                <p class="regular">@smth</p>\n'
    + '              </div>\n'
    + '              <div>\n'
    + '                <p class="bold">Электронная почта автора:</p>\n'
    + '                <p class="regular">mamont09583@gmail.com</p>\n'
    + '              </div>\n'
    + '            </div>\n'
    + '          </div>\n'
    + '          <div class="footer-heart">\n'
    + '            <img src="../assets/media/elements_pictures/Q_HSEART.png" alt="HSE Art and Design School">\n'
    + '          </div>\n'
    + '        </div>\n'
    + '      </footer>\n\n'
    + '    </div>\n'
    + '  </div>\n\n'
    + '  <script defer src="/chillshse/shared.js"></script>\n'
    + '  <script defer src="/chillshse/object-from.js"></script>\n'
    + '</body>\n'
    + '</html>\n'
}

function buildTimelineCard(item) {
  var cover = item.Cover || PLACEHOLDER
  var href = item.id ? item.id + '.html' : '#'
  var genreStr = item.Subgenres || item.Genres || ''
  var genres = genreStr.split('|').map(function (s) { return s.trim() }).filter(Boolean)
  var genreHtml = genres.slice(0, 3).map(function (g) { return '‼ ' + esc(g) }).join('<br>')
  var desc = item.Description ? esc(item.Description.slice(0, 80)) + (item.Description.length > 80 ? '…' : '') : ''
  return '<a class="timeline-card" href="' + esc(href) + '">'
    + '<div class="timeline-card-img">'
    + '<img src="' + esc(cover) + '" alt="' + esc(item.Title) + '" loading="lazy"'
    + ' onerror="this.src=\'' + PLACEHOLDER + '\';this.onerror=null;">'
    + '</div>'
    + '<div class="timeline-card-info">'
    + '<div class="media-type">▷ ' + esc(item.Type || 'Неизвестно') + '</div>'
    + (genreHtml ? '<div class="genres">' + genreHtml + '</div>' : '')
    + (desc ? '<div class="desc">' + desc + '</div>' : '')
    + '</div>'
    + '</a>'
}

function generateTimeline() {
  var timelinePath = path.join(OUTPUT_DIR, 'timeline.html')
  if (!fs.existsSync(timelinePath)) return

  var map = {}
  timelineData.forEach(function (item) {
    var y = item.Year
    if (!y) return
    if (!map[y]) map[y] = []
    map[y].push(item)
  })
  var years = Object.keys(map).map(Number).sort(function (a, b) { return a - b })

  var groupsHtml = years.map(function (y) {
    var cardsHtml = map[y].map(buildTimelineCard).join('')
    return '<div class="year-group">'
      + '<div class="year-header">'
      + '<div class="year-label">[ ' + y + ' ]</div>'
      + '<div class="year-tick"></div>'
      + '</div>'
      + '<div class="card-row">' + cardsHtml + '</div>'
      + '</div>'
  }).join('')

  var html = fs.readFileSync(timelinePath, 'utf8')
  html = html.replace(
    /<div class="year-groups" id="year-groups">[\s\S]*?<\/div>\s*<\/div>/,
    '<div class="year-groups" id="year-groups">' + groupsHtml + '</div>'
  )
  fs.writeFileSync(timelinePath, html, 'utf8')
  console.log('Pre-rendered timeline with ' + timelineData.length + ' items (' + (data.length - timelineData.length) + ' without covers skipped)')
}

fs.writeFileSync(TIMELINE_DATA_PATH, JSON.stringify(timelineData, null, 2), 'utf8')
console.log('Wrote timeline_media.json (' + timelineData.length + ' items with covers)')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

var count = 0
data.forEach(function (item) {
  if (!item.id) return
  var html = generatePage(item)
  var outPath = path.join(OUTPUT_DIR, item.id + '.html')
  fs.writeFileSync(outPath, html, 'utf8')
  count++
})

generateTimeline()

console.log('Generated ' + count + ' static pages in docs/pages/')

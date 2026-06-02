import '../stylesheets/timeline.css'

var PLACEHOLDER = '../assets/media/elements_pictures/place-holder-picture.png'
var TIMELINE_SCROLL_KEY = 'chills_timeline_zone_scroll_left'

function persistTimelineScroll(zone) {
  if (!zone) return
  try {
    sessionStorage.setItem(TIMELINE_SCROLL_KEY, String(zone.scrollLeft))
  } catch (e) {}
}

function restoreTimelineScroll(zone) {
  if (!zone) return
  var raw
  try {
    raw = sessionStorage.getItem(TIMELINE_SCROLL_KEY)
  } catch (e) {
    return
  }
  if (raw === null) return
  var target = parseInt(raw, 10)
  if (isNaN(target)) return
  function apply() {
    var maxScroll = Math.max(0, zone.scrollWidth - zone.clientWidth)
    zone.scrollLeft = Math.min(Math.max(0, target), maxScroll)
    zone.dispatchEvent(new Event('scroll'))
  }
  requestAnimationFrame(function () {
    requestAnimationFrame(apply)
  })
}

function groupByYear(items) {
  var map = {}
  items.forEach(function (item) {
    var y = item.Year
    if (!y) return
    if (!map[y]) map[y] = []
    map[y].push(item)
  })
  var years = Object.keys(map).map(Number).sort(function (a, b) { return a - b })
  return years.map(function (y) { return { year: y, items: map[y] } })
}

function escH(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderCard(item) {
  var coverSrc = item.Cover || PLACEHOLDER
  var img = '<img src="' + escH(coverSrc) + '" alt="' + escH(item.Title) + '" loading="lazy" onerror="this.src=' + escH("'" + PLACEHOLDER + "'") + ';this.onerror=null;">'
  var genreStr = item.Subgenres || item.Genres || ''
  var genres = genreStr.split('|').map(function (g) { return g.trim() }).filter(Boolean)
  var genreHtml = genres.slice(0, 3).map(function (g) { return '‼ ' + escH(g) }).join('<br>')
  var href = item.id ? ' href="' + item.id + '.html?from=timeline.html&root=timeline.html"' : ''
  return '<a class="timeline-card"' + href + '>'
    + '<div class="timeline-card-img">' + img + '</div>'
    + '<div class="timeline-card-info">'
    + '<div class="media-type">▷ ' + escH(item.Type || 'Неизвестно') + '</div>'
    + (genreHtml ? '<div class="genres">' + genreHtml + '</div>' : '')
    + (item.Description ? '<div class="desc">' + escH(item.Description.slice(0, 80)) + (item.Description.length > 80 ? '…' : '') + '</div>' : '')
    + '</div>'
    + '</a>'
}

function renderTimeline(groups) {
  var container = document.getElementById('year-groups')
  if (!container) return

  if (!groups || groups.length === 0) {
    container.innerHTML = '<div class="timeline-loading">НЕТ ДАННЫХ</div>'
    return
  }

  container.innerHTML = groups.map(function (group) {
    var cardsHtml = group.items.map(renderCard).join('')
    return '<div class="year-group">'
      + '<div class="year-header">'
      + '<div class="year-label">[ ' + escH(group.year) + ' ]</div>'
      + '<div class="year-tick"></div>'
      + '</div>'
      + '<div class="card-row">' + cardsHtml + '</div>'
      + '</div>'
  }).join('')

  syncTimelinePageMinHeight()
}

function syncTimelinePageMinHeight() {
  var page = document.querySelector('.timeline-page')
  if (!page) return
  if (window.matchMedia('(max-width: 1023px)').matches) {
    page.style.minHeight = ''
  } else {
    page.style.minHeight = '1130px'
  }
}

function filterTimelineGroups(baseGroups, q) {
  if (!q) return baseGroups
  return baseGroups.map(function (g) {
    return {
      year: g.year,
      items: g.items.filter(function (item) {
        return (item.Title || '').toLowerCase().indexOf(q) !== -1
          || (item.Subgenres || item.Genres || '').toLowerCase().indexOf(q) !== -1
          || (item.Type || '').toLowerCase().indexOf(q) !== -1
          || (item.Description || '').toLowerCase().indexOf(q) !== -1
      })
    }
  }).filter(function (g) { return g.items.length > 0 })
}

function initSearch(baseGroups) {
  var searchInput = document.getElementById('timeline-search')
  var clearBtn = document.getElementById('timeline-search-clear')
  if (!searchInput) return
  var zone = document.getElementById('timeline-zone')
  var lastQ = ''

  function applySearch() {
    var q = searchInput.value.trim().toLowerCase()
    renderTimeline(filterTimelineGroups(baseGroups, q))
    if (clearBtn) {
      clearBtn.hidden = !searchInput.value.trim()
    }

    // If we were scrolled far right and the filtered content is narrower,
    // the zone can end up beyond its new maxScroll and appear "empty".
    if (zone) {
      requestAnimationFrame(function () {
        var maxScroll = Math.max(0, zone.scrollWidth - zone.clientWidth)
        if (q && q !== lastQ) {
          zone.scrollLeft = 0
        } else if (zone.scrollLeft > maxScroll) {
          zone.scrollLeft = maxScroll
        }
        zone.dispatchEvent(new Event('scroll'))
      })
    }
    lastQ = q
  }

  searchInput.addEventListener('input', applySearch)

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      searchInput.value = ''
      applySearch()
      searchInput.focus()
    })
  }
}

// ── Filter logic ────────────────────────────────────────────────────────────

function parseFilterParams() {
  var params = new URLSearchParams(window.location.search)
  return {
    type: params.get('type') ? params.get('type').split(',').filter(Boolean) : [],
    decade: params.get('decade') ? params.get('decade').split(',').filter(Boolean) : [],
    scare: params.get('scare') ? parseInt(params.get('scare'), 10) : 0,
    fear: params.get('fear') ? params.get('fear').split(',').filter(Boolean) : [],
    subgenre: params.get('subgenre') ? params.get('subgenre').split(',').filter(Boolean) : [],
    country: params.get('country') ? params.get('country').split(',').filter(Boolean) : [],
    emotion: params.get('emotion') ? params.get('emotion').split(',').filter(Boolean) : []
  }
}

function hasActiveFilters(fp) {
  return fp.type.length > 0 || fp.decade.length > 0 || fp.scare > 0
    || fp.fear.length > 0 || fp.subgenre.length > 0
    || fp.country.length > 0 || fp.emotion.length > 0
}

function decadeContains(year, decade) {
  if (decade === 'до1980х') return year < 1980
  if (decade === '1980е') return year >= 1980 && year <= 1989
  if (decade === '1990е') return year >= 1990 && year <= 1999
  if (decade === '2000е') return year >= 2000 && year <= 2009
  if (decade === '2010е') return year >= 2010 && year <= 2019
  if (decade === '2020е') return year >= 2020 && year <= 2029
  return false
}

function pipeContains(field, value) {
  var parts = (field || '').split('|').map(function (s) { return s.trim() })
  return parts.indexOf(value) !== -1
}

function applyFilters(items, fp) {
  return items.filter(function (item) {
    if (fp.type.length > 0 && fp.type.indexOf(item.Type) === -1) return false
    if (fp.decade.length > 0) {
      var yearOk = fp.decade.some(function (d) { return decadeContains(item.Year, d) })
      if (!yearOk) return false
    }
    if (fp.scare > 0 && (item['Scare Level'] || 0) < fp.scare) return false
    if (fp.fear.length > 0 && fp.fear.indexOf(item['Fear Type']) === -1) return false
    if (fp.subgenre.length > 0) {
      var subOk = fp.subgenre.some(function (s) { return pipeContains(item.Subgenres, s) })
      if (!subOk) return false
    }
    if (fp.country.length > 0 && fp.country.indexOf(item.Country) === -1) return false
    if (fp.emotion.length > 0) {
      var emoOk = fp.emotion.some(function (e) { return pipeContains(item.Emotions, e) })
      if (!emoOk) return false
    }
    return true
  })
}

function removeFilterParam(param, value) {
  var params = new URLSearchParams(window.location.search)
  if (param === 'scare') {
    params.delete('scare')
  } else {
    var current = params.get(param) ? params.get(param).split(',').filter(Boolean) : []
    var next = current.filter(function (v) { return v !== value })
    if (next.length === 0) {
      params.delete(param)
    } else {
      params.set(param, next.join(','))
    }
  }
  var qs = params.toString()
  window.location.href = window.location.pathname + (qs ? '?' + qs : '')
}

function makeTag(param, value, label) {
  return '<span class="filter-tag">'
    + escH(label)
    + ' <button class="filter-tag-remove" data-param="' + escH(param) + '" data-value="' + escH(value) + '" aria-label="Убрать фильтр">×</button>'
    + '</span>'
}

function renderFilterTags(fp) {
  var bar = document.getElementById('active-filters-bar')
  if (!bar) return

  if (!hasActiveFilters(fp)) {
    bar.innerHTML = ''
    bar.classList.remove('has-tags')
    return
  }

  bar.classList.add('has-tags')

  var html = ''
  fp.type.forEach(function (v) { html += makeTag('type', v, v) })
  fp.decade.forEach(function (v) {
    html += makeTag('decade', v, v === 'до1980х' ? 'до 1980х' : v)
  })
  if (fp.scare > 0) {
    html += makeTag('scare', String(fp.scare), 'СТРАХ ≥' + fp.scare)
  }
  fp.fear.forEach(function (v) { html += makeTag('fear', v, v) })
  fp.subgenre.forEach(function (v) { html += makeTag('subgenre', v, v) })
  fp.country.forEach(function (v) { html += makeTag('country', v, v) })
  fp.emotion.forEach(function (v) { html += makeTag('emotion', v, v) })
  html += '<button class="clear-all-filters" id="clear-all-filters">СБРОСИТЬ ВСЁ</button>'

  bar.innerHTML = html

  bar.querySelectorAll('.filter-tag-remove').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation()
      removeFilterParam(this.dataset.param, this.dataset.value)
    })
  })

  var clearAll = document.getElementById('clear-all-filters')
  if (clearAll) {
    clearAll.addEventListener('click', function () {
      window.location.href = window.location.pathname
    })
  }
}

// ── Scrubber ────────────────────────────────────────────────────────────────

function initScrubber() {
  var zone = document.getElementById('timeline-zone')
  var track = document.getElementById('scrubber-track')
  var thumb = document.getElementById('scrubber-thumb')
  if (!zone || !track || !thumb) return

  function updateThumb() {
    var scrollRatio = zone.scrollLeft / (zone.scrollWidth - zone.clientWidth || 1)
    var trackW = track.clientWidth
    var thumbW = thumb.offsetWidth
    var maxLeft = trackW - thumbW
    thumb.style.left = Math.round(scrollRatio * maxLeft) + 'px'
  }

  var scrollSaveTimer
  zone.addEventListener('scroll', function () {
    updateThumb()
    clearTimeout(scrollSaveTimer)
    scrollSaveTimer = setTimeout(function () {
      persistTimelineScroll(zone)
    }, 100)
  }, { passive: true })
  window.addEventListener('resize', updateThumb)
  window.addEventListener('pagehide', function () {
    persistTimelineScroll(zone)
  })

  var dragging = false
  var startX = 0
  var startLeft = 0

  thumb.addEventListener('mousedown', function (e) {
    dragging = true
    startX = e.clientX
    startLeft = parseInt(thumb.style.left, 10) || 0
    thumb.classList.add('dragging')
    e.preventDefault()
  })

  document.addEventListener('mousemove', function (e) {
    if (!dragging) return
    var trackW = track.clientWidth
    var thumbW = thumb.offsetWidth
    var maxLeft = trackW - thumbW
    var newLeft = Math.min(maxLeft, Math.max(0, startLeft + (e.clientX - startX)))
    thumb.style.left = newLeft + 'px'
    var ratio = newLeft / (maxLeft || 1)
    zone.scrollLeft = ratio * (zone.scrollWidth - zone.clientWidth)
  })

  document.addEventListener('mouseup', function () {
    if (dragging) { dragging = false; thumb.classList.remove('dragging') }
  })

  thumb.addEventListener('touchstart', function (e) {
    dragging = true
    startX = e.touches[0].clientX
    startLeft = parseInt(thumb.style.left, 10) || 0
    thumb.classList.add('dragging')
  }, { passive: true })

  document.addEventListener('touchmove', function (e) {
    if (!dragging) return
    var trackW = track.clientWidth
    var thumbW = thumb.offsetWidth
    var maxLeft = trackW - thumbW
    var newLeft = Math.min(maxLeft, Math.max(0, startLeft + (e.touches[0].clientX - startX)))
    thumb.style.left = newLeft + 'px'
    var ratio = newLeft / (maxLeft || 1)
    zone.scrollLeft = ratio * (zone.scrollWidth - zone.clientWidth)
  }, { passive: true })

  document.addEventListener('touchend', function () {
    if (dragging) { dragging = false; thumb.classList.remove('dragging') }
  })

  setTimeout(updateThumb, 200)
}

function initZoneDrag() {
  var zone = document.getElementById('timeline-zone')
  if (!zone) return

  var active = false
  var startX = 0
  var startY = 0
  var startScrollLeft = 0
  var didDrag = false
  var THRESHOLD = 6

  // ── Mouse ──────────────────────────────────────────────────────────────
  zone.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return
    active = true
    didDrag = false
    startX = e.clientX
    startScrollLeft = zone.scrollLeft
    zone.classList.add('is-dragging')
  })

  document.addEventListener('mousemove', function (e) {
    if (!active) return
    var dx = startX - e.clientX
    if (Math.abs(dx) > THRESHOLD) {
      didDrag = true
      zone.scrollLeft = startScrollLeft + dx
      e.preventDefault()
    }
  })

  document.addEventListener('mouseup', function () {
    if (!active) return
    active = false
    zone.classList.remove('is-dragging')
  })

  // Suppress card clicks that follow a drag
  zone.addEventListener('click', function (e) {
    if (didDrag) {
      e.preventDefault()
      e.stopPropagation()
      didDrag = false
    }
  }, true)

  // ── Touch ──────────────────────────────────────────────────────────────
  zone.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return
    active = true
    didDrag = false
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    startScrollLeft = zone.scrollLeft
  }, { passive: true })

  zone.addEventListener('touchmove', function (e) {
    if (!active || e.touches.length !== 1) return
    var dx = startX - e.touches[0].clientX
    var dy = startY - e.touches[0].clientY
    // Let vertical swipes pass through to the page scroll
    if (Math.abs(dx) < Math.abs(dy) && !didDrag) return
    if (Math.abs(dx) > THRESHOLD) didDrag = true
    e.preventDefault()
    zone.scrollLeft = startScrollLeft + dx
  }, { passive: false })

  zone.addEventListener('touchend', function () {
    active = false
    zone.classList.remove('is-dragging')
  }, { passive: true })
}

document.addEventListener('DOMContentLoaded', function () {
  var loadingEl = document.getElementById('timeline-loading')
  var fp = parseFilterParams()

  window.addEventListener('resize', syncTimelinePageMinHeight)

  document.addEventListener('click', function (e) {
    var t = e.target
    if (!t || !t.closest) return
    var a = t.closest('a.timeline-card[href]')
    if (a) persistTimelineScroll(document.getElementById('timeline-zone'))
  }, true)

  initScrubber()
  initZoneDrag()

  fetch('../assets/data/timeline_media.json')
    .then(function (r) { return r.json() })
    .then(function (items) {
      var displayItems = hasActiveFilters(fp) ? applyFilters(items, fp) : items
      var displayGroups = groupByYear(displayItems)

      if (loadingEl) loadingEl.remove()
      renderTimeline(displayGroups)
      renderFilterTags(fp)
      // Search operates on the current display set (filtered or all)
      initSearch(displayGroups)
      var zone = document.getElementById('timeline-zone')
      restoreTimelineScroll(zone)
    })
    .catch(function (err) {
      console.error('Ошибка загрузки данных:', err)
      if (loadingEl) loadingEl.textContent = 'ОШИБКА ЗАГРУЗКИ'
    })
})

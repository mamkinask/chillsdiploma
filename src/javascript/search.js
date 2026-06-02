import '../stylesheets/search.css'

var STORAGE_KEY = 'chills_search_filters'

function getStoredFilters() {
  try {
    var raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

function saveFilters(fp) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fp))
  } catch (e) {}
}

function collectFilters() {
  var form = document.getElementById('search-filters')
  if (!form) return {}

  var fp = {}

  var checkboxNames = ['type', 'decade', 'fear', 'subgenre', 'country', 'emotion']
  checkboxNames.forEach(function (name) {
    var checked = form.querySelectorAll('input[type="checkbox"][name="' + name + '"]:checked')
    fp[name] = Array.prototype.map.call(checked, function (el) { return el.value })
  })

  var scareEl = form.querySelector('input[type="radio"][name="scare"]:checked')
  fp.scare = scareEl ? scareEl.value : ''

  return fp
}

function buildQueryString(fp) {
  var params = new URLSearchParams()
  if (fp.type && fp.type.length) params.set('type', fp.type.join(','))
  if (fp.decade && fp.decade.length) params.set('decade', fp.decade.join(','))
  if (fp.scare) params.set('scare', fp.scare)
  if (fp.fear && fp.fear.length) params.set('fear', fp.fear.join(','))
  if (fp.subgenre && fp.subgenre.length) params.set('subgenre', fp.subgenre.join(','))
  if (fp.country && fp.country.length) params.set('country', fp.country.join(','))
  if (fp.emotion && fp.emotion.length) params.set('emotion', fp.emotion.join(','))
  return params.toString()
}

function applyStoredFilters(fp) {
  if (!fp) return
  var form = document.getElementById('search-filters')
  if (!form) return

  var checkboxNames = ['type', 'decade', 'fear', 'subgenre', 'country', 'emotion']
  checkboxNames.forEach(function (name) {
    var vals = fp[name] || []
    form.querySelectorAll('input[type="checkbox"][name="' + name + '"]').forEach(function (el) {
      el.checked = vals.indexOf(el.value) !== -1
    })
  })

  if (fp.scare) {
    var radio = form.querySelector('input[type="radio"][name="scare"][value="' + fp.scare + '"]')
    if (radio) radio.checked = true
  }
}

function resetFilters() {
  var form = document.getElementById('search-filters')
  if (!form) return
  form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(function (el) {
    el.checked = false
  })
  try { sessionStorage.removeItem(STORAGE_KEY) } catch (e) {}
}

document.addEventListener('DOMContentLoaded', function () {
  // Pre-populate from stored session
  var stored = getStoredFilters()
  if (stored) applyStoredFilters(stored)

  var applyBtn = document.getElementById('search-apply')
  if (applyBtn) {
    applyBtn.addEventListener('click', function () {
      var fp = collectFilters()
      saveFilters(fp)
      var qs = buildQueryString(fp)
      window.location.href = 'timeline.html' + (qs ? '?' + qs : '')
    })
  }

  var resetBtn = document.getElementById('search-reset')
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      resetFilters()
    })
  }
})

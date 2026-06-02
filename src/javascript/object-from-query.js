export function sanitizeObjectFromParam(from) {
  from = String(from || '').trim()
  if (!from || from.indexOf('..') !== -1) return ''
  if (/^https?:\/\//i.test(from) || from.indexOf('//') !== -1) return ''
  if (!/^[a-zA-Z0-9._-]+\.html$/i.test(from)) return ''
  return from
}

function getSafeReferrerHtml() {
  try {
    if (!document.referrer) return ''
    var ref = new URL(document.referrer, window.location.href)
    if (ref.origin !== window.location.origin) return ''
    var file = (ref.pathname || '').split('/').pop() || ''
    return sanitizeObjectFromParam(file)
  } catch (e) {
    return ''
  }
}

function getCurrentPageFile() {
  try {
    var file = (window.location.pathname || '').split('/').pop() || ''
    return sanitizeObjectFromParam(file)
  } catch (e) {
    return ''
  }
}

function buildQuery(fromFile, rootFile) {
  var fromSafe = sanitizeObjectFromParam(fromFile)
  var rootSafe = sanitizeObjectFromParam(rootFile)
  var q = []
  if (fromSafe) q.push('from=' + encodeURIComponent(fromSafe))
  if (rootSafe) q.push('root=' + encodeURIComponent(rootSafe))
  return q.length ? ('?' + q.join('&')) : ''
}

function bindObjectBackButton(back, safeFrom, safeRoot) {
  if (!back) return

  // Always keep a sane href for no-JS / new tab.
  back.setAttribute('href', safeFrom || safeRoot || 'timeline.html')

  back.onclick = function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()

    // If browser history exists, prefer it (keeps natural back chain).
    // But when page is opened directly or via replace(), fall back to URL chain.
    if (window.history && window.history.length > 1 && document.referrer) {
      try {
        var ref = new URL(document.referrer, window.location.href)
        if (ref.origin === window.location.origin) {
          window.history.back()
          return
        }
      } catch (_e) {}
    }

    // No usable history → replace() so we don't create a "loop" in history.
    if (safeFrom) {
      window.location.replace(safeFrom + buildQuery(safeRoot, safeRoot))
      return
    }
    if (safeRoot) {
      window.location.replace(safeRoot)
      return
    }
    window.location.replace('timeline.html')
  }
}

export function applyObjectFromQuery() {
  try {
    var params = new URLSearchParams(window.location.search)
    var safeFrom = sanitizeObjectFromParam(params.get('from')) || ''
    var safeRoot = sanitizeObjectFromParam(params.get('root')) || ''

    // Root fallback: if first work opened from a section (timeline/article), keep it.
    if (!safeRoot) safeRoot = safeFrom || getSafeReferrerHtml()
    if (!safeFrom) safeFrom = getSafeReferrerHtml()

    var back = document.querySelector('a.obj-nav-btn[aria-label="Назад"]')
    bindObjectBackButton(back, safeFrom, safeRoot)

    // To make "Назад" return to the immediate previous page, propagate current page as `from`.
    var currentFile = getCurrentPageFile()
    if (!currentFile) return
    var suffix = buildQuery(currentFile, safeRoot)

    document.querySelectorAll('a.media-card[href]').forEach(function (a) {
      var href = a.getAttribute('href')
      if (!href || href === '#' || href.indexOf('?') !== -1) return
      var file = href.replace(/^\.\//, '').split('/').pop()
      if (!sanitizeObjectFromParam(file)) return
      a.setAttribute('href', file + suffix)
    })
  } catch (e) {}
}

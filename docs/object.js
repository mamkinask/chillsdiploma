/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/javascript/object-from-query.js
function sanitizeObjectFromParam(from) {
  from = String(from || '').trim();
  if (!from || from.indexOf('..') !== -1) return '';
  if (/^https?:\/\//i.test(from) || from.indexOf('//') !== -1) return '';
  if (!/^[a-zA-Z0-9._-]+\.html$/i.test(from)) return '';
  return from;
}
function getSafeReferrerHtml() {
  try {
    if (!document.referrer) return '';
    var ref = new URL(document.referrer, window.location.href);
    if (ref.origin !== window.location.origin) return '';
    var file = (ref.pathname || '').split('/').pop() || '';
    return sanitizeObjectFromParam(file);
  } catch (e) {
    return '';
  }
}
function getCurrentPageFile() {
  try {
    var file = (window.location.pathname || '').split('/').pop() || '';
    return sanitizeObjectFromParam(file);
  } catch (e) {
    return '';
  }
}
function buildQuery(fromFile, rootFile) {
  var fromSafe = sanitizeObjectFromParam(fromFile);
  var rootSafe = sanitizeObjectFromParam(rootFile);
  var q = [];
  if (fromSafe) q.push('from=' + encodeURIComponent(fromSafe));
  if (rootSafe) q.push('root=' + encodeURIComponent(rootSafe));
  return q.length ? '?' + q.join('&') : '';
}
function bindObjectBackButton(back, safeFrom, safeRoot) {
  if (!back) return;

  // Always keep a sane href for no-JS / new tab.
  back.setAttribute('href', safeFrom || safeRoot || 'timeline.html');
  back.onclick = function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();

    // If browser history exists, prefer it (keeps natural back chain).
    // But when page is opened directly or via replace(), fall back to URL chain.
    if (window.history && window.history.length > 1 && document.referrer) {
      try {
        var ref = new URL(document.referrer, window.location.href);
        if (ref.origin === window.location.origin) {
          window.history.back();
          return;
        }
      } catch (_e) {}
    }

    // No usable history → replace() so we don't create a "loop" in history.
    if (safeFrom) {
      window.location.replace(safeFrom + buildQuery(safeRoot, safeRoot));
      return;
    }
    if (safeRoot) {
      window.location.replace(safeRoot);
      return;
    }
    window.location.replace('timeline.html');
  };
}
function applyObjectFromQuery() {
  try {
    var params = new URLSearchParams(window.location.search);
    var safeFrom = sanitizeObjectFromParam(params.get('from')) || '';
    var safeRoot = sanitizeObjectFromParam(params.get('root')) || '';

    // Root fallback: if first work opened from a section (timeline/article), keep it.
    if (!safeRoot) safeRoot = safeFrom || getSafeReferrerHtml();
    if (!safeFrom) safeFrom = getSafeReferrerHtml();
    var back = document.querySelector('a.obj-nav-btn[aria-label="Назад"]');
    bindObjectBackButton(back, safeFrom, safeRoot);

    // To make "Назад" return to the immediate previous page, propagate current page as `from`.
    var currentFile = getCurrentPageFile();
    if (!currentFile) return;
    var suffix = buildQuery(currentFile, safeRoot);
    document.querySelectorAll('a.media-card[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href === '#' || href.indexOf('?') !== -1) return;
      var file = href.replace(/^\.\//, '').split('/').pop();
      if (!sanitizeObjectFromParam(file)) return;
      a.setAttribute('href', file + suffix);
    });
  } catch (e) {}
}
;// ./src/javascript/object.js


var PLACEHOLDER = '../assets/media/elements_pictures/place-holder-picture.png';
var TRAILER_FALLBACK_COVERS = ['../assets/media/trailers_pictures/trailer-cover-2.png', '../assets/media/trailers_pictures/trailer-cover-3.png'];
function pickTrailerFallbackCover(seed) {
  var s = String(seed || '');
  var hash = 0;
  for (var i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i) | 0;
  }
  return TRAILER_FALLBACK_COVERS[Math.abs(hash) % TRAILER_FALLBACK_COVERS.length];
}
function currentFromQuerySuffix() {
  try {
    var safe = sanitizeObjectFromParam(new URLSearchParams(window.location.search).get('from'));
    return safe ? '?from=' + encodeURIComponent(safe) : '';
  } catch (e) {
    return '';
  }
}
function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function show(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = '';
}
function hide(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = 'none';
}
function setHtml(id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setAttr(id, attr, val) {
  var el = document.getElementById(id);
  if (el) el.setAttribute(attr, val);
}
function buildMetaRowU(label, value) {
  if (!value || !String(value).trim()) return '';
  return '<div class="meta-row">' + '<span class="meta-label">' + esc(label) + ':</span>' + '<span class="meta-value">' + esc(String(value)) + '</span>' + '</div>';
}
function buildMetaRowPlain(label, value) {
  if (!value || !String(value).trim()) return '';
  return '<div class="meta-row">' + '<span class="meta-label">' + esc(label) + ':</span>' + '<span class="meta-value meta-value--plain">' + esc(String(value)) + '</span>' + '</div>';
}
function buildMetaRowTags(label, value) {
  if (!value || !String(value).trim()) return '';
  var tags = String(value).split('|').map(function (s) {
    return s.trim();
  }).filter(Boolean);
  if (!tags.length) return '';
  return '<div class="meta-row">' + '<span class="meta-label">' + esc(label) + ':</span>' + '<div class="meta-tags">' + tags.map(function (t) {
    return '<span class="meta-tag">' + esc(t) + '</span>';
  }).join('') + '</div>' + '</div>';
}
var WORK_ARTICLES = {
  'alien': [{
    title: '«Анатомия паники»: полная эволюция жанра «боди-хоррор»',
    href: 'body_horror.html',
    cover: '../assets/media/guides_pictures/cover-body-horror.png',
    guide: 'body-horror',
    section: 'НАВИГАТОРЫ',
    readTime: '5 минут'
  }, {
    title: 'Аниматроники и механическая резня: о том, почему нас пугают роботы',
    href: 'guide_horror_robot.html',
    cover: '../assets/media/elements_pictures/GuideRobot.png',
    guide: 'robot',
    section: 'НАВИГАТОРЫ',
    readTime: '7 минут'
  }],
  'dead-space': [{
    title: '«Анатомия паники»: полная эволюция жанра «боди-хоррор»',
    href: 'body_horror.html',
    cover: '../assets/media/guides_pictures/cover-body-horror.png',
    guide: 'body-horror',
    section: 'НАВИГАТОРЫ',
    readTime: '5 минут'
  }],
  'the-thing': [{
    title: '«Анатомия паники»: полная эволюция жанра «боди-хоррор»',
    href: 'body_horror.html',
    cover: '../assets/media/guides_pictures/cover-body-horror.png',
    guide: 'body-horror',
    section: 'НАВИГАТОРЫ',
    readTime: '5 минут'
  }],
  'alien-isolation': [{
    title: 'Искусство Выживания: Эволюция Survival Horror в видеоиграх',
    href: 'survival_horror.html',
    cover: '../assets/media/guides_pictures/cover-survival-horror.png',
    guide: 'survival-horror',
    section: 'НАВИГАТОРЫ',
    readTime: '5 минут'
  }],
  'amnesia-the-dark-descent': [{
    title: 'Искусство Выживания: Эволюция Survival Horror в видеоиграх',
    href: 'survival_horror.html',
    cover: '../assets/media/guides_pictures/cover-survival-horror.png',
    guide: 'survival-horror',
    section: 'НАВИГАТОРЫ',
    readTime: '5 минут'
  }],
  'silent-hill-1-game': [{
    title: 'Искусство Выживания: Эволюция Survival Horror в видеоиграх',
    href: 'survival_horror.html',
    cover: '../assets/media/guides_pictures/cover-survival-horror.png',
    guide: 'survival-horror',
    section: 'НАВИГАТОРЫ',
    readTime: '5 минут'
  }],
  'rosemarys-baby': [{
    title: 'Не мило, а очень страшно: Образ ребёнка в хорроре',
    href: 'child_imagery.html',
    cover: '../assets/media/guides_pictures/cover-child-imagery.png',
    guide: 'child-imagery',
    section: 'НАВИГАТОРЫ',
    readTime: '5 минут'
  }],
  'the-shining': [{
    title: 'Не мило, а очень страшно: Образ ребёнка в хорроре',
    href: 'child_imagery.html',
    cover: '../assets/media/guides_pictures/cover-child-imagery.png',
    guide: 'child-imagery',
    section: 'НАВИГАТОРЫ',
    readTime: '5 минут'
  }],
  'it': [{
    title: 'Не мило, а очень страшно: Образ ребёнка в хорроре',
    href: 'child_imagery.html',
    cover: '../assets/media/guides_pictures/cover-child-imagery.png',
    guide: 'child-imagery',
    section: 'НАВИГАТОРЫ',
    readTime: '5 минут'
  }]
};
function buildMediaCard(item) {
  var a = document.createElement('a');
  a.className = 'media-card';
  a.href = (item.id || '') + '.html' + currentFromQuerySuffix();
  var imgWrap = document.createElement('div');
  imgWrap.className = 'media-card-img';
  var img = document.createElement('img');
  img.src = item.Cover || PLACEHOLDER;
  img.alt = item.Title || '';
  img.loading = 'lazy';
  img.onerror = function () {
    this.src = PLACEHOLDER;
    this.onerror = null;
  };
  imgWrap.appendChild(img);
  var titleDiv = document.createElement('div');
  titleDiv.className = 'media-card-title';
  titleDiv.textContent = item.Title || '';
  a.appendChild(imgWrap);
  a.appendChild(titleDiv);
  return a.outerHTML;
}
function fillCardSection(sectionId, rowId, fieldValue, allData) {
  if (!fieldValue || !fieldValue.trim()) return;
  var names = fieldValue.split('|').map(function (s) {
    return s.trim();
  }).filter(Boolean);
  var cards = names.map(function (name) {
    return allData.find(function (x) {
      return x.Title === name;
    });
  }).filter(Boolean);
  if (!cards.length) return;
  var html = cards.map(buildMediaCard).join('');
  setHtml(rowId, html);
  show(sectionId);
}
function buildMetaHtml(item, year) {
  var t = item.Type;
  var col1 = '',
    col2 = '',
    col3 = '';
  if (t === 'Фильм' || t === 'Сериал') {
    col1 = buildMetaRowU('Медиаформат', t) + buildMetaRowU('Год выпуска', year) + buildMetaRowTags('Поджанры', item.Subgenres);
    col2 = buildMetaRowU('Франшизы', item.FranchiseName) + buildMetaRowTags('Страны', item.Country) + buildMetaRowU('Режиссёр', item.Director) + buildMetaRowPlain('Рейтинг', item.Rating);
    col3 = buildMetaRowU('Платформы', item.Platform) + buildMetaRowPlain('Длительность', item.Duration) + buildMetaRowPlain('Возраст', item.AgeRating);
  } else if (t === 'Игра') {
    col1 = buildMetaRowU('Медиаформат', t) + buildMetaRowU('Год выпуска', year) + buildMetaRowTags('Поджанры', item.Subgenres);
    col2 = buildMetaRowU('Разработчик', item.Developer) + buildMetaRowU('Издатель', item.Publisher) + buildMetaRowPlain('Рейтинг', item.Rating);
    col3 = buildMetaRowU('Платформы', item.Platform) + buildMetaRowPlain('Возраст', item.AgeRating);
  } else if (t === 'Книга') {
    col1 = buildMetaRowU('Медиаформат', t) + buildMetaRowU('Год выпуска', year) + buildMetaRowTags('Поджанры', item.Subgenres);
    col2 = buildMetaRowU('Автор', item.Author) + buildMetaRowU('Издательство', item.Publisher) + buildMetaRowPlain('Страниц', item.Pages) + buildMetaRowPlain('Рейтинг', item.Rating);
    col3 = buildMetaRowPlain('Возраст', item.AgeRating);
  } else if (t === 'Комикс') {
    col1 = buildMetaRowU('Медиаформат', t) + buildMetaRowU('Год выпуска', year) + buildMetaRowTags('Поджанры', item.Subgenres);
    col2 = buildMetaRowU('Автор', item.Author) + buildMetaRowU('Издательство', item.Publisher) + buildMetaRowPlain('Выпусков', item.Issues) + buildMetaRowPlain('Рейтинг', item.Rating);
    col3 = buildMetaRowPlain('Возраст', item.AgeRating);
  } else {
    col1 = buildMetaRowU('Медиаформат', t) + buildMetaRowU('Год выпуска', year) + buildMetaRowTags('Поджанры', item.Subgenres);
    col2 = buildMetaRowPlain('Рейтинг', item.Rating);
    col3 = buildMetaRowPlain('Возраст', item.AgeRating);
  }
  return (col1 ? '<div class="meta-col">' + col1 + '</div>' : '') + (col2 ? '<div class="meta-col">' + col2 + '</div>' : '') + (col3 ? '<div class="meta-col">' + col3 + '</div>' : '');
}
function initObjectPage() {
  applyObjectFromQuery();
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  var loadingEl = document.getElementById('obj-loading');
  if (!id) {
    if (loadingEl) loadingEl.textContent = 'ID не указан. Вернитесь на таймлайн.';
    return;
  }
  fetch('../assets/data/horror_media.json').then(function (r) {
    return r.json();
  }).then(function (data) {
    var item = data.find(function (x) {
      return x.id === id;
    });
    if (!item) {
      if (loadingEl) loadingEl.textContent = 'Произведение не найдено.';
      return;
    }
    document.title = item.Title + ' — ЧИЛЛС';
    var year = item.YearEnd && String(item.YearEnd).trim() ? String(item.YearEnd) : String(item.Year || '');
    setText('obj-title-name', '▷ ' + item.Title + ' ◁');
    setText('obj-title-year', year ? '(' + year + ')' : '');
    var posterImg = document.getElementById('obj-poster-img');
    if (posterImg) {
      posterImg.src = item.Cover || PLACEHOLDER;
      posterImg.alt = item.Title || '';
      posterImg.onerror = function () {
        this.src = PLACEHOLDER;
        this.onerror = null;
      };
    }
    var hasTrailerType = item.Type === 'Фильм' || item.Type === 'Сериал' || item.Type === 'Игра';
    if (hasTrailerType) {
      var trailerEl = document.getElementById('obj-trailer');
      if (trailerEl) trailerEl.style.display = '';
      var typeLabel = item.Type === 'Игра' ? 'ГЕЙМПЛЕЙ' : 'ТРЕЙЛЕР ' + (item.Type === 'Сериал' ? 'СЕРИАЛА' : 'ФИЛЬМА');
      setText('obj-trailer-header', '▷ ' + typeLabel);
      var trailerThumb = document.getElementById('obj-trailer-thumb');
      if (trailerThumb) {
        var tImg = document.createElement('img');
        var trailerFallback = pickTrailerFallbackCover(id);
        tImg.src = item.TrailerCover || '../assets/media/trailers_pictures/' + id + '.jpg';
        tImg.alt = 'Трейлер';
        tImg.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
        tImg.onerror = function () {
          this.src = trailerFallback;
          this.onerror = null;
        };
        trailerThumb.innerHTML = '';
        trailerThumb.appendChild(tImg);
      }
      var trailerHref = item.TrailerLink || item.Link;
      if (trailerHref) {
        setAttr('obj-trailer-link', 'href', trailerHref);
      }
    }
    setHtml('meta-block', buildMetaHtml(item, year));
    if (item.Tropes && item.Tropes.trim()) {
      var tropesHtml = item.Tropes.split('|').map(function (t) {
        return '<span class="trope-tag">' + esc(t.trim()) + '</span>';
      }).join('');
      setHtml('tropes-bar', tropesHtml);
      show('sec-tropes');
    }
    if (item.Description && item.Description.trim()) {
      setText('obj-desc-text', item.Description);
      show('sec-desc');
    }
    if (item.Quote && item.Quote.trim()) {
      setText('obj-quote-text', '«' + item.Quote + '»');
      show('sec-quote');
    }
    var workArticles = WORK_ARTICLES[id];
    if (workArticles && workArticles.length) {
      var articlesGrid = document.getElementById('articles-grid');
      if (articlesGrid) {
        articlesGrid.innerHTML = '<div class="cards-scroll-wrap"><div class="cards-row">' + workArticles.map(function (a) {
          return '<a class="article-card dark" href="' + esc(a.href) + '"' + ' data-guide="' + esc(a.guide || '') + '" style="text-decoration:none;">' + '<div class="card-img">' + '<img src="' + esc(a.cover) + '" alt="' + esc(a.title) + '" loading="lazy"' + ' onerror="this.src=\'' + PLACEHOLDER + '\';this.onerror=null;">' + '</div>' + '<div class="card-info">' + '<p class="card-title">' + esc(a.title) + '</p>' + '<div class="card-meta">' + '<div class="card-tags">' + '<p>!' + esc(a.section || 'НАВИГАТОРЫ') + '!</p>' + '<p>⁕Время чтения ~ ' + esc(a.readTime || '5 минут') + '⁕</p>' + '</div>' + '<div class="read-btn-outer"><div class="read-btn-inner">' + '<span class="read-btn-text">Читать статью</span>' + '<span class="read-btn-arrow"><img src="../assets/media/elements_pictures/Q_BlackArrowGuide.svg" alt="→"></span>' + '</div></div>' + '</div>' + '</div>' + '</a>';
        }).join('') + '</div></div>';
        var secArticles = document.getElementById('sec-articles');
        if (secArticles) secArticles.style.display = '';
      }
    }
    fillCardSection('sec-influence', 'influence-row', item.Influence, data);
    fillCardSection('sec-legacy', 'legacy-row', item.Legacy, data);
    fillCardSection('sec-franchise', 'franchise-row', item.Franchise, data);
    fillCardSection('sec-samegenre', 'samegenre-row', item.SameGenre, data);
    if (item.Type === 'Игра' || item.Type === 'Комикс') {
      setText('cast-header', 'Персонажи:');
    }
    if (loadingEl) loadingEl.remove();
    show('obj-nav');
    show('obj-content');
    var footer = document.getElementById('obj-footer');
    var content = document.getElementById('obj-content');
    var page = document.getElementById('object-page');
    function placeFooter() {
      if (!footer || !content) return;
      footer.style.display = '';
      var useFlowLayout = window.matchMedia('(max-width: 768px)').matches;
      if (useFlowLayout) {
        footer.style.position = 'relative';
        footer.style.left = 'auto';
        footer.style.top = 'auto';
        footer.style.width = '100%';
        if (page) page.style.minHeight = '';
        return;
      }
      footer.style.position = 'absolute';
      footer.style.left = '0';
      footer.style.width = '100%';
      var contentBottom = content.offsetTop + content.offsetHeight;
      footer.style.top = contentBottom + 20 + 'px';
      if (page) page.style.minHeight = contentBottom + 20 + 150 + 'px';
    }
    requestAnimationFrame(placeFooter);
    window.addEventListener('resize', placeFooter);
  })["catch"](function (err) {
    console.error('Ошибка загрузки данных:', err);
    if (loadingEl) loadingEl.textContent = 'ОШИБКА ЗАГРУЗКИ ДАННЫХ';
  });
}
document.addEventListener('DOMContentLoaded', initObjectPage);
/******/ })()
;
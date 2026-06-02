import '../stylesheets/home.css'
import coverDefault from '../assets/media/elements_pictures/CoverVariantsDefault.png'
import coverVideogame from '../assets/media/elements_pictures/CoverVariantsVideogame.png'
import coverBook from '../assets/media/elements_pictures/CoverVariantsBook.png'
import coverFilm from '../assets/media/elements_pictures/kartochka_film.png'
import coverComics from '../assets/media/elements_pictures/kartochka_comics.png'
import coverSerial from '../assets/media/elements_pictures/kartochka_serial.png'
import coverFilmAlt from '../assets/media/elements_pictures/CoverVariantsFilm.png'

var COVER_MAP = {
  'CoverVariantsDefault.png': coverDefault,
  'CoverVariantsVideogame.png': coverVideogame,
  'CoverVariantsBook.png': coverBook,
  'CoverVariantsFilm.png': coverFilmAlt,
  'kartochka_film.png': coverFilm,
  'kartochka_comics.png': coverComics,
  'kartochka_serial.png': coverSerial
}

function resolveCover(attr) {
  if (!attr) return null
  var filename = attr.split('/').pop()
  return COVER_MAP[filename] || null
}

function showDialogState(state) {
  var dialog = document.getElementById('dialog-mac')
  document.getElementById('dialog-view-default').style.display = state === 'default' ? '' : 'none'
  document.getElementById('dialog-view-no').style.display = state === 'no' ? '' : 'none'
  document.getElementById('dialog-view-closed').style.display = state === 'closed' ? '' : 'none'
  if (state === 'closed') {
    dialog.classList.add('state-closed')
  } else {
    dialog.classList.remove('state-closed')
  }
}

function isGuessClickMode() {
  return window.matchMedia('(max-width: 768px)').matches
}

function setGuessHintText() {
  var hint = document.querySelector('.guess-hint')
  if (!hint) return
  hint.textContent = isGuessClickMode()
    ? '▷ Нажмите на карточку, чтобы увидеть медиаформат.'
    : '▷ Удерживайте курсор на синих карточках, чтобы посмотреть, какого формата произведение перед вами'
}

function initGuessCards() {
  document.querySelectorAll('.guess-cards .card').forEach(function (card) {
    var img = card.querySelector('img')
    if (!img) return
    var defaultSrc = resolveCover(card.getAttribute('data-cover-default')) || img.src
    var hoverSrc = resolveCover(card.getAttribute('data-cover-hover')) || defaultSrc

    img.src = defaultSrc

    card.addEventListener('mouseenter', function () {
      if (isGuessClickMode()) return
      img.src = hoverSrc
    })
    card.addEventListener('mouseleave', function () {
      if (isGuessClickMode()) return
      img.src = defaultSrc
    })
    card.addEventListener('click', function (e) {
      if (!isGuessClickMode()) return
      e.preventDefault()
      if (card.getAttribute('data-guess-flipped') === '1') {
        card.removeAttribute('data-guess-flipped')
        img.src = defaultSrc
      } else {
        card.setAttribute('data-guess-flipped', '1')
        img.src = hoverSrc
      }
    })
  })

  setGuessHintText()
  var resizeGuessTimer
  window.addEventListener('resize', function () {
    clearTimeout(resizeGuessTimer)
    resizeGuessTimer = setTimeout(function () {
      setGuessHintText()
      document.querySelectorAll('.guess-cards .card').forEach(function (card) {
        var img = card.querySelector('img')
        if (!img) return
        var defaultSrc = resolveCover(card.getAttribute('data-cover-default')) || img.src
        var hoverSrc = resolveCover(card.getAttribute('data-cover-hover')) || defaultSrc
        if (!isGuessClickMode()) {
          card.removeAttribute('data-guess-flipped')
          img.src = defaultSrc
        } else {
          img.src = card.getAttribute('data-guess-flipped') === '1' ? hoverSrc : defaultSrc
        }
      })
    }, 150)
  })
}

window.showDialogState = showDialogState

document.addEventListener('DOMContentLoaded', initGuessCards)

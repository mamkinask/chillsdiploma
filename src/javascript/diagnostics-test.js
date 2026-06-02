import '../stylesheets/diagnostics-test.css'

var PLACEHOLDER = '../assets/media/elements_pictures/place-holder-picture.png'

var DIAGNOSTICS_QUESTIONS = [
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest1.jpg',
    question: 'Что страшнее — то, что показывают, или то, что остаётся за кадром?',
    options: [
      { text: 'За кадром. Пустота и намёк бьют сильнее', scores: { 'Tension Level': 5 } },
      { text: 'Оба варианта по-своему. Нужен баланс', scores: { 'Tension Level': 4 } },
      { text: 'Показывают. Хочу видеть источник страха', scores: { 'Tension Level': 3 } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest2.jpg',
    question: 'В какой момент ночи проснуться страшнее всего?',
    options: [
      { text: 'В глухую полночь — ни рассвета, ни сумерек', scores: { 'Atmosphere': 'Тёмная и гнетущая', 'Mood': 'Тревожное' } },
      { text: 'В три — город спит, за окном пусто', scores: { 'Atmosphere': 'Пригород' } },
      { text: 'Перед рассветом — уже не ночь, но ещё не день', scores: { 'Mood': 'Параноидальное' } },
      { text: 'В лесу, когда не понять — день или ночь', scores: { 'Atmosphere': 'Мрачная и изолированная' } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest3.jpg',
    question: 'Какой звук в полной тишине заставил бы вас замолчать?',
    options: [
      { text: 'Шаги, когда знаешь, что рядом никого нет', scores: { 'Fear Type': 'Сверхъестественный' } },
      { text: 'Чьё-то дыхание за спиной', scores: { 'Fear Type': 'Маньяк' } },
      { text: 'Скрип, стук — что-то неживое, но «живое»', scores: { 'Fear Type': 'Монстры' } },
      { text: 'Звук, который невозможно описать или повторить', scores: { 'Fear Type': 'Монстры' } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest4.jpg',
    question: 'Вы бы скорее вошли в тёмную комнату, зная, что там кто-то есть, или в светлую — не зная?',
    options: [
      { text: 'В тёмную, зная. Лучше враг, чем пустота', scores: { 'Tension Level': 3, 'Scare Level': 4 } },
      { text: 'В светлую, не зная. Неопределённость страшнее', scores: { 'Tension Level': 5, 'Scare Level': 3 } },
      { text: 'Оба варианта невозможны. Не вошёл бы ни в ту, ни в другую', scores: { 'Scare Level': 5 } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest5.jpg',
    question: 'Что страшнее — монстр с лицом или без лица?',
    options: [
      { text: 'С лицом. Чужое, но узнаваемое — невыносимее', scores: { 'Fear Type': 'Монстры' } },
      { text: 'Без лица. То, чего нельзя прочитать', scores: { 'Fear Type': 'Монстры' } },
      { text: 'Человеческое лицо, которое вдруг «съезжает»', scores: { 'Fear Type': 'Маньяк' } },
      { text: 'Пустота там, где должно быть лицо', scores: { 'Fear Type': 'Сверхъестественный' } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest6.jpg',
    question: 'Где пустота страшнее — в городе или вдали от людей?',
    options: [
      { text: 'В городе. Оживлённое место, в котором ни души', scores: { 'Atmosphere': 'Зловещая' } },
      { text: 'Вдали от людей. Лес, поле, дорога в никуда', scores: { 'Atmosphere': 'Мрачная и изолированная' } },
      { text: 'В замкнутом пространстве — корабль, база, бункер', scores: { 'Atmosphere': 'Странная и сновидческая' } },
      { text: 'В старом доме, где когда-то жили, а теперь — тишина', scores: { 'Atmosphere': 'Тёмная и гнетущая' } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest7.jpg',
    question: 'Вам ближе страх, от которого можно убежать, или от которого не спрятаться?',
    options: [
      { text: 'Убежать. Хотя бы иллюзия выбора', scores: { 'Mood': 'Весёлое и безумное', 'Genre': 'Слэшер' } },
      { text: 'Не спрятаться. Так честнее', scores: { 'Mood': 'Параноидальное' } },
      { text: 'Страх, в котором не ясно — можно ли вообще убежать', scores: { 'Mood': 'Тревожное', 'Genre': 'Психологический хоррор' } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest8.jpg',
    question: 'Что страшнее — когда зло приходит извне или когда оно уже внутри?',
    options: [
      { text: 'Извне. Призрак, существо, чужое', scores: { 'Fear Type': 'Сверхъестественный', 'Genre': 'Сверхъестественный хоррор' } },
      { text: 'Внутри. Безумие, слом, предательство себя', scores: { 'Fear Type': 'Психологический', 'Genre': 'Психологический хоррор' } },
      { text: 'Внутри тела — что-то растёт, меняется', scores: { 'Fear Type': 'Монстры' } },
      { text: 'Не понять, откуда. Оно везде и нигде', scores: { 'Fear Type': 'Монстры', 'Genre': 'Фантастический хоррор' } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest9.jpg',
    question: 'Какой конец истории для вас страшнее — открытый или однозначно плохой?',
    options: [
      { text: 'Открытый. Незнание хуже любой развязки', scores: { 'Mood': 'Тревожное' } },
      { text: 'Однозначно плохой. Безысходность до конца', scores: { 'Mood': 'Параноидальное' } },
      { text: 'Тот, где зло остаётся — не побеждённое', scores: { 'Mood': 'Тревожное' } },
      { text: 'С оттенком иронии — как будто всё это шутка', scores: { 'Mood': 'Весёлое и безумное' } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest10.jpg',
    question: 'Вам интереснее бояться за героя или вместе с ним не понимать, что происходит?',
    options: [
      { text: 'Бояться за героя. Ясно, кто враг, хочу переживать погоню', scores: { 'Genre': 'Слэшер', 'Scare Level': 4 } },
      { text: 'Не понимать. Пусть реальность плывёт', scores: { 'Genre': 'Психологический хоррор', 'Scare Level': 3 } },
      { text: 'И то и другое — чтобы и непонятно, и физически опасно', scores: { 'Scare Level': 5 } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest11.jpg',
    question: 'Что пугает сильнее — то, что у угрозы есть правила, или то, что правил нет?',
    options: [
      { text: 'Есть правила. Можно пытаться выжить по ним — и ошибиться', scores: { 'Genre': 'Сверхъестественный хоррор', 'Tension Level': 4 } },
      { text: 'Правил нет. Невозможно предсказать', scores: { 'Fear Type': 'Монстры', 'Genre': 'Фантастический хоррор' } },
      { text: 'Правила есть, но они бесчеловечны', scores: { 'Fear Type': 'Маньяк' } },
      { text: 'Угроза не следует логике — ни нашей, ни своей', scores: { 'Fear Type': 'Сверхъестественный', 'Genre': 'Сверхъестественный хоррор' } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest12.jpg',
    question: 'Темнота для вас — укрытие или угроза?',
    options: [
      { text: 'Укрытие. В темноте можно спрятаться', scores: { 'Mood': 'Весёлое и безумное', 'Scare Level': 2 } },
      { text: 'Угроза. В темноте что-то ждёт', scores: { 'Mood': 'Тревожное', 'Scare Level': 4 } },
      { text: 'И то и другое. Темнота не на твоей стороне', scores: { 'Mood': 'Параноидальное', 'Scare Level': 5 } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest13.jpg',
    question: 'Что страшнее — забыть кого-то важного или быть забытым?',
    options: [
      { text: 'Забыть. Потерять память о близком', scores: { 'Genre': 'Психологический хоррор', 'Fear Type': 'Психологический' } },
      { text: 'Быть забытым. Исчезнуть из чьей-то реальности', scores: { 'Mood': 'Параноидальное', 'Fear Type': 'Сверхъестественный' } },
      { text: 'Оба варианта — про одиночество и потерю связи', scores: { 'Mood': 'Тревожное' } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest14.jpg',
    question: 'Где граница страха для вас — в голове или на экране?',
    options: [
      { text: 'В голове. Додуманное страшнее показанного', scores: { 'Scare Level': 3, 'Genre': 'Психологический хоррор' } },
      { text: 'На экране. Хочу, чтобы ударили по нервам напрямую', scores: { 'Scare Level': 5, 'Genre': 'Слэшер' } },
      { text: 'На стыке — когда не ясно, было ли это на самом деле', scores: { 'Scare Level': 4 } }
    ]
  },
  {
    imageUrl: '../assets/media/elements_pictures/ImageTest15.jpg',
    question: 'Кого вы бы не хотели встретить в тупике?',
    options: [
      { text: 'Того, кого не описать словами', scores: { 'Fear Type': 'Монстры', 'Genre': 'Фантастический хоррор' } },
      { text: 'Того, кого когда-то знал', scores: { 'Fear Type': 'Маньяк' } },
      { text: 'То, что когда-то было человеком', scores: { 'Fear Type': 'Монстры', 'Genre': 'Зомби-хоррор' } },
      { text: 'Никого — пустой тупик страшнее', scores: { 'Fear Type': 'Сверхъестественный', 'Genre': 'Сверхъестественный хоррор' } }
    ]
  }
]

var N = DIAGNOSTICS_QUESTIONS.length
var state = { currentStep: 1, answers: {}, scores: {} }
var stepsContainer
var progressContainer
var resultEl

function escapeHtml(s) {
  var div = document.createElement('div')
  div.textContent = s
  return div.innerHTML
}

function buildStepCard(questionIndex, q) {
  var step = questionIndex + 1
  var numLabel = step + '/' + N
  var card = document.createElement('div')
  card.className = 'test-card' + (step === 1 ? ' current' : '')
  card.setAttribute('data-step', step)

  var imageHtml = q.imageUrl
    ? '<div class="test-card-image"><img src="' + escapeHtml(q.imageUrl) + '" alt=""></div>'
    : '<div class="test-card-image"></div>'

  var optionsHtml = q.options.map(function (opt, i) {
    var scoresStr = escapeHtml(JSON.stringify(opt.scores || {}))
    return '<button type="button" class="test-card-option" data-step="' + step + '" data-option="' + i + '" data-scores="' + scoresStr + '"><span class="radio"></span><span class="label">' + escapeHtml(opt.text) + '</span></button>'
  }).join('')

  card.innerHTML = imageHtml +
    '<div class="test-card-body">' +
      '<div class="test-card-header">' +
        '<span class="test-card-number">' + escapeHtml(numLabel) + ':</span>' +
        '<p class="test-card-question">' + escapeHtml(q.question) + '</p>' +
      '</div>' +
      '<div class="test-card-options">' + optionsHtml + '</div>' +
    '</div>' +
    '<div class="test-card-nav">' +
      '<button type="button" class="test-btn-back" id="test-prev-' + step + '">НАЗАД</button>' +
      '<button type="button" class="test-btn-next" id="test-next-' + step + '">ДАЛЕЕ</button>' +
    '</div>'
  return card
}

function renderSteps() {
  stepsContainer.innerHTML = ''
  progressContainer.innerHTML = ''
  DIAGNOSTICS_QUESTIONS.forEach(function (q, i) {
    stepsContainer.appendChild(buildStepCard(i, q))
    var dot = document.createElement('span')
    dot.className = 'test-progress-dot' + (i === 0 ? ' active' : '')
    dot.setAttribute('data-step', i + 1)
    progressContainer.appendChild(dot)
  })
}

function showStep(step) {
  step = Math.max(1, Math.min(N, step))
  state.currentStep = step
  var cards = stepsContainer.querySelectorAll('.test-card')
  var dots = progressContainer.querySelectorAll('.test-progress-dot')
  cards.forEach(function (el) {
    el.classList.toggle('current', parseInt(el.getAttribute('data-step'), 10) === step)
  })
  dots.forEach(function (dot) {
    var n = parseInt(dot.getAttribute('data-step'), 10)
    dot.classList.remove('active', 'done')
    if (n === step) dot.classList.add('active')
    else if (n < step) dot.classList.add('done')
  })
  resultEl.classList.remove('visible')
}

function updateBackNextButtons() {
  var step = state.currentStep
  var prevBtn = document.getElementById('test-prev-' + step)
  var nextBtn = document.getElementById('test-next-' + step)
  if (prevBtn) prevBtn.disabled = step <= 1
  if (nextBtn) {
    nextBtn.textContent = step === N ? 'Узнать результат' : 'ДАЛЕЕ'
    nextBtn.disabled = state.answers[step] === undefined
  }
}

function collectScores() {
  var scores = {}
  for (var step = 1; step <= N; step++) {
    var optionIndex = state.answers[step]
    if (optionIndex === undefined) continue
    var q = DIAGNOSTICS_QUESTIONS[step - 1]
    if (!q || !q.options || !q.options[optionIndex]) continue
    var s = q.options[optionIndex].scores || {}
    Object.keys(s).forEach(function (k) {
      if (!scores[k]) scores[k] = []
      scores[k].push(s[k])
    })
  }
  return scores
}

function buildProfile(scores) {
  var profile = {}
  Object.keys(scores).forEach(function (key) {
    var arr = scores[key]
    if (arr && arr.length) profile[key] = arr[arr.length - 1]
  })
  return profile
}

var smilesTimer = null

function startSmilesAnimation() {
  var smilesEl = document.getElementById('result-loading-smiles')
  if (!smilesEl) return
  var frames = ['', ':', ':)', ':))', ':)))']
  var i = 0
  smilesTimer = setInterval(function () {
    smilesEl.textContent = frames[i % frames.length]
    i++
  }, 350)
}

function stopSmilesAnimation() {
  if (smilesTimer) { clearInterval(smilesTimer); smilesTimer = null }
  var loadingBlock = document.getElementById('result-loading')
  if (loadingBlock) loadingBlock.style.display = 'none'
}

function findBestMatch(profile, items) {
  var scored = items.map(function (item) {
    var score = 0
    if (profile['Scare Level'] != null && Number(item['Scare Level']) === Number(profile['Scare Level'])) score += 2
    if (profile['Tension Level'] != null && Number(item['Tension Level']) === Number(profile['Tension Level'])) score += 2
    if (profile['Fear Type'] && item['Fear Type'] === profile['Fear Type']) score += 3
    if (profile['Atmosphere'] && item['Atmosphere'] === profile['Atmosphere']) score += 2
    if (profile['Mood'] && item['Mood'] === profile['Mood']) score += 2
    return { item: item, score: score }
  })
  scored.sort(function (a, b) { return b.score - a.score })
  var topScore = scored[0].score
  var topItems = scored.filter(function (x) { return x.score >= topScore - 1 }).slice(0, 5)
  return topItems[Math.floor(Math.random() * topItems.length)].item
}

function fillResultCard(item) {
  var coverEl = document.getElementById('result-cover')
  var titleEl = document.getElementById('result-title')
  var typeEl = document.getElementById('result-type')
  var genresEl = document.getElementById('result-genres')
  var descEl = document.getElementById('result-desc')
  var cardEl = document.getElementById('result-card')
  if (!item || !titleEl) return

  titleEl.textContent = item.Title || ''
  titleEl.href = (item.id || '') + '.html?from=diagnostics-test.html'
  if (typeEl) typeEl.textContent = item.Type || ''
  if (genresEl) genresEl.textContent = item.Subgenres || ''
  if (descEl) descEl.textContent = item.Description || ''

  if (coverEl) {
    var img = document.createElement('img')
    img.alt = item.Title || ''
    img.src = item.Cover || PLACEHOLDER
    img.onerror = function () { this.src = PLACEHOLDER; this.onerror = null }
    coverEl.innerHTML = ''
    coverEl.appendChild(img)
  }
  if (cardEl) cardEl.classList.add('ready')
  stopSmilesAnimation()
}

function showResult() {
  state.scores = collectScores()
  state.profile = buildProfile(state.scores)
  try {
    sessionStorage.setItem('chills_diagnostics_profile', JSON.stringify(state.profile))
    sessionStorage.setItem('chills_diagnostics_scores', JSON.stringify(state.scores))
  } catch (e) {}
  stepsContainer.querySelectorAll('.test-card').forEach(function (el) { el.classList.remove('current') })
  progressContainer.querySelectorAll('.test-progress-dot').forEach(function (dot) { dot.classList.add('done') })
  resultEl.classList.add('visible')
  startSmilesAnimation()

  fetch('../assets/data/horror_media.json')
    .then(function (r) { return r.json() })
    .then(function (data) {
      var rec = findBestMatch(state.profile, data)
      state.recommendation = rec
      fillResultCard(rec)
    }).catch(function (err) {
      console.error('Ошибка загрузки данных:', err)
      stopSmilesAnimation()
    })
}

function goNext() {
  if (state.currentStep === N) { showResult(); return }
  showStep(state.currentStep + 1)
  updateBackNextButtons()
}

function goPrev() {
  showStep(state.currentStep - 1)
  updateBackNextButtons()
}

function bindCard(card) {
  var step = parseInt(card.getAttribute('data-step'), 10)
  card.querySelectorAll('.test-card-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var option = parseInt(btn.getAttribute('data-option'), 10)
      card.querySelectorAll('.test-card-option').forEach(function (b) { b.classList.remove('selected') })
      btn.classList.add('selected')
      state.answers[step] = option
      updateBackNextButtons()
    })
  })
  var prevBtn = document.getElementById('test-prev-' + step)
  var nextBtn = document.getElementById('test-next-' + step)
  if (prevBtn) prevBtn.addEventListener('click', goPrev)
  if (nextBtn) nextBtn.addEventListener('click', goNext)
}

document.addEventListener('DOMContentLoaded', function () {
  stepsContainer = document.getElementById('test-steps')
  progressContainer = document.getElementById('test-progress')
  resultEl = document.getElementById('test-result')

  progressContainer.addEventListener('click', function (e) {
    var dot = e.target.closest('.test-progress-dot')
    if (!dot) return
    var step = parseInt(dot.getAttribute('data-step'), 10)
    if (step <= state.currentStep || state.answers[step - 1] !== undefined) showStep(step)
    updateBackNextButtons()
  })

  renderSteps()
  stepsContainer.querySelectorAll('.test-card').forEach(bindCard)
  showStep(1)
  updateBackNextButtons()
})

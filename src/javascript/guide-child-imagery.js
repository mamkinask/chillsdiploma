import '../stylesheets/guide.css'

document.addEventListener('DOMContentLoaded', function () {
  var items = [
    { id: 'rosemarys-baby', imgId: 'ci-poster-rosemarys-baby' },
    { id: 'the-shining', imgId: 'ci-poster-the-shining' },
    { id: 'it', imgId: 'ci-poster-it' }
  ]
  fetch('../assets/data/horror_media.json')
    .then(function (r) { return r.json() })
    .then(function (data) {
      items.forEach(function (item) {
        var entry = data.find(function (x) { return x.id === item.id })
        if (!entry) return
        var img = document.getElementById(item.imgId)
        if (img && entry.Cover) {
          img.src = entry.Cover
          img.alt = entry.Title || ''
        }
      })
    })
    .catch(function () {})
})

import '../stylesheets/guide.css'

document.addEventListener('DOMContentLoaded', function () {
  var items = [
    { id: 'alien', imgId: 'bh-poster-alien' },
    { id: 'dead-space', imgId: 'bh-poster-dead-space' },
    { id: 'the-thing', imgId: 'bh-poster-the-thing' }
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

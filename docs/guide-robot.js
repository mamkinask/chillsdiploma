/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

function loadGuidePoster() {
  fetch('../assets/data/horror_media.json').then(function (r) {
    return r.json();
  }).then(function (data) {
    var item = data.find(function (x) {
      return x.id === 'alien';
    });
    if (!item) return;
    var img = document.getElementById('film-poster');
    if (img && item.Cover) {
      img.src = item.Cover;
      img.alt = item.Title || 'Чужой';
      img.onerror = function () {
        this.src = '../assets/media/elements_pictures/place-holder-picture.png';
        this.onerror = null;
      };
    }
  })["catch"](function () {});
}
document.addEventListener('DOMContentLoaded', loadGuidePoster);
/******/ })()
;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var items = [{
    id: 'alien-isolation',
    imgId: 'film-poster-alien-isolation'
  }, {
    id: 'amnesia-the-dark-descent',
    imgId: 'film-poster-amnesia'
  }, {
    id: 'silent-hill-1-game',
    imgId: 'film-poster-silent-hill'
  }];
  fetch('../assets/data/horror_media.json').then(function (r) {
    return r.json();
  }).then(function (data) {
    items.forEach(function (item) {
      var entry = data.find(function (x) {
        return x.id === item.id;
      });
      if (!entry) return;
      var img = document.getElementById(item.imgId);
      if (img && entry.Cover) {
        img.src = entry.Cover;
        img.alt = entry.Title || '';
        img.onerror = function () {
          this.src = '../assets/media/elements_pictures/place-holder-picture.png';
          this.onerror = null;
        };
      }
    });
  })["catch"](function () {});
});
/******/ })()
;
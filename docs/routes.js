/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var cards = document.querySelectorAll('.route-card[data-params]');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var params = card.getAttribute('data-params');
      window.location.href = 'timeline.html' + (params ? '?' + params : '');
    });
  });
});
/******/ })()
;
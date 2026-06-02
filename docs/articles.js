/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

function initArticlesFilter() {
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cb = this.querySelector('.cb');
      var isChecked = cb.classList.contains('checked');
      var category = this.getAttribute('data-filter');
      document.querySelectorAll('.filter-btn .cb').forEach(function (c) {
        c.classList.remove('checked');
      });
      if (isChecked) {
        document.querySelectorAll('.article-card').forEach(function (card) {
          card.style.display = '';
        });
      } else {
        cb.classList.add('checked');
        document.querySelectorAll('.article-card').forEach(function (card) {
          card.style.display = card.getAttribute('data-category') === category ? '' : 'none';
        });
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', initArticlesFilter);
/******/ })()
;
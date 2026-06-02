# ЧИЛЛС

Сайт про хоррор-медиа: фильмы, книги, комиксы и игры.
ПАМЯТКА

## Запуск

```bash
npm install
npm start
```

Сайт откроется автоматически в браузере.

Страницы произведений (Франкенштейн, Дракула и т.д.) генерируются в `docs/pages/` скриптом `scripts/generate-pages.js` — перед `npm start` он запускается автоматически (`prestart`).

Адаптивная вёрстка карточек произведений живёт в `src/stylesheets/object.css`, а не в отдельных HTML-файлах. **Не перегенерируйте страницы вручную ради адаптивов** — достаточно править CSS и снова запускать `npm start`.

Если нужен только просмотр уже собранного сайта без webpack:

```bash
npm run build
npm run preview
```

## Airtable

Чтобы подключить Airtable, нужно создать файл `airtable-secret.js` в корне проекта:

```js
module.exports = {
  AIRTABLE_BASE: 'base_id',
  AIRTABLE_TOKEN: 'personal_access_token'
}
```

## Добавление произведения в базу

1. Добавьте запись в `src/assets/data/horror_media.json` (обязательно поле **`id`**, латиница и дефисы, например `war-of-the-worlds-book`).
2. Положите обложку в `src/assets/media/covers_pictures/` — имя файла как в поле **`Cover`** (например `war-of-the-worlds-book.jpg`).
3. Сгенерируйте HTML-страницы: `npm run generate` (или перезапустите `npm start` — скрипт запустится сам).

Таймлайн показывает только произведения с загруженной обложкой (`timeline_media.json` создаётся автоматически). Без шага 3 ссылки на карточках дадут `Cannot GET /pages/….html`.

## upd 06.04.2026 обошлись json базой

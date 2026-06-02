# Медиафайлы проекта ЧИЛЛС

Сюда кладите все картинки, гифки и SVG для сайта.

## Куда загружать

- **Папка:** `src/assets/media/`
- **Для страниц в `src/pages/`** в разметке используйте путь от папки страницы:
  - `../assets/media/ИмяФайла.png`
  - Пример: `<img src="../assets/media/MainPageLandscape.png" alt="">`

## Где что использовать

| Назначение | Папка | Пример пути в коде |
|------------|--------|---------------------|
| Главная (chillsv2), герой, монстр, бегущая строка | `src/assets/media/` | `../assets/media/MonsterChills.png` |
| Страница Гид — обложки статей, фоны | `src/assets/media/` | `../assets/media/GuideArticle1.png` |
| Тест диагностики — картинки к вопросам | `src/assets/media/` | в конфиге `imageUrl: '../assets/media/QuestionNoise.png'` или полный URL |
| Таймлайн — обложки произведений | по желанию тут же или из Airtable | `../assets/media/` или URL из API |

## Имена файлов

- Лучше без пробелов: `CoverFilm.png`, `noise-texture.png`.
- Кириллица в именах может работать, но надёжнее латиница.

## Белый шум / зерно фона

- Сейчас на странице **Гид** шум сделан через CSS (SVG `feTurbulence`) — картинка не обязательна.
- Если нужен именно ваш текстурый фон из Figma: экспортируйте картинку (например PNG 200×200 с зерном), положите в `src/assets/media/` (например `NoiseTexture.png`) и в `guide.html` замените слой `.guide-bg::after` на использование этой картинки:
  `background-image: url('../assets/media/NoiseTexture.png');`

## Сборка

Webpack копирует или отдаёт файлы из `src/assets/` в зависимости от настроек. Пути `../assets/media/...` в HTML указывают на исходники в `src/`.

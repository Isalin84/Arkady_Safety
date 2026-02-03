# STF Landing — Месячник безопасности

Лендинг-страница для сотрудников 11 пивоваренных заводов в рамках месячника по производственной безопасности.

**Тема:** Управление рисками спотыкания, поскальзывания и падения (STF)

## Быстрый старт

```bash
# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev

# Собрать для продакшена
npm run build

# Превью сборки
npm run preview
```

## Структура проекта

```
src/
├── assets/           # Локальные ассеты (если нужны)
├── components/       # React-компоненты блоков B1–B9
│   ├── Hero.tsx
│   ├── ArkadyTips.tsx
│   ├── RiskAccordion.tsx
│   ├── ControlHierarchy.tsx
│   ├── Checklist.tsx
│   ├── Quiz.tsx
│   ├── HazardSpotting.tsx
│   ├── WinterModule.tsx
│   ├── FooterCTA.tsx
│   ├── MuteToggle.tsx
│   └── ResetProgress.tsx
├── data/
│   └── content.json  # Весь контент (тексты, вопросы, риски)
├── utils/
│   ├── storage.ts    # Работа с localStorage
│   ├── sound.ts      # Управление звуками
│   └── cn.ts         # Утилита для классов
├── App.tsx
├── main.tsx
└── index.css         # Tailwind + кастомные стили

public/
├── images/           # Изображения (см. PLACEHOLDERS.md)
│   ├── arkady.png
│   ├── IMG-01_trip-sketch_4x3.png
│   ├── IMG-02_winter-sketch_4x3.png
│   ├── IMG-03_safe-circles_21x9.png
│   └── IMG-04_hazard-scene_16x9.png
└── audio/            # Звуковые эффекты
    ├── click.mp3
    ├── success.mp3
    ├── error.mp3
    └── hint.mp3
```

## Как обновить контент

Все тексты, вопросы квиза, чек-лист и описания рисков находятся в файле:

```
src/data/content.json
```

### Структура content.json

- `hero` — заголовки и кнопки главного экрана
- `arkady` — приветствие и привычки Аркадия
- `risks` — список рисков с иконками
- `controls` — иерархия контроля (4 карточки)
- `checklist` — пункты чек-листа с категориями
- `checklist_recommendations` — рекомендации по категориям
- `checklist_thresholds` — пороги для цветов результата
- `quiz` — вопросы, варианты, ответы и объяснения
- `hazard_spotting` — координаты hotspot'ов для игры
- `safe_start_states` — состояния Safe Start с антидотами
- `winter_scenarios` — советы по сезонам

## Изображения

Требуемые изображения и промпты для генерации описаны в:

```
public/images/PLACEHOLDERS.md
```

**Ключевые файлы:**
| Файл | Размер | Назначение |
|------|--------|------------|
| `arkady.png` | 400×500 | Аватар Аркадия в Hero |
| `IMG-01_trip-sketch_4x3.png` | 1200×900 | Скетч near-miss trip |
| `IMG-02_winter-sketch_4x3.png` | 1200×900 | Скетч зимней ходьбы |
| `IMG-03_safe-circles_21x9.png` | 2100×900 | Пиктограммы Safe Start |
| `IMG-04_hazard-scene_16x9.png` | 1600×900 | Сцена для Hazard Spotting |

## localStorage

Данные хранятся локально в браузере:

| Ключ | Описание |
|------|----------|
| `stf_mute` | Состояние звука |
| `stf_checklist_state` | Прогресс чек-листа |
| `stf_quiz_state` | Прогресс квиза |
| `stf_hazard_state` | Найденные опасности |
| `stf_season` | Выбранный сезон |
| `stf_last_visit` | Последний визит |

Кнопка «Сбросить прогресс» удаляет все ключи.

## Технологии

- **React 18** + TypeScript
- **Vite** — сборка
- **Tailwind CSS** — стилизация
- **Lucide React** — иконки

## Фирменный стиль

Палитра и шрифты соответствуют брендбуку «Напитки вместе»:

**Шрифты:**
- Заголовки: Bebas Neue
- Текст: Arial Nova (с fallback на Arial)

**Основные цвета:**
- Wine: `#9D3339`
- Wine Dark: `#450D1B`
- Forest: `#1E4B2E`
- Teal: `#194245`
- Cream: `#F4E5CB`
- Peach: `#F7D1AA`
- Mint: `#A5D7AB`

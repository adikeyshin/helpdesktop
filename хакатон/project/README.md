# AI Startup - Шаблон проекта

Полноценный шаблон сайта для проекта с элементами искусственного интеллекта.

## Структура проекта

```
project/
├── assets/
│   ├── css/
│   │   └── style.css          # Основные стили
│   ├── js/
│   │   ├── main.js            # Основная логика и навигация
│   │   └── ai-demo.js         # AI-функционал
│   └── img/                   # Изображения
├── index.html                 # Главная страница
├── business-model.html        # Бизнес-модель
├── competitors.html           # Анализ конкурентов
├── technical.html             # Техническое описание
├── ai-demo.html              # Демо AI-функционала
└── README.md                 # Документация
```

## Технологии

- **HTML5** - структура страниц
- **CSS3** - стилизация (Flexbox, Grid, анимации)
- **JavaScript (ES6+)** - интерактивность и AI-интеграция

## Быстрый старт

1. Откройте `index.html` в браузере
2. Для работы AI-демо настройте API в `assets/js/ai-demo.js`

## Настройка AI API

Откройте файл `assets/js/ai-demo.js` и обновите:

```javascript
this.apiKey = 'YOUR_API_KEY';      // Ваш API ключ
this.apiUrl = 'https://api.example.com/ai';  // URL вашего API
```

### Примеры интеграции

#### OpenAI API:
```javascript
this.apiUrl = 'https://api.openai.com/v1/chat/completions';
// Формат ответа: data.choices[0].message.content
```

#### Google Gemini API:
```javascript
this.apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
// Адаптируйте формат запроса и ответа
```

#### HuggingFace Inference API:
```javascript
this.apiUrl = 'https://api-inference.huggingface.co/models/MODEL_NAME';
// Формат ответа может отличаться
```

## Особенности

- ✅ Адаптивный дизайн (mobile-first)
- ✅ Современный UI/UX
- ✅ Плавные анимации
- ✅ Мобильное меню
- ✅ Готовая структура для MVP
- ✅ Абстрактная AI-интеграция
- ✅ Легко расширяемый код

## Цветовая схема

- **Основной цвет:** #4caef5 (голубой)
- **Черный:** #000000
- **Белый:** #ffffff
- **Серый:** #808080

## Лицензия

Этот шаблон можно свободно использовать и модифицировать для ваших проектов.


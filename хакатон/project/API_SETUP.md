# Инструкция по настройке AI API

## Быстрая настройка

1. Откройте файл `assets/js/ai-demo.js`
2. Найдите строки с настройками API (строки 7-8)
3. Замените значения на ваши:

```javascript
this.apiKey = 'ваш_api_ключ';
this.apiUrl = 'https://ваш-api-endpoint.com/v1/chat';
```

## Примеры настройки для разных провайдеров

### OpenAI API

```javascript
this.apiKey = 'sk-ваш-ключ-openai';
this.apiUrl = 'https://api.openai.com/v1/chat/completions';
```

В функции `askAI()` используйте формат:
```javascript
body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
    max_tokens: 500
})
```

И извлечение ответа:
```javascript
return {
    text: data.choices[0].message.content
};
```

### Google Gemini API

```javascript
this.apiKey = 'ваш-ключ-gemini';
this.apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.apiKey}`;
```

### HuggingFace Inference API

```javascript
this.apiKey = 'hf_ваш-токен';
this.apiUrl = 'https://api-inference.huggingface.co/models/MODEL_NAME';
```

В заголовках:
```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.apiKey}`
}
```

### Anthropic Claude API

```javascript
this.apiKey = 'sk-ant-ваш-ключ';
this.apiUrl = 'https://api.anthropic.com/v1/messages';
```

## Демо-режим

Если API не настроен, система автоматически переключится на демо-режим с умными ответами. Это позволяет протестировать интерфейс без реального API.

## Безопасность

⚠️ **Важно:** Не публикуйте ваш API ключ в публичных репозиториях!

Для продакшена используйте:
- Переменные окружения
- Backend прокси для API запросов
- Системы управления секретами

## Тестирование

После настройки API:
1. Откройте `ai-demo.html` в браузере
2. Введите тестовое сообщение
3. Проверьте ответ в консоли браузера (F12) на наличие ошибок


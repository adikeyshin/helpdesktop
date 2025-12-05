// Конфигурация AI API
// Скопируйте этот файл и укажите ваши данные API

// Пример для OpenAI API
const OPENAI_CONFIG = {
    apiKey: 'sk-ваш-ключ-openai',
    apiUrl: 'https://api.openai.com/v1/chat/completions'
};

// Пример для HuggingFace API (бесплатный вариант)
const HUGGINGFACE_CONFIG = {
    apiKey: 'hf_ваш-токен',
    apiUrl: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium'
};

// Пример для использования бесплатного AI через прокси
// Можно использовать сервисы типа https://huggingface.co/spaces
const FREE_AI_CONFIG = {
    apiKey: null,
    apiUrl: 'https://api-inference.huggingface.co/models/gpt2' // Пример бесплатной модели
};

// Текущая конфигурация (измените на нужную)
const CURRENT_CONFIG = {
    apiKey: null, // Укажите ваш API ключ
    apiUrl: null  // Укажите URL вашего API
};

// Для подключения реального API откройте assets/js/ai-demo.js
// и измените строки в функции initChat():
// const apiKey = 'ваш-ключ';
// const apiUrl = 'https://api.openai.com/v1/chat/completions';


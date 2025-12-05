// AI API модуль - версия с конкретными ответами

// Глобальные переменные для чата
let aiChatInstance = null;

/**
 * Демонстрационный режим, сфокусированный на Help Desk
 */
const CATEGORY_RULES = [
    {
        name: 'Доступ и учетные записи (VPN/SSO/почта)',
        keywords: ['vpn', 'доступ', 'пароль', 'логин', 'sso', 'почта', 'email', 'auth', 'аутентификац', 'аккаунт'],
        department: 'IAM/Security',
        autoSteps: 'Авто: сброс сессий SSO, проверка MFA, пересоздание VPN-профиля, отправка инструкции.',
        autoRate: 65,
        reply: 'Проверяю доступ и сбрасываю сессию. Попробуйте переподключиться через 2-3 минуты; уведомлю, если потребуется эскалация.'
    },
    {
        name: 'Корпоративные системы (1С/ERP/CRM)',
        keywords: ['1с', 'erp', 'sap', 'oracle', 'crm', 'битрикс', 'jira', 'confluence', 'бухгалтер', 'sap', 'oracle'],
        department: 'Бизнес-системы',
        autoSteps: 'Авто: проверка статуса сервиса, очистка кеша/сессий, проверка ролей и прав.',
        autoRate: 55,
        reply: 'Фиксирую запрос по системе. Проверяю статус сервиса и ваши права. Сообщу о результате или эскалирую ответственным за приложение.'
    },
    {
        name: 'Телефония и коммуникации',
        keywords: ['телефон', 'звон', 'sip', 'asterisk', 'genesys', 'голос', 'звонки', 'ip-телефон', 'гарнитур'],
        department: 'Телефония/UC',
        autoSteps: 'Авто: проверка регистрации SIP, перезапуск линии, тест входящих/исходящих.',
        autoRate: 50,
        reply: 'Проверяю линию и регистрацию устройства. Если не восстановится за 15 минут, эскалирую в Телефонию.'
    },
    {
        name: 'Рабочее место и оборудование',
        keywords: ['принтер', 'ноутбук', 'камера', 'микрофон', 'монитор', 'usb', 'драйвер', 'wi-fi', 'wifi'],
        department: 'IT Support / Workplace',
        autoSteps: 'Авто: базовая диагностика, обновление драйверов, удаленная проверка статусов.',
        autoRate: 45,
        reply: 'Запускаю удалённую проверку оборудования и драйверов. Дам инструкцию или создам заявку на выезд.'
    },
    {
        name: 'Сеть и подключение',
        keywords: ['сеть', 'network', 'lan', 'wan', 'канал', 'internet', 'интернет', 'ping', 'не пингуется', 'latency'],
        department: 'Network Operations',
        autoSteps: 'Авто: проверка доступности узлов, трассировка, перезапуск DHCP для клиента.',
        autoRate: 52,
        reply: 'Диагностирую сеть и проверяю каналы. Сообщу о статусе или передам в NOC при сохранении сбоя.'
    }
];

function demoMode(message) {
    const insight = analyzeTicket(message);
    const response = [
        `Классификация: ${insight.type} | Категория: ${insight.category} | Приоритет: ${insight.priority}`,
        `Отдел/эскалация: ${insight.department}`,
        `Автоматизация: ${insight.autoResolution}`,
        `Сводка: ${insight.summary}`,
        `Готовый ответ (${insight.languageLabel}): ${insight.readyReply}`,
        `Мониторинг: вероятность авто-решения ~${insight.autoRate}% , SLA 24/7`
    ];

    if (insight.translationNote) {
        response.push(insight.translationNote);
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ text: response.join('\n') });
        }, 200 + Math.random() * 500);
    });
}

function analyzeTicket(message) {
    const lower = message.toLowerCase();
    const langInfo = detectLanguage(message);
    const rule = matchCategoryRule(lower);
    const priority = detectPriority(lower);
    const type = detectType(lower);

    const summary = buildSummary(message, rule);
    const readyReply = buildReadyReply(rule, langInfo.lang, priority, type);
    const autoResolution = rule?.autoSteps || 'Эскалирую в профильный департамент; мониторинг маршрутизации включен.';

    return {
        category: rule?.name || 'Общие запросы',
        department: rule?.department || 'Сервис-деск (ML маршрутизация)',
        priority,
        type,
        summary,
        readyReply,
        autoResolution,
        autoRate: rule?.autoRate || 50,
        languageLabel: langInfo.label,
        translationNote: langInfo.note
    };
}

function matchCategoryRule(lowerMessage) {
    return CATEGORY_RULES.find(rule =>
        rule.keywords.some(keyword => lowerMessage.includes(keyword))
    ) || null;
}

function detectPriority(lowerMessage) {
    if (lowerMessage.includes('не работает') || lowerMessage.includes('критич') || lowerMessage.includes('простой') || lowerMessage.includes('упало') || lowerMessage.includes('недоступ')) {
        return 'P1 (критично)';
    }
    if (lowerMessage.includes('срочно') || lowerMessage.includes('asap') || lowerMessage.includes('сегодня') || lowerMessage.includes('дедлайн') || lowerMessage.includes('не могу работать')) {
        return 'P2 (высокий)';
    }
    if (lowerMessage.includes('нужно') || lowerMessage.includes('добавить') || lowerMessage.includes('доступ') || lowerMessage.includes('хочу')) {
        return 'P3 (нормальный)';
    }
    return 'P4 (плановый)';
}

function detectType(lowerMessage) {
    if (lowerMessage.includes('не работает') || lowerMessage.includes('ошибка') || lowerMessage.includes('fail') || lowerMessage.includes('падает') || lowerMessage.includes('недоступ')) {
        return 'Incident';
    }
    if (lowerMessage.includes('нужен') || lowerMessage.includes('хочу') || lowerMessage.includes('создать') || lowerMessage.includes('добавить') || lowerMessage.includes('выдать') || lowerMessage.includes('запрос')) {
        return 'Service Request';
    }
    return 'Question/Task';
}

function detectLanguage(text) {
    const hasKazakh = /[әіңғүұқөүһ]/i.test(text);
    const hasCyrillic = /[а-яё]/i.test(text);
    const hasLatin = /[a-z]/i.test(text);

    if (hasKazakh) {
        return { lang: 'kk', label: 'kk/ru', note: 'Текст распознан как казахский — при реальном подключении включим автоперевод ru/kk.' };
    }
    if (!hasCyrillic && hasLatin) {
        return { lang: 'en', label: 'en→ru', note: 'Определён английский текст — в продуктиве будет авто-перевод и ответ на двух языках.' };
    }
    return { lang: 'ru', label: 'ru/kk', note: '' };
}

function buildSummary(message, rule) {
    const base = message.length > 200 ? `${message.slice(0, 200)}...` : message;
    return `${base}${rule ? ` (маршрутизировано в ${rule.department})` : ''}`;
}

function buildReadyReply(rule, lang, priority, type) {
    const fallback = 'Принял обращение в работу. Сообщу о результате диагностики или эскалации.';
    const base = `Ваше обращение зарегистрировано. Тип: ${type}, приоритет: ${priority}. `;
    const replyText = rule?.reply || fallback;
    const translationTail = lang === 'kk'
        ? ' Қажет болса, қазақ тіліне жауап дайындаймын.'
        : (lang === 'en' ? ' I will also provide an English summary if needed.' : ' При необходимости подготовлю перевод на казахский.');
    return `${base}${replyText}${translationTail}`;
}

/**
 * Функция для отправки запроса к реальному AI API
 */
async function askAI(message, apiKey, apiUrl) {
    // Если API не настроен, используем улучшенный демо-режим
    if (!apiKey || !apiUrl || apiKey === 'YOUR_API_KEY' || apiUrl === 'https://api.example.com/ai') {
        return demoMode(message);
    }

    // Реальный API вызов
    try {
        let requestBody;
        let headers = {
            'Content-Type': 'application/json'
        };

        if (apiUrl.includes('openai.com')) {
            headers['Authorization'] = `Bearer ${apiKey}`;
            requestBody = {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                max_tokens: 500,
                temperature: 0.3 // Низкая температура для конкретных ответов
            };
        } else if (apiUrl.includes('huggingface.co')) {
            headers['Authorization'] = `Bearer ${apiKey}`;
            requestBody = { inputs: message };
        } else if (apiUrl.includes('anthropic.com')) {
            headers['x-api-key'] = apiKey;
            headers['anthropic-version'] = '2023-06-01';
            requestBody = {
                model: 'claude-3-haiku-20240307',
                max_tokens: 500,
                messages: [{ role: 'user', content: message }]
            };
        } else {
            headers['Authorization'] = `Bearer ${apiKey}`;
            requestBody = {
                prompt: message,
                max_tokens: 500,
                temperature: 0.3
            };
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        let answer = '';
        if (data.choices && data.choices[0]) {
            answer = data.choices[0].message?.content || data.choices[0].text || '';
        } else if (data[0] && data[0].generated_text) {
            answer = data[0].generated_text;
        } else if (data.content && Array.isArray(data.content)) {
            answer = data.content[0].text || '';
        } else if (data.response) {
            answer = data.response;
        } else if (data.text) {
            answer = data.text;
        }
        
        return { text: answer || 'Ответ получен' };
    } catch (error) {
        console.warn('API недоступен, используется демо-режим:', error);
        return demoMode(message);
    }
}

/**
 * Класс для работы с AI чатом
 */
class AIChat {
    constructor(apiKey = null, apiUrl = null) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.init();
    }

    init() {
        this.messagesContainer = document.getElementById('chat-messages');
        this.inputField = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        
        if (!this.messagesContainer || !this.inputField || !this.sendButton) {
            console.error('Элементы чата не найдены!', {
                messages: !!this.messagesContainer,
                input: !!this.inputField,
                button: !!this.sendButton
            });
            return;
        }
        
        this.initializeEventListeners();
        console.log('✅ AI Chat инициализирован успешно');
    }

    initializeEventListeners() {
        const self = this;
        
        this.sendButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.sendMessage();
        };

        this.inputField.onkeypress = function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                self.sendMessage();
            }
        };
        
        console.log('Обработчики событий установлены');
    }

    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) {
            return;
        }

        console.log('📤 Отправка сообщения:', message);

        this.addMessage(message, 'user');
        this.inputField.value = '';
        this.setLoading(true);

        try {
            const response = await askAI(message, this.apiKey, this.apiUrl);
            console.log('📥 Получен ответ:', response);
            this.addMessage(response.text || 'Ответ получен', 'ai');
        } catch (error) {
            console.error('❌ Ошибка:', error);
            this.addMessage('Извините, произошла ошибка. Попробуйте еще раз.', 'ai');
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(text, sender) {
        if (!this.messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        if (sender === 'ai') {
            // Показываем многострочные ответы бота с переносами
            messageDiv.innerHTML = String(text).replace(/\n/g, '<br>');
        } else {
            messageDiv.textContent = text;
        }
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    setLoading(loading) {
        if (!this.sendButton) return;
        
        this.sendButton.disabled = loading;
        if (loading) {
            this.sendButton.innerHTML = '<span class="loading"></span> Отправка...';
        } else {
            this.sendButton.innerHTML = 'Отправить';
        }
    }
}

// Инициализация при загрузке страницы
function initChat() {
    console.log('🚀 Инициализация AI чата...');
    
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    
    if (!chatMessages || !chatInput || !sendButton) {
        console.error('❌ Элементы не найдены!', {
            messages: !!chatMessages,
            input: !!chatInput,
            button: !!sendButton
        });
        setTimeout(initChat, 100);
        return;
    }
    
    // ============================================
    // НАСТРОЙКА AI API
    // ============================================
    // Для подключения реального AI API укажите ваш ключ и URL:
    // 
    // OpenAI API (платный, но качественный):
    // const apiKey = 'sk-ваш-ключ-openai';
    // const apiUrl = 'https://api.openai.com/v1/chat/completions';
    //
    // HuggingFace API (бесплатный, нужна регистрация):
    // const apiKey = 'hf_ваш-токен';
    // const apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
    //
    // Для демо-режима оставьте null (работает без API ключа, дает конкретные ответы)
    const apiKey = null;
    const apiUrl = null;
    
    aiChatInstance = new AIChat(apiKey, apiUrl);
    window.aiChat = aiChatInstance;
    console.log('✅ AI Chat готов к работе!', aiChatInstance);
}

// Запускаем инициализацию
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
} else {
    initChat();
}

// Экспорт для модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIChat, askAI };
}

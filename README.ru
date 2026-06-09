# 🏠 Premium Estate CRM (Русская версия)

> **Версия:** 1.1.0 — Ethereal Luxury Edition  
> **Автор:** [LOSTFlam](https://github.com/LOSTFlam) (Alexander Avdeev)  
> **Стек:** MERN (MongoDB, Express, React 18, Node.js) + Vite

---

## 📝 Изменения в последней версии (Changelog)

### ✨ Новые возможности
- **Детальные атрибуты недвижимости**: добавлены поля "Спальни", "Ванные", "Площадь" (кв. футы) в формы добавления и редактирования объектов.
- **Улучшенная безопасность**:
  - Принудительная проверка владельца (ownership enforcement): обычные пользователи видят только свои объекты.
  - Защита загрузки файлов (фото, туры, документы) — требуется авторизация и проверка прав.
- **Улучшенный сидинг (seed)**:
  - Скрипт `seed-properties.js` переписан: автоматическое создание администратора, если он отсутствует.
  - Использование `bcrypt` для хеширования паролей.
  - Логика upsert (обновление или вставка) для избежания дублей.
- **Новые скрипты**: `seed:properties`, `seed:all`, `dev:open` (запуск с авто-открытием браузера).
- **Надежность БД**: добавлена поддержка `DB_URL_FALLBACK` для обхода проблем с DNS SRV записями MongoDB Atlas.

### 🎨 Визуальные улучшения
- Обновлены стили главной страницы (ModernLandingPage): новые градиенты, тени и отступы.
- Увеличены радиусы скругления (border-radius) элементов в дизайн-системе.
- Улучшены эффекты фона (backdrop-filter).

---

## ✨ Возможности

### 🏠 Управление недвижимостью
- **Каталог объектов** — квартиры, дома, участки, коммерция
- **Детальные атрибуты** — количество спален, ванных, площадь
- **SEO-оптимизация** — публичные страницы с мета-тегами
- **Медиа-галерея** — фото, видео, виртуальные туры, документы
- **Умный поиск** — фильтры по цене, типу, локации, площади
- **Сравнение объектов** — side-by-side сравнение характеристик

### 👥 CRM и лиды
- **Kanban-доска** — визуальное управление воронкой продаж
- **Управление контактами** — полная история взаимодействий
- **Автоматические уведомления** — email + SMS при новых заявках
- **Задачи и встречи** — планирование и отслеживание
- **Счета и котировки** — генерация PDF-документов

### 📊 Аналитика
- **Дашборд в реальном времени** — KPI, графики, метрики
- **Отчёты** — конверсия, источники трафика, доход
- **Экспорт данных** — Excel, CSV, PDF

### 🎨 Премиум UI/UX
- **Ethereal Luxury дизайн** — glassmorphism, золотые акценты
- **Анимации** — 40+ keyframes, Framer Motion transitions
- **Page transitions** — плавные переходы между страницами
- **Command Palette** — навигация через `Cmd+K`
- **Scroll-to-top** — кнопка возврата наверх
- **Тёмная и светлая темы** — с автоопределением системы
- **PWA** — установка на устройство, offline-режим

### 🔔 Уведомления
- **Email** — через Resend (красивые HTML-шаблоны)
- **SMS** — через Twilio или SMSC.ru (mock в разработке)
- **Real-time** — WebSocket для мгновенных обновлений

---

## 🚀 Быстрый старт

### Предварительные требования
- **Node.js** 18+ (рекомендуется 25+)
- **MongoDB** — локальная или MongoDB Atlas
- **npm** или **yarn**

### Установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/LOSTFlam/PremiumEstateCRM.git
cd PremiumEstateCRM

# 2. Установите зависимости сервера
cd server
cp .env.example .env
# Отредактируйте .env — укажите MongoDB URL и Resend API key
# Опционально: добавьте DB_URL_FALLBACK для обхода проблем с SRV
npm install

# 3. Установите зависимости клиента
cd ../client
npm install --legacy-peer-deps

# 4. Создайте MongoDB индексы
cd ../server
npm run seed:index

# 5. Заполните базу тестовыми объектами (создаст админа, если нет)
npm run seed:properties

# 6. Запустите сервер (порт 5001) и клиент (порт 3000)
# Вариант А: Стандартный запуск
npm start # в терминале сервера
npm start # в терминале клиента

# Вариант Б: Одной командой с открытием браузера
npm run dev:open
```

Откройте **http://localhost:3000** — главная страница готова!

---

## 🔒 Безопасность

- **JWT с refresh token** — автоматическое обновление сессии
- **Проверка владельца (Ownership)** — пользователи видят только свои данные
- **Защита загрузок** — авторизация для загрузки фото и документов
- **Rate limiting** — защита от брутфорса и спама
- **Helmet** — HTTP security headers
- **Password validation** — сложность + история паролей
- **Account lockout** — блокировка после failed attempts
- **Input sanitization** — валидация всех входящих данных
- **Audit logging** — логирование критических действий

---

## 📦 Деплой

### Production .env
```env
NODE_ENV=production
DB_URL=mongodb+srv://user:pass@cluster.mongodb.net/PremiumEstateDB
# Опционально: DB_URL_FALLBACK=mongodb://host1:27017,host2:27017/?tls=true
RESEND_API_KEY=re_your_key
EMAIL_FROM=noreply@premiumestatecrm.com
ADMIN_EMAIL=your_email@gmail.com
JWT_SECRET=your-production-secret
JWT_EXPIRES_IN=7d
PORT=5001
CLIENT_URL=https://yourdomain.com
```

### Сборка
```bash
# Клиент
cd client
npm run build

# Сервер
cd server
NODE_ENV=production npm start
```

---

**Сделано с ❤️ от [LOSTFlam](https://github.com/LOSTFlam)**

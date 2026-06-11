# 🏠 Premium Estate CRM

> **Version:** 1.2.0 — Ethereal Luxury Edition  
> **Author:** [LOSTFlam](https://github.com/LOSTFlam) (Alexander Avdeev / Александр Авдеев)  
> **Stack:** MERN (MongoDB, Express, React 18, Node.js) + Vite

<div align="center">

[![Version](https://img.shields.io/badge/version-1.2.0-gold?style=for-the-badge)](https://github.com/LOSTFlam/PremiumEstateCRM/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node.js-25+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-2.8.2-319795?style=for-the-badge&logo=chakraui)](https://chakra-ui.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge)](https://www.framer.com/motion/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

**Премиальная CRM-система для управления недвижимостью с потрясающими визуальными эффектами**

*Premium CRM system for real estate management with stunning visual effects*

</div>

---

## 🆕 What's New (v1.2.0)

### Public storefront
- **Slug-first property URLs** — cards and map links prefer `/property/:slug` (fallback `/offers/:id`)
- **Inline admin editing** — staff can edit listings, photos, and homepage blocks on live public pages
- **Homepage editor** — admin UI for landing hero/features with dark-theme fixes
- **Catalog & detail fixes** — similar properties, correct filter counts, map empty state, i18n prices

### Admin CRM stability
- **API rate limits** — stopped infinite `api/opportunity/` loops; `hasFetched` guards in Redux slices
- **Payments** — `/payments` works for `user` and `superAdmin`; Stripe requires `STRIPE_PRIVATE_KEY` + `PUBLIC_APP_URL`
- **RBAC** — role permissions load on any admin page, not only `/dashboard`
- **List pages** — fixed context menus, empty-list toasts, custom-field selectors on Lead/Contact/Property views
- **Quotes** — invoice section respects access permissions; contacts preload in Quote/Invoice forms

### API & security (v1.1.x baseline retained)
- Guest session endpoint returns `200` instead of `401`; CSP allows OpenStreetMap tiles
- Property numeric fields, ownership checks, `DB_URL_FALLBACK`, seed scripts, visual polish

---

---

## 🌍 Language / Язык

<div align="center">

| [🇬🇧 English](#-table-of-contents) | [🇷🇺 Русский](#-оглавление) |
|---|---|

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📧 Notification Setup](#-notification-setup)
- [🎨 Design System](#-design-system)
- [🔒 Security](#-security)
- [📁 Project Structure](#-project-structure)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [🔧 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🏠 Property Management
- **Property Catalog** — apartments, houses, land plots, commercial
- **Canonical URLs** — SEO-friendly `/property/:slug` pages with legacy ID fallback
- **On-site editing** — admins edit listing fields and photos without leaving the public page
- **Detailed Attributes** — bedrooms, bathrooms, square footage tracking
- **SEO Optimization** — public pages with meta tags
- **Media Gallery** — photos, videos, virtual tours, documents
- **Smart Search** — filters by price, type, location, area
- **Property Comparison** — side-by-side feature comparison

### 👥 CRM & Leads
- **Kanban Board** — visual sales pipeline management
- **Contact Management** — complete interaction history
- **Auto Notifications** — email + SMS on new inquiries
- **Tasks & Meetings** — scheduling and tracking
- **Invoices & Quotes** — PDF document generation

### 📊 Analytics
- **Real-time Dashboard** — KPIs, charts, metrics
- **Reports** — conversion rates, traffic sources, revenue
- **Data Export** — Excel, CSV, PDF

### 🎨 Premium UI/UX
- **Ethereal Luxury Design** — glassmorphism, gold accents, rounded corners
- **Advanced Visual Effects:**
  - 🌫️ **Smoke Effect** — realistic animated smoke particles
  - ✨ **Floating Orbs** — colorful gradient orbs with smooth animations
  - 🌟 **Shimmer Particles** — 40+ animated particles
  - 🎭 **Mouse Glow Effect** — interactive cursor glow
  - 🌊 **Deep Parallax** — multi-layer parallax backgrounds
  - 🎨 **Three.js Background** — 3D animated scenes
- **Animations** — 40+ keyframes, Framer Motion transitions
- **Page Transitions** — smooth page-to-page animations with fade effects
- **Rounded Design** — all elements with 24px-48px border radius
- **Command Palette** — navigation via `Cmd+K` / `Ctrl+K`
- **Scroll-to-top** — smooth return button
- **Dark & Light Themes** — with system auto-detection
- **PWA** — installable on device, offline mode
- **Responsive** — mobile-first design, works on all devices

### 🔔 Notifications
- **Email** — via Resend (beautiful HTML templates)
- **SMS** — via Twilio or SMSC.ru (mock in dev)
- **Real-time** — WebSocket for instant updates

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   PREMIUM ESTATE CRM                    │
│                  Architecture Overview                  │
└─────────────────────────────────────────────────────────┘

                      ┌─────────────┐
                      │   Browser   │
                      └──────┬──────┘
                             │
      ┌───────────────────────────────────────────────────┐
      │                Frontend (React 18)                │
      │ ┌───────────────────────────────────────────────┐ │
      │ │                   UI Layer                    │ │
      │ │    Chakra UI 2.8 · Framer 11 · Tailwind 3     │ │
      │ ├───────────────────────────────────────────────┤ │
      │ │               State Management                │ │
      │ │        Redux Toolkit · React Query v5         │ │
      │ └───────────────────────────────────────────────┘ │
      └─────────────────────────┴─────────────────────────┘
                       │ HTTPS / WebSocket
      ┌───────────────────────────────────────────────────┐
      │                 Backend (Node.js)                 │
      │ ┌───────────────────────────────────────────────┐ │
      │ │             Express + Middlewares             │ │
      │ ├───────────────────────────────────────────────┤ │
      │ │       Helmet · JWT · Rate Limit · RBAC        │ │
      │ ├───────────────────────────────────────────────┤ │
      │ │       Property · Lead · Contact · User        │ │
      │ │           Invoice · Quote · Payment           │ │
      │ ├───────────────────────────────────────────────┤ │
      │ │       Email · SMS · WebSocket · Stripe        │ │
      │ └───────────────────────────────────────────────┘ │
      └─────────────────────────┴─────────────────────────┘
                             │
      ┌───────────────────────────────────────────────────┐
      │                   MongoDB Atlas                   │
      │ ┌───────────────────────────────────────────────┐ │
      │ │                  Collections                  │ │
      │ │     properties · contacts · leads · users     │ │
      │ │     invoices · quotes · tasks · meetings      │ │
      │ └───────────────────────────────────────────────┘ │
      └───────────────────────────────────────────────────┘
```

### Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Frontend** |
| UI Framework | Chakra UI | 2.8.x |
| Animations | Framer Motion | 11.x |
| Build Tool | Vite | 6.x |
| State | Redux Toolkit | + |
| Data Fetching | React Query | v5 |
| Routing | React Router | 6.x |
| **Backend** |
| Runtime | Node.js | 18+ |
| Framework | Express.js | 4.x |
| Database | MongoDB (Mongoose) | 7.x |
| Auth | JWT + Refresh Tokens | + |
| Email | Resend / Nodemailer | + |
| SMS | Twilio | + |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (recommended 25+)
- **MongoDB** — local or MongoDB Atlas
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/LOSTFlam/PremiumEstateCRM.git
cd PremiumEstateCRM

# 2. Install server dependencies
cd server
cp .env.example .env
# Edit .env — set MongoDB URL and Resend API key
# Optional: set DB_URL_FALLBACK for SRV connection issues
npm install

# 3. Install client dependencies
cd ../client
npm install --legacy-peer-deps

# 4. Create MongoDB indexes
cd ../server
npm run seed:index

# 5. Seed sample properties (auto-creates admin if needed)
npm run seed:properties

# 6. Start the server (port 5001) and client (port 3000)
# Option A: Standard start
npm start # in server terminal
npm start # in client terminal

# Option B: One-command start with browser open
npm run dev:open
```

Open **http://localhost:3000** — the landing page is ready!

---

## 📧 Notification Setup

### Email (Resend)
1. Register at [resend.com](https://resend.com)
2. Create an API Key in Dashboard
3. Add to `server/.env`:
```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@premiumestatecrm.com
ADMIN_EMAIL=your_email@gmail.com
```

### SMS (Twilio or SMSC.ru)
```env
# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Or SMSC.ru (for Russia)
SMSC_LOGIN=your_login
SMSC_PASSWORD=your_password
SMSC_SENDER=PremiumEstate
```

Without SMS keys, notifications are logged to the server console (mock mode).

---

## 🎨 Design System

### Color Palette
| Palette | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| **Gold** | #FFFDF5 | #FFF9E6 | #F5E6B8 | #F5D076 | #E8C46B | **#D4AF37** | #B8962E | #9C7D25 | #7A621D | #584715 |
| **Platinum** | #F9FAFB | #F3F4F6 | #E5E7EB | #D1D5DB | #9CA3AF | **#6B7280** | #4B5563 | #374151 | #1F2937 | #111827 |
| **Bronze** | #FFF8F0 | #FFE8CC | #FFD1A3 | #FFB575 | #FF9947 | **#FF7D19** | #E66600 | #B34F00 | #803800 | #4D2100 |

### Premium Components
| Component | Description |
|-----------|-------------|
| **PremiumCard** | Card with 3D parallax, glow, shimmer effects |
| **MagneticButton** | Button with cursor attraction physics |
| **ScrollRevealPro** | 7 scroll-reveal animation directions |
| **CommandPalette** | Global navigation via `Cmd+K` |
| **ParticleUniverse** | Three.js 3D particle background |

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Cmd+K` / `Ctrl+K` | Open Command Palette |
| `Esc` | Close modals |

---

## 🔒 Security

- **JWT with refresh token** — automatic session renewal
- **Ownership enforcement** — users see only their properties (non-admins)
- **Secure uploads** — auth required for photos, tours, and documents
- **Rate limiting** — brute force and spam protection
- **Helmet** — HTTP security headers
- **Password validation** — complexity + password history
- **Account lockout** — after failed attempts
- **Input sanitization** — all incoming data validated
- **Audit logging** — critical actions logged

---

## 📁 Project Structure

```
PremiumEstateCRM/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # PremiumCard, MagneticButton
│   │   │   ├── animations/          # ScrollRevealPro
│   │   │   ├── effects/             # ParticleUniverse
│   │   │   ├── skeletons/           # Loading skeletons
│   │   │   └── ...
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── views/
│   │   │   ├── admin/               # Admin dashboard pages
│   │   │   └── public/              # Public catalog pages
│   │   ├── redux/                   # Redux Toolkit store
│   │   ├── services/                # API client (JS + TS)
│   │   ├── theme/                   # Chakra UI theme
│   │   ├── styles/                  # Premium CSS effects
│   │   ├── types/                   # TypeScript types
│   │   └── utils/                   # Helpers, validators
│   └── public/
│       ├── manifest.json            # PWA manifest
│       └── service-worker.js        # PWA service worker
│
├── server/                          # Node.js Backend
│   ├── controllers/                 # Route handlers
│   ├── model/schema/                # Mongoose models
│   ├── services/
│   │   ├── notificationService.js   # Email + SMS
│   │   ├── websocket.js             # Real-time updates
│   │   └── mediaService.js          # File management
│   ├── middlewares/
│   │   ├── auth.js                  # JWT + refresh tokens
│   │   ├── cache.js                 # Response caching
│   │   ├── auditLog.js              # Activity logging
│   │   └── passwordValidator.js     # Password strength
│   └── scripts/
│       └── createIndexes.js         # MongoDB indexes
│
└── README.md                        # This file
```

---

## 🧪 Testing

```bash
# Server
cd server
npm test              # Run tests
npm run test:watch    # Watch mode

# Client
cd client
npm test              # Run tests
```

---

## 📦 Deployment

### Production .env
```env
NODE_ENV=production
DB_URL=mongodb+srv://user:pass@cluster.mongodb.net/PremiumEstateDB
RESEND_API_KEY=re_your_key
EMAIL_FROM=noreply@premiumestatecrm.com
ADMIN_EMAIL=your_email@gmail.com
JWT_SECRET=your-production-secret
JWT_EXPIRES_IN=7d
PORT=5001
CLIENT_URL=https://yourdomain.com
PUBLIC_APP_URL=https://yourdomain.com

# Payments (Stripe Checkout)
STRIPE_PRIVATE_KEY=sk_live_...
```

### Build
```bash
# Client
cd client
npm run build

# Server
cd server
NODE_ENV=production npm start
```

---

## 🔧 Troubleshooting

See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) (EN) and [docs/TROUBLESHOOTING.ru.md](docs/TROUBLESHOOTING.ru.md) (RU) for payments, 429 rate limits, map tiles, and admin CRM issues.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ by [LOSTFlam](https://github.com/LOSTFlam)**

[![GitHub](https://img.shields.io/badge/GitHub-LOSTFlam-181717?style=for-the-badge&logo=github)](https://github.com/LOSTFlam)

</div>

---

---

# 🇷🇺 Русская версия

## 📋 Оглавление

- [✨ Возможности](#-возможности)
- [🏗️ Архитектура](#️-архитектура-1)
- [🚀 Быстрый старт](#-быстрый-старт)
- [📧 Настройка уведомлений](#-настройка-уведомлений)
- [🎨 Дизайн-система](#-дизайн-система)
- [🔒 Безопасность](#-безопасность)
- [📁 Структура проекта](#-структура-проекта)
- [🧪 Тестирование](#-тестирование)
- [📦 Деплой](#-деплой)
- [🔧 Устранение неполадок](#-устранение-неполадок)
- [🤝 Контрибьюция](#-контрибьюция)
- [📄 Лицензия](#-лицензия)

---

## 🆕 Что нового (v1.2.0)

### Публичная витрина
- **URL по slug** — карточки и карта ведут на `/property/:slug` (запасной вариант `/offers/:id`)
- **Inline-редактирование** — админы правят объекты, фото и блоки главной прямо на сайте
- **Редактор главной** — hero/features в админке, исправлена тёмная тема
- **Каталог и карточка** — похожие объекты, корректный счётчик фильтров, пустая карта, цены с i18n

### Стабильность админ-CRM
- **Лимиты API** — устранены циклы `api/opportunity/`; флаг `hasFetched` в Redux
- **Платежи** — `/payments` для ролей `user` и `superAdmin`; нужны `STRIPE_PRIVATE_KEY` и `PUBLIC_APP_URL`
- **RBAC** — права ролей загружаются на любой странице админки
- **Списки** — исправлены меню ⋯, ложные toast при пустых данных, селекторы кастомных полей
- **Котировки** — блок счетов с учётом прав; предзагрузка контактов в формах Quote/Invoice

### API и безопасность (база v1.1.x сохранена)
- Сессия гостя `200` вместо `401`; CSP для тайлов OpenStreetMap
- Поля недвижимости, ownership, `DB_URL_FALLBACK`, сидинг, визуальный полиш

---

## ✨ Возможности

### 🏠 Управление недвижимостью
- **Каталог объектов** — квартиры, дома, участки, коммерция
- **Канонические URL** — SEO-страницы `/property/:slug` с fallback по ID
- **Редактирование на сайте** — правки полей и фото без выхода из публичной страницы
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

## 🏗️ Архитектура

См. [Architecture](#️-architecture) — схема идентична.

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
# Опционально: DB_URL_FALLBACK для обхода проблем SRV
npm install

# 3. Установите зависимости клиента
cd ../client
npm install --legacy-peer-deps

# 4. Создайте MongoDB индексы
cd ../server
npm run seed:index

# 5. Заполните БД тестовыми объектами (создаст админа, если нет)
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

## 📧 Настройка уведомлений

### Email (Resend)
1. Зарегистрируйтесь на [resend.com](https://resend.com)
2. Создайте API Key в Dashboard
3. Добавьте в `server/.env`:
```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@premiumestatecrm.com
ADMIN_EMAIL=cahek1234500000@gmail.com
```

### SMS (Twilio или SMSC.ru)
```env
# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Или SMSC.ru (для РФ)
SMSC_LOGIN=your_login
SMSC_PASSWORD=your_password
SMSC_SENDER=PremiumEstate
```

Без SMS-ключей уведомления логируются в консоль сервера (mock-режим).

---

## 🎨 Дизайн-система

### Цветовая палитра
| Палитра | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| **Gold** | #FFFDF5 | #FFF9E6 | #F5E6B8 | #F5D076 | #E8C46B | **#D4AF37** | #B8962E | #9C7D25 | #7A621D | #584715 |
| **Platinum** | #F9FAFB | #F3F4F6 | #E5E7EB | #D1D5DB | #9CA3AF | **#6B7280** | #4B5563 | #374151 | #1F2937 | #111827 |
| **Bronze** | #FFF8F0 | #FFE8CC | #FFD1A3 | #FFB575 | #FF9947 | **#FF7D19** | #E66600 | #B34F00 | #803800 | #4D2100 |

### Премиум-компоненты
| Компонент | Описание |
|-----------|----------|
| **PremiumCard** | Карточка с 3D-параллаксом, свечением, shimmer-эффектом |
| **MagneticButton** | Кнопка с физикой притяжения к курсору |
| **ScrollRevealPro** | 7 направлений анимации появления при скролле |
| **CommandPalette** | Глобальная навигация через `Cmd+K` |
| **ParticleUniverse** | Three.js 3D-частицы на фоне |

### Горячие клавиши
| Клавиша | Действие |
|---------|----------|
| `Cmd+K` / `Ctrl+K` | Открыть Command Palette |
| `Esc` | Закрыть модальные окна |

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

## 📁 Структура проекта

См. [Project Structure](#-project-structure) — структура идентична.

---

## 🧪 Тестирование

```bash
# Сервер
cd server
npm test              # Запуск тестов
npm run test:watch    # Watch mode

# Клиент
cd client
npm test              # Запуск тестов
```

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
PUBLIC_APP_URL=https://yourdomain.com

# Платежи (Stripe Checkout)
STRIPE_PRIVATE_KEY=sk_live_...
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

## 🔧 Устранение неполадок

См. [docs/TROUBLESHOOTING.ru.md](docs/TROUBLESHOOTING.ru.md) (RU) и [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) (EN): платежи, 429, карта, админ-CRM.

---

## 🤝 Контрибьюция

1. Fork репозиторий
2. Создайте feature-ветку (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📄 Лицензия

MIT License — см. [LICENSE](LICENSE) для деталей.

---

<div align="center">

**Сделано с ❤️ от [LOSTFlam](https://github.com/LOSTFlam)**

[![GitHub](https://img.shields.io/badge/GitHub-LOSTFlam-181717?style=for-the-badge&logo=github)](https://github.com/LOSTFlam)

</div>

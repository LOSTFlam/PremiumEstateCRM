# 🏠 Premium Estate CRM

A modern, premium real estate management system with advanced property listings, lead management, and analytics.

![Premium Estate CRM](https://img.shields.io/badge/version-0.4.1.26-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-17.0.2-blue)
![Node](https://img.shields.io/badge/Node-14+-green)

---

## 🌍 Language / Язык

<div align="center">

| [🇬🇧 English](#-premium-estate-crm) | [🇷🇺 Русский](#-premium-estate-crm-1) |
|---|---|

</div>

> 💡 **Tip:** Click on the language flag above to jump to that section instantly.

---

## ✨ Features

### 🌐 Public Portal

#### Property Discovery
- **Advanced Search & Filters** - Filter by price, area, bedrooms, bathrooms, location, property type
- **Property Details Page** - Full property information with image gallery, video tours, floor plans
- **Interactive Map** - View properties on map (Google Maps/Mapbox integration ready)
- **Similar Properties** - AI-powered property recommendations

#### User Tools
- **Favorites** - Save properties with PDF export and sharing
- **Compare** - Side-by-side property comparison (up to 3 properties)
- **Lead Capture Forms** - Schedule viewing, request info, make offers
- **Multi-language** - English & Russian support
- **Dark/Light Theme** - Auto-detect system preference

### 👤 User Dashboard
- Saved properties and searches
- Viewing appointments
- Communication history
- Document management

### 🔧 Admin Panel

#### Analytics Dashboard
- **6 Key Metrics** - Views, leads, favorites, comparisons, conversion rate, properties
- **Growth Indicators** - Trend analysis with percentage changes
- **Views by Type** - Property type distribution charts
- **Recent Activity** - Real-time user activity feed
- **Popular Properties** - Top performing listings with conversion rates
- **Export Reports** - PDF export functionality

#### Lead Management
- **Kanban Board** - Visual pipeline with 7 statuses
- **Status Workflow**: New → Contacted → Qualified → Viewing → Offer → Closed/Lost
- **Quick Actions** - Change status, add notes, contact lead
- **Search & Filter** - Find leads by name, email, property, status
- **Communication History** - Track all interactions

#### Property Management
- Add/Edit/Delete properties
- Bulk import/export (CSV, Excel)
- Photo management with drag-and-drop
- Floor plan uploads
- Video tour integration
- Property verification system

#### User Management
- Role-based access control
- User permissions
- Activity logs
- Account management

#### Additional Modules
- **Contacts** - CRM contact management
- **Opportunities** - Deal tracking
- **Invoices & Quotes** - Financial documents
- **Meetings & Tasks** - Schedule management
- **Email Templates** - Pre-built email campaigns
- **Phone Calls** - Call logging
- **Documents** - File management
- **Reports** - Custom report generation
- **Custom Fields** - Flexible data structure

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- MongoDB 4.4+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/LOSTFlam/PremiumEstateCRM.git
cd PremiumEstateCRM

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Configure environment variables
# Server: server/.env
# Client: client/.env

# Start development servers
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm start
```

### Environment Variables

**Server (.env):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/premium-estate
JWT_SECRET=your-secret-key
NODE_ENV=development
```

**Client (.env):**
```env
REACT_APP_API_URL=http://localhost:5001
NODE_ENV=development
```

---

## 📁 Project Structure

```
PremiumEstateCRM/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── property/  # Property-specific components
│   │   │   ├── Modern*.jsx # Landing page components
│   │   │   └── ...
│   │   ├── views/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   ├── public/    # Public pages
│   │   │   └── auth/      # Auth pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── services/      # API services
│   │   ├── theme/         # Chakra UI theme
│   │   └── i18n/          # Translations
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth, validation
│   └── index.js          # Entry point
│
└── README.md
```

---

## 🎨 Design Features

### Premium UI/UX
- **Glassmorphism Effects** - Modern frosted glass design
- **Smooth Animations** - 40+ CSS animations
- **Dark Mode** - System-aware theme switching
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliant

### Visual Effects
- Mouse-following glow effects
- Floating gradient orbs
- Shimmer particles
- Parallax backgrounds
- Card hover animations
- Gradient borders

---

## 📊 Tech Stack

### Frontend
- **React 17** - UI library
- **Chakra UI** - Component library
- **React Router** - Navigation
- **i18next** - Internationalization
- **Redux Toolkit** - State management
- **React Query** - Data fetching
- **Formik** - Form handling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

### DevOps
- **Git** - Version control
- **npm** - Package manager

---

## 🔑 Key Routes

### Public Routes
```
/                    - Homepage
/offers              - Property catalog
/property/:slug      - Property details
/favorites           - Saved properties
/offers/compare      - Compare properties
/auth/sign-in        - Login
/auth/sign-up        - Register
```

### Admin Routes
```
/admin/dashboard     - Admin dashboard
/admin/analytics     - Analytics dashboard
/admin/leads         - Lead management (Kanban)
/admin/properties    - Property management
/admin/users         - User management
/admin/contacts      - Contacts CRM
/admin/opportunities - Opportunities
/admin/invoices      - Invoices
/admin/reports       - Reports
```

---

## 📖 User Guide

### For Property Buyers

1. **Browse Properties**
   - Visit `/offers` to see all listings
   - Use filters to narrow down search
   - Save favorites for later

2. **View Details**
   - Click on any property for full details
   - View photo gallery
   - Check location on map
   - Read property description

3. **Take Action**
   - Schedule a viewing
   - Request more information
   - Make an offer
   - Compare with other properties

### For Real Estate Agents

1. **Manage Properties**
   - Add new listings
   - Upload photos and documents
   - Update property status
   - Track views and leads

2. **Handle Leads**
   - View lead pipeline (Kanban)
   - Update lead status
   - Add notes and follow-ups
   - Schedule viewings

3. **Analyze Performance**
   - Check analytics dashboard
   - View popular properties
   - Track conversion rates
   - Export reports

### For Administrators

1. **User Management**
   - Create/edit users
   - Assign roles
   - Manage permissions
   - Monitor activity

2. **System Configuration**
   - Custom fields
   - Email templates
   - Validation rules
   - Module settings

---

## 🔒 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Input validation
- XSS protection
- CSRF protection
- Rate limiting ready

---

## 📈 Performance

- **60fps** animations
- **Lazy loading** components
- **Code splitting** for faster loads
- **Image optimization**
- **Caching** strategies
- **MongoDB indexing**

---

## 🌍 Languages

Currently supported:
- 🇬🇧 English (EN)
- 🇷🇺 Russian (RU)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Changelog

### Version 0.4.1.26 (Latest) - Accessibility Improvements
**♿ Accessibility Fixes:**
- Fixed all label htmlFor associations (Input, Textarea, Slider, RadioGroup, Checkbox)
- Added id to all form fields in commonForm component
- Fixed date inputs in advanceSearch (From/To fields)
- Fixed customView Input fields (text, tel types)
- Fixed Parking field and all custom property fields
- All label htmlFor now match element id

**🐛 DOM Nesting Fixes:**
- Fixed 14 admin views (Text → Flex in Action columns)
- Fixed: opportunities, property, account, contact
- Fixed: dynamicPage, emailTemplate, invoice, newQuotes
- Fixed: opportunityproject, phoneCall, quotes, task, users, bankDetails

**⚠️ Bug Fixes:**
- Fixed duplicate key warnings (added index to option keys)
- Removed duplicate Flex imports
- Cleaned up all React console warnings
- Fixed select/radio option keys in commonForm and customView

**📊 Impact:**
- Improved form accessibility for screen readers
- Better browser autofill support
- Cleaner console output
- Enhanced user experience

### Version 0.3.1.26
**✨ New Features:**
- Analytics Dashboard with 6 key metrics
- Lead Kanban Board with 7 statuses
- Enhanced Favorites with PDF export
- Improved Compare page
- Dark theme toggle
- Property detail page with gallery
- Advanced search filters
- Lead capture forms

**🐛 Bug Fixes:**
- Fixed React warnings
- Fixed DOM nesting issues
- Fixed memory leaks
- Removed unused code

**⚡ Performance:**
- Optimized animations
- Reduced bundle size
- Improved load times

### Version 0.2.0
- Initial public release
- Basic property management
- User authentication
- CRM modules

---

## 📞 Support

- **Email:** support@premiumestate.com
- **Documentation:** See `/docs` folder
- **Issues:** GitHub Issues

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Author

**LOSTFlam**
- GitHub: [@LOSTFlam](https://github.com/LOSTFlam)
- Project: [Premium Estate CRM](https://github.com/LOSTFlam/PremiumEstateCRM)

---

## 🙏 Acknowledgments

- Chakra UI team for amazing components
- React community for excellent documentation
- All contributors and supporters

---

## 📊 Statistics

- **15+** Core Features
- **40+** Animations
- **6** Admin Modules
- **7** Lead Statuses
- **2** Languages
- **100%** Responsive

---

**Made with ❤️ for Real Estate Professionals**

⭐ Star this repo if you find it helpful!

---

<div align="center">

### 🌍 Выберите язык / Select Language

| [🇬🇧 English (вверху)](#-premium-estate-crm) | [🇷🇺 Русский (ниже)](#-premium-estate-crm-1) |
|---|---|

</div>

---

# 🏠 Premium Estate CRM (Русский)

[⬆️ Вернуться к English version](#-premium-estate-crm)

Современная система управления недвижимостью премиум-класса с расширенными возможностями для агентств и частных брокеров.

![Версия](https://img.shields.io/badge/версия-0.3.2.26-blue)
![Лицензия](https://img.shields.io/badge/лицензия-MIT-green)
![React](https://img.shields.io/badge/React-17.0.2-blue)
![Node](https://img.shields.io/badge/Node-14+-green)

---

## ✨ Возможности

### 🌐 Публичный портал

#### Поиск недвижимости
- **Расширенный поиск и фильтры** - по цене, площади, количеству комнат, типу объекта, локации
- **Страница объекта** - полная информация с галереей, видео-турами, планировками
- **Интерактивная карта** - просмотр объектов на карте (интеграция с Google Maps/Mapbox)
- **Похожие объекты** - AI-рекомендации недвижимости

#### Инструменты пользователя
- **Избранное** - сохранение объектов с экспортом в PDF и публикацией
- **Сравнение** - сравнение до 3 объектов бок о бок
- **Формы захвата лидов** - запись на просмотр, запрос информации, отправка предложения
- **Мультиязычность** - поддержка русского и английского языков
- **Тёмная/светлая тема** - автоопределение системных настроек

### 👤 Личный кабинет пользователя
- Сохранённые объекты и поиски
- Назначенные просмотры
- История коммуникаций
- Управление документами

### 🔧 Панель администратора

#### Аналитика
- **6 ключевых метрик** - просмотры, лиды, избранные, сравнения, конверсия, объекты
- **Индикаторы роста** - анализ трендов с процентными изменениями
- **Просмотры по типам** - диаграмма распределения по типам недвижимости
- **Последняя активность** - лента действий пользователей в реальном времени
- **Популярные объекты** - топ объектов с показателями конверсии
- **Экспорт отчётов** - выгрузка в PDF

#### Управление лидами
- **Канбан-доска** - визуальная воронка с 7 статусами
- **Статусы**: Новый → Связались → Квалифицирован → Просмотр → Предложение → Закрыт/Потерян
- **Быстрые действия** - смена статуса, добавление заметок, контакт с лидом
- **Поиск и фильтрация** - поиск по имени, email, объекту, статусу
- **История коммуникаций** - отслеживание всех взаимодействий

#### Управление объектами
- Добавление/редактирование/удаление объектов
- Массовый импорт/экспорт (CSV, Excel)
- Управление фото с drag-and-drop
- Загрузка планировок
- Интеграция видео-туров
- Система верификации объектов

#### Управление пользователями
- Ролевая модель доступа
- Права пользователей
- Журналы активности
- Управление аккаунтами

#### Дополнительные модули
- **Контакты** - CRM-управление контактами
- **Возможности** - отслеживание сделок
- **Счета и предложения** - финансовые документы
- **Встречи и задачи** - управление расписанием
- **Шаблоны писем** - готовые email-кампании
- **Звонки** - логирование звонков
- **Документы** - управление файлами
- **Отчёты** - генерация пользовательских отчётов
- **Пользовательские поля** - гибкая структура данных

---

## 🚀 Быстрый старт

### Требования
- Node.js 14+
- MongoDB 4.4+
- npm или yarn

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/LOSTFlam/PremiumEstateCRM.git
cd PremiumEstateCRM

# Установить зависимости сервера
cd server
npm install

# Установить зависимости клиента
cd ../client
npm install

# Настроить переменные окружения
# Сервер: server/.env
# Клиент: client/.env

# Запустить серверы разработки
# Терминал 1 - Сервер
cd server
npm start

# Терминал 2 - Клиент
cd client
npm start
```

### Переменные окружения

**Сервер (.env):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/premium-estate
JWT_SECRET=your-secret-key
NODE_ENV=development
```

**Клиент (.env):**
```env
REACT_APP_API_URL=http://localhost:5001
NODE_ENV=development
```

---

## 📁 Структура проекта

```
PremiumEstateCRM/
├── client/                 # React фронтенд
│   ├── public/            # Статические файлы
│   ├── src/
│   │   ├── components/    # Переиспользуемые компоненты
│   │   │   ├── property/  # Компоненты объектов
│   │   │   ├── Modern*.jsx # Компоненты лендинга
│   │   │   └── ...
│   │   ├── views/         # Страницы
│   │   │   ├── admin/     # Админ-панель
│   │   │   ├── public/    # Публичные страницы
│   │   │   └── auth/      # Страницы авторизации
│   │   ├── hooks/         # Кастомные React-хуки
│   │   ├── utils/         # Утилиты
│   │   ├── services/      # API-сервисы
│   │   ├── theme/         # Тема Chakra UI
│   │   └── i18n/          # Переводы
│   └── package.json
│
├── server/                # Node.js бэкенд
│   ├── controllers/       # Контроллеры маршрутов
│   ├── models/           # MongoDB схемы
│   ├── routes/           # API маршруты
│   ├── middlewares/      # Аутентификация, валидация
│   └── index.js          # Точка входа
│
└── README.md
```

---

## 🎨 Дизайн

### Премиум UI/UX
- **Глассморфизм** - современный дизайн с эффектом матового стекла
- **Плавные анимации** - 40+ CSS анимаций
- **Тёмная тема** - переключение с учётом системных настроек
- **Адаптивный дизайн** - mobile-first подход
- **Доступность** - соответствие WCAG 2.1

### Визуальные эффекты
- Свечение, следующее за курсором
- Плавающие градиентные орбы
- Мерцающие частицы
- Параллакс фоны
- Анимации при наведении на карточки
- Градиентные границы

---

## 📊 Технологический стек

### Фронтенд
- **React 17** - UI библиотека
- **Chakra UI** - библиотека компонентов
- **React Router** - навигация
- **i18next** - интернационализация
- **Redux Toolkit** - управление состоянием
- **React Query** - загрузка данных
- **Formik** - работа с формами

### Бэкенд
- **Node.js** - среда выполнения
- **Express** - веб-фреймворк
- **MongoDB** - база данных
- **Mongoose** - ODM
- **JWT** - аутентификация
- **Bcrypt** - хеширование паролей
- **Multer** - загрузка файлов

### DevOps
- **Git** - контроль версий
- **npm** - менеджер пакетов

---

## 🔑 Основные маршруты

### Публичные маршруты
```
/                    - Главная страница
/offers              - Каталог недвижимости
/property/:slug      - Страница объекта
/favorites           - Избранное
/offers/compare      - Сравнение объектов
/auth/sign-in        - Вход
/auth/sign-up        - Регистрация
```

### Админ-маршруты
```
/admin/dashboard     - Панель администратора
/admin/analytics     - Аналитика
/admin/leads         - Управление лидами (Канбан)
/admin/properties    - Управление объектами
/admin/users         - Управление пользователями
/admin/contacts      - Контакты CRM
/admin/opportunities - Возможности
/admin/invoices      - Счета
/admin/reports       - Отчёты
```

---

## 📖 Руководство пользователя

### Для покупателей недвижимости

1. **Просмотр объектов**
   - Посетите `/offers` для просмотра всех объектов
   - Используйте фильтры для уточнения поиска
   - Сохраняйте понравившиеся объекты

2. **Просмотр деталей**
   - Нажмите на объект для полной информации
   - Просмотрите фотогалерею
   - Проверьте расположение на карте
   - Прочитайте описание объекта

3. **Действия**
   - Запишитесь на просмотр
   - Запросите дополнительную информацию
   - Сделайте предложение
   - Сравните с другими объектами

### Для риелторов

1. **Управление объектами**
   - Добавляйте новые объекты
   - Загружайте фото и документы
   - Обновляйте статус объекта
   - Отслеживайте просмотры и лиды

2. **Работа с лидами**
   - Просматривайте воронку лидов (Канбан)
   - Обновляйте статус лида
   - Добавляйте заметки и напоминания
   - Планируйте просмотры

3. **Анализ эффективности**
   - Проверяйте панель аналитики
   - Просматривайте популярные объекты
   - Отслеживайте конверсию
   - Экспортируйте отчёты

### Для администраторов

1. **Управление пользователями**
   - Создание/редактирование пользователей
   - Назначение ролей
   - Управление правами доступа
   - Мониторинг активности

2. **Настройка системы**
   - Пользовательские поля
   - Шаблоны писем
   - Правила валидации
   - Настройки модулей

---

## 🔒 Безопасность

- JWT аутентификация
- Хеширование паролей (bcrypt)
- Ролевой контроль доступа
- Валидация входных данных
- Защита от XSS
- Защита от CSRF
- Готовность к rate limiting

---

## 📈 Производительность

- **60fps** анимации
- **Ленивая загрузка** компонентов
- **Разделение кода** для ускорения загрузки
- **Оптимизация изображений**
- **Стратегии кэширования**
- **Индексация MongoDB**

---

## 🌍 Языки

Поддерживаемые языки:
- 🇬🇧 Английский (EN)
- 🇷🇺 Русский (RU)

---

## 🤝 Вклад в проект

1. Создайте форк репозитория
2. Создайте ветку (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add AmazingFeature'`)
4. Отправьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📝 Журнал изменений

### Версия 0.4.1.26 (Текущая) - Улучшения доступности
**♿ Исправления доступности:**
- Исправлены все label htmlFor ассоциации (Input, Textarea, Slider, RadioGroup, Checkbox)
- Добавлен id ко всем полям форм в commonForm
- Исправлены поля дат в advanceSearch (From/To)
- Исправлены Input поля в customView (text, tel типы)
- Исправлено поле Parking и все пользовательские поля объектов
- Все label htmlFor теперь соответствуют element id

**🐛 Исправления DOM Nesting:**
- Исправлено 14 admin views (Text → Flex в Action колонках)
- Исправлено: opportunities, property, account, contact
- Исправлено: dynamicPage, emailTemplate, invoice, newQuotes
- Исправлено: opportunityproject, phoneCall, quotes, task, users, bankDetails

**⚠️ Исправления ошибок:**
- Исправлены предупреждения о дублирующихся ключах (добавлен индекс к option keys)
- Удалены дублирующиеся импорты Flex
- Очищены все предупреждения React в консоли
- Исправлены ключи select/radio опций в commonForm и customView

**📊 Влияние:**
- Улучшена доступность форм для скринридеров
- Лучшая поддержка автозаполнения браузера
- Чище вывод консоли
- Улучшен пользовательский опыт

### Версия 0.3.2.26
**✨ Новые функции:**
- Маршруты и фильтры витрины (Storefront Routes & Filters)
- Расширенная главная страница с сегментами каталога
- Живые сигналы витрины (статистика в реальном времени)
- Высокоинтентные маршруты (быстрый доступ к популярным сценариям)
- Улучшенная система верификации объектов
- Подборки объектов (кураторские коллекции)
- Локационные сигналы на витрине
- Расширенные фильтры каталога (статус проверки, подборки)
- Улучшенные переводы всех интерфейсных элементов

**🐛 Исправления:**
- Улучшена обработка статусов объектов
- Оптимизирована работа с изображениями
- Улучшена читаемость текстов на русском языке
- Исправлены мелкие UI проблемы

**⚡ Производительность:**
- Оптимизирована загрузка данных витрины
- Улучшена работа с большими каталогами
- Снижено количество повторных рендеров

### Версия 0.3.1.26
**✨ Новые функции:**
- Панель аналитики с 6 ключевыми метриками
- Канбан-доска для лидов с 7 статусами
- Улучшенная страница избранного с экспортом в PDF
- Улучшенная страница сравнения
- Переключатель тёмной темы
- Страница деталей объекта с галереей
- Расширенные фильтры поиска
- Формы захвата лидов

**🐛 Исправления:**
- Исправлены предупреждения React
- Исправлены проблемы с вложенностью DOM
- Исправлены утечки памяти
- Удалён неиспользуемый код

**⚡ Производительность:**
- Оптимизированы анимации
- Уменьшен размер бандла
- Улучшено время загрузки

### Версия 0.2.0
- Первый публичный релиз
- Базовое управление объектами
- Аутентификация пользователей
- CRM модули

---

## 📞 Поддержка

- **Email:** support@premiumestate.com
- **Документация:** смотрите папку `/docs`
- **Issues:** GitHub Issues

---

## 📄 Лицензия

Этот проект лицензирован под лицензией MIT - смотрите файл LICENSE для деталей.

---

## 👨‍💻 Автор

**LOSTFlam**
- GitHub: [@LOSTFlam](https://github.com/LOSTFlam)
- Проект: [Premium Estate CRM](https://github.com/LOSTFlam/PremiumEstateCRM)

---

## 🙏 Благодарности

- Команда Chakra UI за потрясающие компоненты
- React сообщество за отличную документацию
- Все контрибьюторы и поддерживающие

---

## 📊 Статистика

- **15+** основных функций
- **40+** анимаций
- **6** админ-модулей
- **7** статусов лидов
- **2** языка
- **100%** адаптивность

---

**Сделано с ❤️ для профессионалов рынка недвижимости**

⭐ Добавьте звезду репозиторию, если он оказался полезным!

---

<div align="center">

### 🌍 Выберите язык / Select Language

| [🇬🇧 English (вверху)](#-premium-estate-crm) | [🇷🇺 Русский (выше)](#-premium-estate-crm-1) |
|---|---|

[⬆️ Вернуться к началу](#-premium-estate-crm)

</div>

# 🏗️ Руководство по Установке

Быстрое руководство по установке Premium Estate CRM - от клонирования до запуска за считанные минуты!

---

## 📋 Требования

Перед началом убедитесь, что у вас установлено следующее:

| Программное обеспечение | Версия | Ссылка |
|----------|---------|----------|
| **Node.js** | 14.x или выше | [nodejs.org](https://nodejs.org/) |
| **MongoDB** | 4.4.x или выше | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git** | Последняя | [git-scm.com](https://git-scm.com/) |
| **npm** | 6.x или выше | Поставляется с Node.js |

### Проверка Установки

```bash
node --version    # Должно показать v14.x или выше
npm --version     # Должно показать 6.x или выше
mongod --version  # Должно показать 4.4.x или выше
git --version     # Должно показать 2.x или выше
```

---

## 🚀 Быстрый Старт (5 минут)

### Шаг 1: Клонирование Репозитория

```bash
git clone https://github.com/LOSTFlam/PremiumEstateCRM.git
cd PremiumEstateCRM
```

### Шаг 2: Установка Зависимостей

```bash
# Установить все зависимости (сервер + клиент) одной командой
npm run install-all
```

Это установит:
- Корневые зависимости
- Зависимости клиента (`/client`)
- Зависимости сервера (`/server`)

### Шаг 3: Настройка Переменных Окружения

#### Конфигурация Сервера

```bash
# Перейти в директорию сервера
cd server

# Скопировать пример файла окружения
cp .env.example .env

# Отредактировать .env с вашими настройками (опционально - значения по умолчанию работают для локальной разработки)
nano .env
```

**Сервер .env по умолчанию (работает сразу):**
```env
PORT=5001
NODE_ENV=development
DB_URL=mongodb://127.0.0.1:27017
DB=PremiumEstateDB
JWT_SECRET=ваш-секретный-jwt-ключ-измените-в-продакшене
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:3000
DEFAULT_USERS=admin@gmail.com,user@gmail.com
```

#### Конфигурация Клиента

```bash
# Перейти в директорию клиента
cd ../client

# Скопировать пример файла окружения
cp .env.example .env
```

**Клиент .env по умолчанию (работает сразу):**
```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_NODE_ENV=development
GENERATE_SOURCEMAP=false
```

### Шаг 4: Запуск MongoDB

**Linux (systemd):**
```bash
sudo systemctl start mongod
```

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
# Запустить от имени Администратора
net start MongoDB
```

**Или вручную:**
```bash
mongod --dbpath /data/db
```

### Шаг 5: Запуск Приложения

#### Вариант A: Запуск Обоих Серверов (Рекомендуется)

Из корневой директории:
```bash
npm run dev
```

Это запустит оба:
- Сервер на http://localhost:5001
- Клиент на http://localhost:3000

#### Вариант B: Запуск По Отдельности

**Терминал 1 - Сервер:**
```bash
cd server
npm start
```

**Терминал 2 - Клиент:**
```bash
cd client
npm start
```

### Шаг 6: Открыть в Браузере

Перейдите на: **http://localhost:3000**

---

## 👤 Учетные Данные для Входа по Умолчанию

После настройки вы можете войти с этими учетными данными:

### Аккаунт Администратора
- **Email:** `admin@gmail.com`
- **Пароль:** `admin123`
- **Роль:** Администратор

### Аккаунт Пользователя
- **Email:** `user@gmail.com`
- **Пароль:** `user123`
- **Роль:** Пользователь

---

## 📁 Структура Проекта

```
PremiumEstateCRM/
├── client/                 # React Фронтенд
│   ├── public/            # Статические ресурсы
│   ├── src/
│   │   ├── components/    # Переиспользуемые компоненты
│   │   ├── views/         # Компоненты страниц
│   │   ├── hooks/         # Кастомные хуки
│   │   ├── utils/         # Утилиты
│   │   ├── services/      # API сервисы
│   │   ├── theme/         # Тема Chakra UI
│   │   └── i18n/          # Переводы
│   ├── .env.example       # Шаблон окружения клиента
│   └── package.json
│
├── server/                # Node.js Бэкенд
│   ├── controllers/       # Контроллеры маршрутов
│   ├── models/           # MongoDB схемы
│   ├── routes/           # API маршруты
│   ├── middlewares/      # Аутентификация и валидация
│   ├── .env.example      # Шаблон окружения сервера
│   └── package.json
│
├── .github/              # Конфигурации GitHub
│   ├── ISSUE_TEMPLATE/   # Шаблоны задач
│   ├── workflows/        # CI/CD пайплайны
│   └── PULL_REQUEST_TEMPLATE.md
├── CODE_OF_CONDUCT.md    # Руководство сообщества
├── CONTRIBUTING.md       # Руководство по внесению вклада
├── LICENSE              # Лицензия MIT
├── SECURITY.md          # Политика безопасности
└── README.md            # Основная документация
```

---

## 🔧 Распространенные Проблемы при Установке

### Проблема: Ошибка Подключения к MongoDB

**Ошибка:** `MongoServerError: connect ECONNREFUSED`

**Решение:**
```bash
# Проверить, запущен ли MongoDB
sudo systemctl status mongod    # Linux
brew services list              # macOS

# Запустить MongoDB
sudo systemctl start mongod     # Linux
brew services start mongodb-community  # macOS
```

### Проблема: Порт Уже Используется

**Ошибка:** `EADDRINUSE: address already in use`

**Решение:**
```bash
# Найти процесс, использующий порт
lsof -i :5001    # Порт сервера
lsof -i :3000    # Порт клиента

# Убить процесс
kill -9 <PID>
```

### Проблема: Ошибки Node Modules

**Ошибка:** `Cannot find module`

**Решение:**
```bash
# Очистить и переустановить
rm -rf node_modules client/node_modules server/node_modules
rm -rf package-lock.json client/package-lock.json server/package-lock.json
npm run install-all
```

### Проблема: Ошибки Сборки React

**Ошибка:** Различные ошибки сборки

**Решение:**
```bash
# Очистить кэш
cd client
npm cache clean --force
rm -rf node_modules/.cache
npm install

# Попробовать снова
npm start
```

### Проблема: Ошибки Разрешений (Linux/macOS)

**Ошибка:** `EACCES: permission denied`

**Решение:**
```bash
# Исправить разрешения npm
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

---

## 🧪 Тестирование

### Запустить Тесты Сервера
```bash
cd server
npm test
```

### Запустить Тесты Клиента
```bash
cd client
npm test
```

### Запустить Линтинг
```bash
cd server
npm run lint

cd ../client
npm run lint
```

---

## 📦 Сборка для Продакшена

### Сборка Клиента
```bash
cd client
npm run build
```

Артефакты сборки будут в `client/build/`.

### Запуск Продакшен Сервера
```bash
cd server
NODE_ENV=production npm start
```

---

## 🔄 Обновление

Для обновления локальной копии:

```bash
# Получить последние изменения
git pull origin main

# Установить новые зависимости
npm run install-all

# Перезапустить серверы
npm run dev
```

---

## 🛠️ Советы по Разработке

### Горячая Перезагрузка

И сервер, и клиент поддерживают горячую перезагрузку:
- **Сервер:** Использует nodemon - автоматический перезапуск при изменениях файлов
- **Клиент:** React Fast Refresh - автоматическое обновление браузера

### Отладка

**Сервер:**
```bash
# С отладкой
cd server
node --inspect index.js
```

Затем откройте `chrome://inspect` в Chrome.

**Клиент:**
- Откройте DevTools (F12)
- Используйте расширение React DevTools
- Проверьте вкладки Console и Network

### Управление Базой Данных

**Подключение к MongoDB:**
```bash
mongosh
use PremiumEstateDB
```

**Полезные Команды:**
```javascript
// Показать все коллекции
show collections

// Подсчитать документы
db.properties.countDocuments()
db.users.countDocuments()

// Найти всех пользователей
db.users.find()

// Удалить базу данных (осторожно!)
db.dropDatabase()
```

---

## 📚 Следующие Шаги

После настройки:

1. ✅ **Исследуйте приложение** - Просмотрите функции
2. 📖 **Прочитайте документацию** - [README.ru.md](README.ru.md)
3. 🤝 **Руководство по внесению вклада** - [CONTRIBUTING.ru.md](CONTRIBUTING.ru.md)
4. 📋 **Кодекс поведения** - [CODE_OF_CONDUCT.ru.md](CODE_OF_CONDUCT.ru.md)
5. 🔒 **Политика безопасности** - [SECURITY.ru.md](SECURITY.ru.md)

---

## 🆘 Получение Помощи

Если вы столкнулись с проблемами:

1. **Проверьте это руководство** - Раздел распространенных проблем
2. **Поиск задач** - [GitHub Issues](https://github.com/LOSTFlam/PremiumEstateCRM/issues)
3. **Создайте задачу** - Используйте [шаблон задачи](.github/ISSUE_TEMPLATE/bug_report.md)
4. **Присоединяйтесь к обсуждениям** - [GitHub Discussions](https://github.com/LOSTFlam/PremiumEstateCRM/discussions)
5. **Email поддержка** - support@premiumestate.com

---

## ✅ Контрольный Список Установки

Используйте этот контрольный список, чтобы убедиться, что все настроено правильно:

- [ ] Node.js 14+ установлен
- [ ] MongoDB 4.4+ установлен и запущен
- [ ] Git установлен
- [ ] Репозиторий склонирован
- [ ] Зависимости установлены (`npm run install-all`)
- [ ] `.env` сервера создан (скопирован из `.env.example`)
- [ ] `.env` клиента создан (скопирован из `.env.example`)
- [ ] MongoDB запущен
- [ ] Сервер запускается без ошибок (порт 5001)
- [ ] Клиент запускается без ошибок (порт 3000)
- [ ] Можно получить доступ к http://localhost:3000
- [ ] Можно войти с учетными данными по умолчанию
- [ ] Можно перемещаться по приложению

---

**Приятной разработки! 🚀**

Для получения дополнительной информации см. [README.ru.md](README.ru.md) и [CONTRIBUTING.ru.md](CONTRIBUTING.ru.md).

---

*Последнее Обновление: 1 апреля 2026*
*Версия: 1.0.0*

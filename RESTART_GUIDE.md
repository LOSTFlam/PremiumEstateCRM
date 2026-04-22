# 🔄 Инструкция по перезапуску приложения

## Проблема
После модернизации главная страница не загружается на http://localhost:3000

## Решение

### 1. Остановите все процессы
```bash
# Найдите и убейте все процессы на портах 3000 и 5001
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

### 2. Очистите кэш и пересоберите
```bash
cd /home/lostflam/Downloads/PremiumEstateCRM-main

# Очистите build
rm -rf client/build client/.react-router

# Пересоберите
npm run build
```

### 3. Запустите приложение
```bash
# Запустите dev сервер
npm run dev

# Или запустите отдельно:
npm run dev:client    # В одном терминале
npm run dev:server    # В другом терминале
```

### 4. Откройте в браузере
```
http://localhost:3000/
```

## Ожидаемый результат

На главной странице должны быть:
- ✅ Карточки домов с фотографиями
- ✅ Описания объектов
- ✅ Фильтры поиска
- ✅ Смена языка (RU/EN)
- ✅ Контактная информация
- ✅ Кнопки навигации

## Основные маршруты

```
/                    - Главная страница (ModernLandingPage)
/catalog             - Каталог объектов
/offers              - Все предложения
/property/:slug      - Детали объекта
/favorites           - Избранное
/compare             - Сравнение
/auth/sign-in        - Вход
/auth/sign-up        - Регистрация
/admin/*             - Админ панель (требует авторизации)
```

## Если проблема остается

1. Проверьте консоль браузера (F12) на ошибки
2. Проверьте логи сервера в терминале
3. Убедитесь, что MongoDB запущена
4. Проверьте файл .env

## Переменные окружения

### client/.env
```env
VITE_API_PROXY_TARGET=http://127.0.0.1:5001
```

### server/.env
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/premium-estate
JWT_SECRET=your-secret-key
```

## Проверка статуса

```bash
# Проверить что порты свободны
lsof -i:3000
lsof -i:5001

# Проверить что MongoDB работает
mongosh --eval "db.version()"

# Проверить что build успешен
ls -lh client/build/client/index.html
```

## Контакты для помощи

Если ничего не помогает, проверьте:
- STATUS.md - итоговый статус модернизации
- QUICK_START.md - быстрый старт
- MODERNIZATION_COMPLETE.md - полный отчет

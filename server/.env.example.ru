# Конфигурация Сервера

# Порт Сервера
PORT=5001
NODE_ENV=development

# Конфигурация Базы Данных
DB_URL=mongodb://127.0.0.1:27017
DB=PremiumEstateDB

# JWT Конфигурация
JWT_SECRET=ваш-секретный-jwt-ключ-измените-в-продакшене
JWT_EXPIRES_IN=1d

# URL Клиента для CORS
CLIENT_URL=http://localhost:3000

# Пользователи по Умолчанию (через запятую)
DEFAULT_USERS=admin@gmail.com,user@gmail.com

# Конфигурация Email (для будущего использования)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ваш-email@gmail.com
EMAIL_PASS=пароль-приложения

# Конфигурация Загрузки Файлов
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Логирование
LOG_LEVEL=debug

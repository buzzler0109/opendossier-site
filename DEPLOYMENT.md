# OpenDossier Deployment Guide

## Серверная авторизация с JWT токенами

### 1. Установка зависимостей

```bash
# Установка Node.js зависимостей
npm install

# Или с yarn
yarn install
```

### 2. Настройка переменных окружения

```bash
# Скопируйте .env.example в .env
cp .env.example .env

# Отредактируйте .env файл
nano .env
```

**Важно!** Измените в `.env`:
- `JWT_SECRET` - на случайную строку (минимум 32 символа)
- `ADMIN_PASSWORD` - на сложный пароль
- `FRONTEND_URL` - на ваш домен

### 3. Запуск сервера

#### Для разработки:
```bash
npm run dev
```

#### Для продакшена:
```bash
npm start
```

### 4. Настройка Nginx (продакшен)

```nginx
server {
    listen 443 ssl http2;
    server_name opendossier.pro www.opendossier.pro;
    
    # Статические файлы
    location / {
        root /var/www/opendossier.pro;
        index index.html;
        try_files $uri $uri/ =404;
    }
    
    # API проксирование
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # n8n workflows
    location /n8n/ {
        proxy_pass http://127.0.0.1:5679/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/opendossier.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/opendossier.pro/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

### 5. Настройка PM2 (для автозапуска)

```bash
# Установка PM2
npm install -g pm2

# Создание ecosystem файла
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'opendossier-api',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Запуск с PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Обновление API URL в фронтенде

В файлах `admin.html` и `user-guide.html` измените:

```javascript
// Было:
const API_BASE_URL = 'http://localhost:3001/api';

// Стало:
const API_BASE_URL = 'https://opendossier.pro/api';
```

### 7. Безопасность

#### Обязательно:
- ✅ Используйте HTTPS
- ✅ Смените JWT_SECRET на случайную строку
- ✅ Установите сложный ADMIN_PASSWORD
- ✅ Настройте firewall (только порты 80, 443)
- ✅ Регулярно обновляйте зависимости

#### Рекомендуется:
- 🔒 Используйте базу данных вместо хардкода
- 🔒 Добавьте логирование
- 🔒 Настройте мониторинг
- 🔒 Используйте reverse proxy (Nginx)
- 🔒 Настройте backup

### 8. Тестирование

```bash
# Проверка API
curl https://opendossier.pro/api/health

# Тест входа
curl -X POST https://opendossier.pro/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### 9. Мониторинг

```bash
# Логи PM2
pm2 logs opendossier-api

# Статус
pm2 status

# Перезапуск
pm2 restart opendossier-api
```

## Структура проекта

```
opendossier-site/
├── server.js              # Backend сервер
├── package.json           # Node.js зависимости
├── .env                   # Переменные окружения
├── ecosystem.config.js    # PM2 конфигурация
├── index.html             # Главная страница
├── admin.html             # Админ панель
├── user-guide.html        # Пользовательский гайд
├── styles.css             # Стили
├── script.js              # JavaScript
└── DEPLOYMENT.md          # Эта инструкция
```

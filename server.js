const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://opendossier.pro',
    credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.'
});
app.use('/api/auth', limiter);

// Admin credentials (в реальном проекте - в базе данных)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: process.env.ADMIN_PASSWORD || 'opendossier2024',
    email: 'admin@opendossier.pro'
};

// JWT Secret (в реальном проекте - в переменных окружения)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Проверка статуса сервера
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Вход в админ панель
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Проверка учетных данных
        if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'Неверное имя пользователя или пароль'
            });
        }

        // Создание JWT токена
        const token = jwt.sign(
            { 
                username: ADMIN_CREDENTIALS.username,
                email: ADMIN_CREDENTIALS.email,
                role: 'admin'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                username: ADMIN_CREDENTIALS.username,
                email: ADMIN_CREDENTIALS.email,
                role: 'admin'
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Проверка токена
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({
        valid: true,
        user: req.user
    });
});

// Выход (на клиенте просто удаляем токен)
app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

// Защищенные админ роуты
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
    res.json({
        message: 'Welcome to admin dashboard',
        user: req.user,
        data: {
            totalUsers: 150,
            activeSessions: 23,
            systemStatus: 'operational'
        }
    });
});

// Отправка админ формы
// Отправка админ формы (адаптировано для вызова AWS Lambda/API)
app.post('/api/admin/submit', authenticateToken, async (req, res) => {
    const { email } = req.body;
    
    try {
        const axios = require('axios');  // Импорт axios
        
        // Вызов вашего AWS API для generate_invite
        const apiResponse = await axios.post(
            'https://il5n5g70r7.execute-api.eu-central-1.amazonaws.com/prod/generate-invite',  // Ваш API URL
            { action: 'generate_invite', email: email },
            { headers: { 'Content-Type': 'application/json' } }  // Optional: Добавьте x-api-key если нужно
        );
        
        if (apiResponse.data.status === 'Invite sent') {
            console.log('Admin email submission:', {
                email,
                timestamp: new Date().toISOString(),
                adminUser: req.user.username
            });
            res.json({
                success: true,
                message: 'Email sent successfully',
                requestId: Date.now().toString()
            });
        } else {
            throw new Error('AWS API error');
        }
    } catch (error) {
        console.error('Error sending invite:', error);
        res.status(500).json({ error: 'Error sending invite' });
    }
});

// Отправка пользовательской формы
app.post('/api/support/submit', (req, res) => {
    const { userName, userEmail, userType, issueType, description } = req.body;
    
    // Здесь можно добавить сохранение в базу данных
    console.log('Support form submission:', {
        userName,
        userEmail,
        userType,
        issueType,
        description,
        timestamp: new Date().toISOString()
    });

    res.json({
        success: true,
        message: 'Support request submitted successfully',
        ticketId: 'TICKET-' + Date.now().toString()
    });
});

// Add route to save data.json
app.post('/api/save-data-json', (req, res) => {
    try {
        const { dataJson, userId } = req.body;
        
        if (!dataJson || !userId) {
            return res.status(400).json({ error: 'Missing dataJson or userId' });
        }
        
        // Save data.json to root directory
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, 'data.json');
        
        fs.writeFileSync(filePath, dataJson);
        
        console.log(`data.json saved for user: ${userId}`);
        res.json({ success: true, message: 'data.json saved successfully' });
        
    } catch (error) {
        console.error('Error saving data.json:', error);
        res.status(500).json({ error: 'Failed to save data.json' });
    }
});

// Статические файлы (для разработки)
app.use(express.static('.'));

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

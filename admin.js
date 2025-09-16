// API Configuration
const API_BASE_URL = 'https://opendossier.pro/api';

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
        verifyToken(token);
    } else {
        showLoginForm();
    }
});

// Проверка токена на сервере
async function verifyToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.valid) {
                showAdminPanel();
                return;
            }
        }
        
        // Токен недействителен
        localStorage.removeItem('adminToken');
        showLoginForm();
        
    } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
        showLoginForm();
    }
}

// Обработчик формы входа
document.getElementById('loginFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = 'admin'; // Можно добавить поле username
    const password = document.getElementById('adminPassword').value;
    
    // Проверка на пустой пароль
    if (!password.trim()) {
        showError('Please enter a password.', 'Password Required');
        return;
    }
    
    // Показать индикатор загрузки
    const submitBtn = document.querySelector('#loginFormElement button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            localStorage.setItem('adminToken', data.token);
            showAdminPanel();
            showSuccess('Login successful! Welcome to admin panel.', 'Login Success');
        } else {
            showError('Invalid password. Please check your credentials and try again.', 'Login Failed');
            document.getElementById('adminPassword').value = '';
        }
        
    } catch (error) {
        console.error('Login error:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Server is not running. Please start the backend server first.', 'Server Error');
        } else {
            showError('Connection error. Please try again later.', 'Network Error');
        }
    } finally {
        // Восстановить кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Обработчик кнопки выхода
document.getElementById('logoutBtn').addEventListener('click', async function() {
    try {
        const token = localStorage.getItem('adminToken');
        if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('adminToken');
        showLoginForm();
    }
});

// Показать форму входа
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

// Показать админ панель
function showAdminPanel() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

// Обработчик админ формы
document.getElementById('adminForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/admin/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showSuccess(`Email sent successfully! Request ID: ${result.requestId}`, 'Email Sent');
            this.reset();
        } else {
            showError('Failed to send email. Please try again later.', 'Send Error');
        }
        
    } catch (error) {
        console.error('Email sending error:', error);
        showError('Connection error. Please try again later.', 'Network Error');
    }
});

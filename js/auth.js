// Проверяем авторизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupAuthForms();
});

function setupAuthForms() {
    // Переключение между формами
    document.getElementById('show-login')?.addEventListener('click', function(e) {
        e.preventDefault();
        toggleForms(true);
    });
    
    document.getElementById('show-register')?.addEventListener('click', function(e) {
        e.preventDefault();
        toggleForms(false);
    });
    
    // Обработка формы регистрации
    document.getElementById('register-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        registerUser();
    });
    
    // Обработка формы входа
    document.getElementById('login-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        loginUser();
    });
    
    // Кнопка выхода
    document.getElementById('logout-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        logoutUser();
    });
}

function toggleForms(showLogin) {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const formTitle = document.getElementById('form-title');
    
    if (showLogin) {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        formTitle.textContent = 'Вход в аккаунт';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        formTitle.textContent = 'Создать аккаунт';
    }
}

function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }
    
    const user = {
        name: name,
        email: email,
        password: password
    };
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.email === email)) {
        alert('Пользователь с таким email уже зарегистрирован!');
        return;
    }
    
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    alert('Регистрация прошла успешно!');
    checkAuthStatus();
    window.location.href = 'site.html';
}

function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Вход выполнен успешно!');
        checkAuthStatus();
        window.location.href = 'site.html';
    } else {
        alert('Неверный email или пароль!');
    }
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    checkAuthStatus();
    window.location.reload();
}

function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authSection = document.getElementById('auth-section');
    
    if (!authSection) return;
    
    if (currentUser) {
        authSection.querySelector('.auth-links').style.display = 'none';
        authSection.querySelector('.logged-in').style.display = 'block';
        document.getElementById('username-display').textContent = currentUser.name;
        document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    } else {
        authSection.querySelector('.auth-links').style.display = 'block';
        authSection.querySelector('.logged-in').style.display = 'none';
    }
}

// Делаем функцию доступной для других страниц
window.checkAuthStatus = checkAuthStatus;

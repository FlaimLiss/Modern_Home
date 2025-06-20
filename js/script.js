
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${name} добавлен в корзину`);
}

// Удаление товара из корзины
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Изменение количества товара
function updateQuantity(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }
}

// Отображение товаров в корзине
function renderCartItems() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        cartTotalEl.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="images/${productImages[item.id]}.jpg" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease">-</button>
                    <input type="number" value="${item.quantity}" min="1">
                    <button class="increase">+</button>
                </div>
                <div class="cart-item-remove">&times;</div>
            </div>
        `;
    });
    
    cartItemsEl.innerHTML = html;
    cartTotalEl.textContent = total.toLocaleString();
    
    // Добавление обработчиков событий
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.closest('.cart-item').dataset.id);
            removeFromCart(id);
        });
    });
    
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.nextElementSibling;
            const newQuantity = parseInt(input.value) - 1;
            input.value = newQuantity;
            const id = parseInt(btn.closest('.cart-item').dataset.id);
            updateQuantity(id, newQuantity);
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const newQuantity = parseInt(input.value) + 1;
            input.value = newQuantity;
            const id = parseInt(btn.closest('.cart-item').dataset.id);
            updateQuantity(id, newQuantity);
        });
    });
    
    document.querySelectorAll('.cart-item-quantity input').forEach(input => {
        input.addEventListener('change', () => {
            const newQuantity = parseInt(input.value) || 1;
            input.value = newQuantity;
            const id = parseInt(input.closest('.cart-item').dataset.id);
            updateQuantity(id, newQuantity);
        });
    });
}

// Уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Фильтрация товаров
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const price = document.getElementById('price-filter').value;
    
    document.querySelectorAll('.product-card').forEach(card => {
        const cardCategory = card.dataset.category;
        const cardPrice = parseInt(card.dataset.price);
        
        let categoryMatch = category === 'all' || cardCategory === category;
        let priceMatch = true;
        
        if (price !== 'all') {
            const [min, max] = price.split('-').map(Number);
            if (price.endsWith('+')) {
                priceMatch = cardPrice >= min;
            } else {
                priceMatch = cardPrice >= min && cardPrice <= max;
            }
        }
        
        card.style.display = categoryMatch && priceMatch ? 'block' : 'none';
    });
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('Ваша корзина пуста');
        return;
    }
    
    showNotification('Заказ оформлен! Спасибо за покупку!');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Обработчики для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            addToCart(id, name, price);
        });
    });
    
    // Обработчики для фильтров
    if (document.getElementById('category-filter')) {
        document.getElementById('category-filter').addEventListener('change', filterProducts);
        document.getElementById('price-filter').addEventListener('change', filterProducts);
    }
    
    // Обработчик для корзины
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
    
    // Обработчик для оформления заказа
    if (document.getElementById('checkout-btn')) {
        document.getElementById('checkout-btn').addEventListener('click', checkout);
    }
    
    // Обработчик для формы регистрации
    if (document.getElementById('register-form')) {
        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                showNotification('Пароли не совпадают');
                return;
            }
            
            showNotification('Регистрация успешна!');
            this.reset();
        });
    }
});

// Плавная прокрутка для всех ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

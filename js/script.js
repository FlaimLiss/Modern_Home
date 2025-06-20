// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Обновление счетчика корзины
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Добавление товара в корзину
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} добавлен в корзину`);
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
    
    if (!cartItemsEl) return;
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        if (cartTotalEl) cartTotalEl.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image_url}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">${item.price.toLocaleString()} ₽</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="number" value="${item.quantity}" min="1">
                    <button class="quantity-btn increase">+</button>
                </div>
                <button class="cart-item-remove">&times;</button>
            </div>
        `;
    });
    
    cartItemsEl.innerHTML = html;
    if (cartTotalEl) cartTotalEl.textContent = total.toLocaleString();
    
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

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Обработчики для кнопок "В корзину" в каталоге
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: parseInt(productCard.dataset.id),
                name: productCard.querySelector('.product-name').textContent,
                price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
                image_url: productCard.querySelector('.product-image').src
            };
            addToCart(product);
        });
    });
    
    // Обработчик для оформления заказа
    if (document.getElementById('checkout-btn')) {
        document.getElementById('checkout-btn').addEventListener('click', checkout);
    }
    
    // Рендер корзины если на странице корзины
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
});

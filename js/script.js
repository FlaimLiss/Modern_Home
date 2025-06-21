// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Объект соответствия ID товаров и их изображений
const productImages = {
    1: 'sofa1',
    2: 'chair1',
    3: 'table1',
    4: 'bed1',
    5: 'sofa2',
    6: 'chair2',
    7: 'table2'
};

// Обновление счетчика корзины
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Добавление товара в корзину
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
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
 // Получаем актуальную корзину
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        cartTotalElement.textContent = '0';
        return;
    }
    
    let total = 0;
    let itemsHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} ₽ × ${item.quantity}</p>
                </div>
                <div class="cart-item-total">
                    <p>${itemTotal} ₽</p>
                    <button class="btn remove-btn" data-id="${item.id}">Удалить</button>
                </div>
            </div>
        `;
    });
    
    cartItemsElement.innerHTML = itemsHTML;
    cartTotalElement.textContent = total;
    
   // Обработчик для кнопок удаления (делегирование событий)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
        const id = e.target.getAttribute('data-id');
        removeFromCart(id);
        displayCartItems(); // Перерисовываем корзину
    }
    });
)
// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    // Обработчик для кнопки оформления заказа
    document.getElementById('checkout-btn').addEventListener('click', function() {
        alert('Заказ оформлен!');
        localStorage.removeItem('cart');
        displayCartItems();
        updateCartCount();
    });
});
// Функция для удаления товара из корзины
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Обновляем счетчик в шапке сайта
    return cart; // Возвращаем обновленную корзину
}

// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', displayCartItems);

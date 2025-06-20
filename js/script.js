// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Объект соответствия ID товаров и их изображений (с расширениями)
const productImages = {
    1: 'sofa1.jpg',
    2: 'chair1.jpg',
    3: 'table1.jpg',
    4: 'bed1.jpg',
    5: 'sofa2.jpg',
    6: 'chair2.jpg',
    7: 'table2.jpg'
};

// Обновление счетчика корзины
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Добавление товара в корзину
function addToCart(id, name, price, quantity = 1) {
    // Проверяем, есть ли уже такой товар в корзине
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex >= 0) {
        // Если товар уже есть - увеличиваем количество
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Если нет - добавляем новый товар
        cart.push({ 
            id: parseInt(id), 
            name: name.toString(), 
            price: parseFloat(price), 
            quantity: parseInt(quantity) 
        });
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем интерфейс
    updateCartCount();
    
    // Если мы на странице корзины - обновляем список товаров
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
    
    // Показываем уведомление
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
        item.quantity = Math.max(1, parseInt(newQuantity));
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }
}

// Отображение товаров в корзине
function renderCartItems() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    
    if (!cartItemsEl || !cartTotalEl) return;
    
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
                <img src="images/${productImages[item.id]}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('ru-RU')} ₽</div>
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
    cartTotalEl.textContent = total.toLocaleString('ru-RU');
    
    // Добавляем обработчики событий
    setupCartEventHandlers();
}

// Настройка обработчиков событий для корзины
function setupCartEventHandlers() {
    // Удаление товара
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.closest('.cart-item').dataset.id);
            removeFromCart(id);
        });
    });
    
    // Уменьшение количества
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = btn.nextElementSibling;
            const newQuantity = parseInt(input.value) - 1;
            input.value = newQuantity;
            const id = parseInt(btn.closest('.cart-item').dataset.id);
            updateQuantity(id, newQuantity);
        });
    });
    
    // Увеличение количества
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = btn.previousElementSibling;
            const newQuantity = parseInt(input.value) + 1;
            input.value = newQuantity;
            const id = parseInt(btn.closest('.cart-item').dataset.id);
            updateQuantity(id, newQuantity);
        });
    });
    
    // Ручное изменение количества
    document.querySelectorAll('.cart-item-quantity input').forEach(input => {
        input.addEventListener('change', (e) => {
            e.stopPropagation();
            const newQuantity = parseInt(input.value) || 1;
            input.value = newQuantity;
            const id = parseInt(input.closest('.cart-item').dataset.id);
            updateQuantity(id, newQuantity);
        });
    });
}

// Остальные функции (showNotification, filterProducts, checkout) остаются без изменений

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Всегда обновляем счетчик корзины
    updateCartCount();
    
    // Если есть кнопки "В корзину" - добавляем обработчики
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            
            if (id && name && price) {
                addToCart(id, name, price);
            }
        });
    });
    
    // Если мы на странице корзины - рендерим товары
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
    
    // Обработчик для оформления заказа
    if (document.getElementById('checkout-btn')) {
        document.getElementById('checkout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            checkout();
        });
    }
    
    // Остальные обработчики...
});

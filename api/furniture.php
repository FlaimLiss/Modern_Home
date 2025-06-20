<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            handleGetRequest();
            break;
            
        case 'POST':
            handlePostRequest();
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// Обработка GET-запросов (получение данных с фильтрацией)
function handleGetRequest() {
    global $pdo;
    
    // Базовый запрос
    $sql = "SELECT * FROM furniture WHERE 1=1";
    $params = [];
    
    // Фильтр по категории (если указан)
    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $sql .= " AND category = ?";
        $params[] = $_GET['category'];
    }
    
    // Фильтр по минимальной цене (если указан)
    if (isset($_GET['min_price']) && is_numeric($_GET['min_price'])) {
        $sql .= " AND price >= ?";
        $params[] = (float)$_GET['min_price'];
    }
    
    // Фильтр по максимальной цене (если указан)
    if (isset($_GET['max_price']) && is_numeric($_GET['max_price'])) {
        $sql .= " AND price <= ?";
        $params[] = (float)$_GET['max_price'];
    }
    
    // Сортировка по умолчанию - по дате добавления (новые сначала)
    $sql .= " ORDER BY created_at DESC";
    
    // Подготовка и выполнение запроса
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $furniture = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($furniture);
}

// Обработка POST-запросов (добавление новых товаров)
function handlePostRequest() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO furniture 
                              (name, category, price, description, image_url, dimensions, material) 
                              VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['category'],
            $data['price'],
            $data['description'],
            $data['image_url'],
            $data['dimensions'],
            $data['material']
        ]);
        
        echo json_encode([
            'message' => 'Мебель успешно добавлена', 
            'id' => $pdo->lastInsertId()
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
?>

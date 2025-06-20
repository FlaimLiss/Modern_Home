<?php
header('Content-Type: application/json');
require_once 'config.php';

// Получение всего каталога мебели
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM furniture ORDER BY created_at DESC");
        $furniture = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($furniture);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Добавление новой мебели (для админки)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
        
        echo json_encode(['message' => 'Мебель успешно добавлена', 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>

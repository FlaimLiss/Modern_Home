	<?php
header('Content-Type: application/json');
require_once 'config.php';

// Получение всего каталога мебели
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM furniture");
        $furniture = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($furniture);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Другие методы (POST, PUT, DELETE) для админки можно добавить позже
?>

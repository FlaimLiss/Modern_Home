<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetRequest();
        break;
    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}

function handleGetRequest() {
    global $conn;
    
    $id = $_GET['id'] ?? null;
    $category = $_GET['category'] ?? null;
    $limit = $_GET['limit'] ?? null;

    if ($id) {
        $stmt = $conn->prepare("SELECT * FROM furniture WHERE id = ?");
        $stmt->bind_param("i", $id);
    } elseif ($category) {
        $stmt = $conn->prepare("SELECT * FROM furniture WHERE category = ?");
        $stmt->bind_param("s", $category);
    } else {
        $sql = "SELECT * FROM furniture";
        if ($limit) $sql .= " LIMIT " . (int)$limit;
        $stmt = $conn->prepare($sql);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $response = [];
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }
    
    echo json_encode($response);
}
?>

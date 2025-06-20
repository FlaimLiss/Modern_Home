<?php
require_once 'config.php';

function getAllFurniture() {
    global $conn;
    $sql = "SELECT * FROM furniture";
    $result = $conn->query($sql);
    
    $furniture = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $furniture[] = $row;
        }
    }
    return $furniture;
}

function getFurnitureById($id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM furniture WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}
?>

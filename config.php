<?php
$host = "sqlXXX.epizy.com"; // замените на ваш хост от InfinityFree
$username = "epiz_XXXXXX"; // ваше имя пользователя БД
$password = "your_password"; // ваш пароль БД
$dbname = "epiz_XXXXXX_modern_home_db"; // имя вашей БД

// Создание соединения
$conn = new mysqli($host, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

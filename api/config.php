<?php
$host = "sql307.infinityfree.com"; // замените на ваш хост
$dbname = "if0_39282404_modern_home_db"; // замените на имя вашей БД
$username = "if0_39282404"; // замените на вашего пользователя
$password = "Wer_615243_A"; // замените на ваш пароль

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}
?>

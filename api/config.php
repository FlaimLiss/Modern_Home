<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "sql307.infinityfree.com";
$username = "if0_39282404";
$password = "Wer_615243_A";
$dbname = "if0_39282404_modern_home_db";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>

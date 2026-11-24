<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/Database.php";

if (
    $_SERVER["REQUEST_METHOD"] !== "POST" &&
    $_SERVER["REQUEST_METHOD"] !== "DELETE"
) {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST or DELETE requests are allowed."
    ]);

    exit;
}

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$table_id = $data["table_id"] ?? null;

if (!$table_id || !is_numeric($table_id)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Table ID is required."
    ]);

    exit;
}

try {

    $database = new Database();
    $db = $database->connect();

    // =========================================
    // CHECK TABLE
    // =========================================

    $checkQuery = $db->prepare("
        SELECT
            table_id,
            table_number
        FROM restaurant_tables
        WHERE table_id = ?
        LIMIT 1
    ");

    $checkQuery->execute([
        (int)$table_id
    ]);

    $table = $checkQuery->fetch(PDO::FETCH_ASSOC);

    if (!$table) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Table not found."
        ]);

        exit;
    }

    // =========================================
    // CHECK EXISTING RESERVATIONS
    // =========================================

    $reservationQuery = $db->prepare("
        SELECT reservation_id
        FROM reservations
        WHERE table_id = ?
        AND status IN ('Pending', 'Confirmed')
        LIMIT 1
    ");

    $reservationQuery->execute([
        (int)$table_id
    ]);

    if ($reservationQuery->fetch()) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" =>
                "This table cannot be deleted because it has an active reservation."
        ]);

        exit;
    }

    // =========================================
    // DELETE TABLE
    // =========================================

    $deleteQuery = $db->prepare("
        DELETE FROM restaurant_tables
        WHERE table_id = ?
    ");

    $deleteQuery->execute([
        (int)$table_id
    ]);

    echo json_encode([
        "success" => true,
        "message" =>
            "Table " . $table["table_number"] . " deleted successfully."
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete table.",
        "error" => $e->getMessage()
    ]);
}
?>
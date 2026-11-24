<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);

    exit;
}

require_once "../../config/Database.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!$data) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data."
    ]);

    exit;
}

$customer_id = $data["customer_id"] ?? null;

if (!$customer_id || !is_numeric($customer_id)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Customer ID is required."
    ]);

    exit;
}

$customer_id = (int) $customer_id;

try {

    $database = new Database();
    $db = $database->connect();

    // =========================================
    // CHECK CUSTOMER
    // =========================================

    $checkCustomer = $db->prepare("
        SELECT
            customer_id,
            full_name
        FROM customers
        WHERE customer_id = ?
        LIMIT 1
    ");

    $checkCustomer->execute([
        $customer_id
    ]);

    $customer = $checkCustomer->fetch(
        PDO::FETCH_ASSOC
    );

    if (!$customer) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Customer not found."
        ]);

        exit;
    }

    // =========================================
    // CHECK RESERVATIONS
    // =========================================

    $checkReservations = $db->prepare("
        SELECT COUNT(*)
        FROM reservations
        WHERE customer_id = ?
    ");

    $checkReservations->execute([
        $customer_id
    ]);

    $reservationCount =
        (int) $checkReservations->fetchColumn();

    // =========================================
    // PREVENT DELETE IF HAS RESERVATIONS
    // =========================================

    if ($reservationCount > 0) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" =>
                "This customer cannot be deleted because they have existing reservations."
        ]);

        exit;
    }

    // =========================================
    // DELETE CUSTOMER
    // =========================================

    $deleteCustomer = $db->prepare("
        DELETE FROM customers
        WHERE customer_id = ?
    ");

    $deleteCustomer->execute([
        $customer_id
    ]);

    if ($deleteCustomer->rowCount() === 0) {

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Customer could not be deleted."
        ]);

        exit;
    }

    // =========================================
    // SUCCESS
    // =========================================

    echo json_encode([
        "success" => true,
        "message" => "Customer deleted successfully.",
        "customer_id" => $customer_id
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage()
    ]);
}

?>
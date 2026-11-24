<?php

// =========================================
// CORS
// =========================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");


// =========================================
// HANDLE OPTIONS
// =========================================

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}


// =========================================
// DATABASE
// =========================================

require_once "../../config/Database.php";


// =========================================
// ONLY POST
// =========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);

    exit;
}


// =========================================
// GET JSON DATA
// =========================================

$input = json_decode(
    file_get_contents("php://input"),
    true
);


// =========================================
// VALIDATE RESERVATION ID
// =========================================

if (
    !isset($input["reservation_id"]) ||
    !is_numeric($input["reservation_id"])
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Reservation ID is required."
    ]);

    exit;
}


$reservationId = (int) $input["reservation_id"];


// =========================================
// DATABASE CONNECTION
// =========================================

try {

    $database = new Database();

    $db = $database->connect();


    // =====================================
    // CHECK RESERVATION
    // =====================================

    $checkQuery = "
        SELECT
            reservation_id,
            status
        FROM reservations
        WHERE reservation_id = :reservation_id
        LIMIT 1
    ";

    $checkStmt = $db->prepare($checkQuery);

    $checkStmt->bindValue(
        ":reservation_id",
        $reservationId,
        PDO::PARAM_INT
    );

    $checkStmt->execute();

    $reservation = $checkStmt->fetch(
        PDO::FETCH_ASSOC
    );


    // =====================================
    // NOT FOUND
    // =====================================

    if (!$reservation) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Reservation not found."
        ]);

        exit;
    }


    // =====================================
    // ALREADY CANCELLED
    // =====================================

    if (
        strtolower(
            trim($reservation["status"])
        ) === "cancelled"
    ) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "This reservation is already cancelled."
        ]);

        exit;
    }


    // =====================================
    // COMPLETED RESERVATION
    // =====================================

    if (
        strtolower(
            trim($reservation["status"])
        ) === "completed"
    ) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "A completed reservation cannot be cancelled."
        ]);

        exit;
    }


    // =====================================
    // CANCEL RESERVATION
    // =====================================

    $updateQuery = "
        UPDATE reservations
        SET status = 'Cancelled'
        WHERE reservation_id = :reservation_id
    ";

    $updateStmt = $db->prepare($updateQuery);

    $updateStmt->bindValue(
        ":reservation_id",
        $reservationId,
        PDO::PARAM_INT
    );

    $updateStmt->execute();


    // =====================================
    // SUCCESS
    // =====================================

    echo json_encode([
        "success" => true,
        "message" => "Reservation cancelled successfully.",
        "reservation_id" => $reservationId
    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage()
    ]);

}
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Content-Type: application/json");


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);
    exit;

}


if (
    $_SERVER["REQUEST_METHOD"] !== "POST" &&
    $_SERVER["REQUEST_METHOD"] !== "PUT"
) {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only PUT or POST requests are allowed."
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


// =========================================
// GET DATA
// =========================================

$table_id =
    $data["table_id"] ?? null;

$table_number =
    trim($data["table_number"] ?? "");

$capacity =
    $data["capacity"] ?? null;

$location =
    trim($data["location"] ?? "");

$status =
    trim($data["status"] ?? "Available");


// =========================================
// REQUIRED FIELDS
// =========================================

if (
    !$table_id ||
    $table_number === "" ||
    $capacity === null ||
    $location === ""
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" =>
            "Please complete all required table fields."
    ]);

    exit;

}


// =========================================
// VALIDATE CAPACITY
// =========================================

if (
    !is_numeric($capacity) ||
    (int)$capacity < 1
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" =>
            "Table capacity must be at least 1."
    ]);

    exit;

}


$capacity = (int)$capacity;


// =========================================
// VALID STATUS
// =========================================

$allowedStatuses = [
    "Available",
    "Reserved",
    "Occupied",
    "Maintenance",
    "Inactive"
];


if (
    !in_array(
        $status,
        $allowedStatuses,
        true
    )
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid table status."
    ]);

    exit;

}


try {

    $database = new Database();
    $db = $database->connect();


    // =========================================
    // CHECK TABLE EXISTS
    // =========================================

    $checkTable = $db->prepare("

        SELECT table_id

        FROM restaurant_tables

        WHERE table_id = ?

        LIMIT 1

    ");


    $checkTable->execute([
        $table_id
    ]);


    if (!$checkTable->fetch()) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Table not found."
        ]);

        exit;

    }


    // =========================================
    // CHECK DUPLICATE TABLE NUMBER
    // =========================================

    $duplicateQuery = $db->prepare("

        SELECT table_id

        FROM restaurant_tables

        WHERE table_number = ?

        AND table_id != ?

        LIMIT 1

    ");


    $duplicateQuery->execute([
        $table_number,
        $table_id
    ]);


    if ($duplicateQuery->fetch()) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" =>
                "Table number already exists."
        ]);

        exit;

    }


    // =========================================
    // UPDATE
    // =========================================

    $updateQuery = $db->prepare("

        UPDATE restaurant_tables

        SET

            table_number = ?,

            capacity = ?,

            location = ?,

            status = ?

        WHERE table_id = ?

    ");


    $updateQuery->execute([

        $table_number,

        $capacity,

        $location,

        $status,

        $table_id

    ]);


    echo json_encode([
        "success" => true,
        "message" =>
            "Restaurant table updated successfully."
    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" =>
            "Failed to update restaurant table.",
        "error" =>
            $e->getMessage()
    ]);

}

?>
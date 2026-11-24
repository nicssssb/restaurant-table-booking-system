<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require_once "../../config/Database.php";

// =========================================
// HANDLE OPTIONS
// =========================================

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);
    exit;

}

// =========================================
// ONLY POST ALLOWED
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
// DATABASE CONNECTION
// =========================================

try {

    $database = new Database();
    $db = $database->connect();

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed.",
        "error" => $e->getMessage()
    ]);

    exit;

}


// =========================================
// GET JSON DATA
// =========================================

$data = json_decode(
    file_get_contents("php://input"),
    true
);


if (!is_array($data)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data."
    ]);

    exit;

}


// =========================================
// GET CUSTOMER DATA
// =========================================

$full_name =
    trim($data["full_name"] ?? "");

$contact_number =
    trim($data["contact_number"] ?? "");

$email =
    trim($data["email"] ?? "");

$address =
    trim($data["address"] ?? "");


// =========================================
// REQUIRED FIELDS
// =========================================

if ($full_name === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Full name is required."
    ]);

    exit;

}


if ($contact_number === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Contact number is required."
    ]);

    exit;

}


// =========================================
// VALIDATE EMAIL
// =========================================

if (
    $email !== "" &&
    !filter_var($email, FILTER_VALIDATE_EMAIL)
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid email address."
    ]);

    exit;

}


// =========================================
// CHECK DUPLICATE EMAIL
// =========================================

if ($email !== "") {

    $emailQuery = $db->prepare("
        SELECT customer_id
        FROM customers
        WHERE email = ?
        LIMIT 1
    ");

    $emailQuery->execute([
        $email
    ]);

    if ($emailQuery->fetch()) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "A customer with this email already exists."
        ]);

        exit;

    }

}


// =========================================
// CHECK DUPLICATE CONTACT
// =========================================

$contactQuery = $db->prepare("
    SELECT customer_id
    FROM customers
    WHERE contact_number = ?
    LIMIT 1
");

$contactQuery->execute([
    $contact_number
]);


if ($contactQuery->fetch()) {

    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "A customer with this contact number already exists."
    ]);

    exit;

}


// =========================================
// INSERT CUSTOMER
// =========================================

try {

    $db->beginTransaction();


    $insertQuery = $db->prepare("
        INSERT INTO customers (
            full_name,
            contact_number,
            email,
            address
        )
        VALUES (
            ?,
            ?,
            ?,
            ?
        )
    ");


    $insertQuery->execute([

        $full_name,

        $contact_number,

        $email !== ""
            ? $email
            : null,

        $address !== ""
            ? $address
            : null

    ]);


    $customer_id =
        $db->lastInsertId();


    $db->commit();


    // =========================================
    // SUCCESS RESPONSE
    // =========================================

    http_response_code(201);

    echo json_encode([

        "success" => true,

        "message" =>
            "Customer added successfully.",

        "customer_id" =>
            (int) $customer_id

    ]);


} catch (PDOException $e) {

    if ($db->inTransaction()) {

        $db->rollBack();

    }


    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to add customer.",

        "error" =>
            $e->getMessage()

    ]);

}

?>
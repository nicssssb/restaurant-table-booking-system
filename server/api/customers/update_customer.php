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

$customer_id =
    $data["customer_id"] ?? null;

$full_name =
    trim($data["full_name"] ?? "");

$contact_number =
    trim($data["contact_number"] ?? "");

$email =
    trim($data["email"] ?? "");

$address =
    trim($data["address"] ?? "");


// =========================================
// VALIDATE ID
// =========================================

if (
    !$customer_id ||
    !is_numeric($customer_id)
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Customer ID is required."
    ]);

    exit;

}


$customer_id = (int) $customer_id;


// =========================================
// REQUIRED FIELDS
// =========================================

if (!$full_name) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Full name is required."
    ]);

    exit;

}


if (!$contact_number) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Contact number is required."
    ]);

    exit;

}


if (!$address) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Address is required."
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


try {

    $database = new Database();

    $db = $database->connect();


    // =====================================
    // CHECK CUSTOMER
    // =====================================

    $checkCustomer = $db->prepare("

        SELECT customer_id

        FROM customers

        WHERE customer_id = ?

        LIMIT 1

    ");


    $checkCustomer->execute([
        $customer_id
    ]);


    if (!$checkCustomer->fetch()) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Customer not found."
        ]);

        exit;

    }


    // =====================================
    // CHECK DUPLICATE EMAIL
    // =====================================

    if ($email !== "") {

        $emailCheck = $db->prepare("

            SELECT customer_id

            FROM customers

            WHERE email = ?

            AND customer_id != ?

            LIMIT 1

        ");


        $emailCheck->execute([
            $email,
            $customer_id
        ]);


        if ($emailCheck->fetch()) {

            http_response_code(409);

            echo json_encode([
                "success" => false,
                "message" => "Email address is already used by another customer."
            ]);

            exit;

        }

    }


    // =====================================
    // UPDATE CUSTOMER
    // =====================================

    $updateQuery = $db->prepare("

        UPDATE customers

        SET
            full_name = ?,
            contact_number = ?,
            email = ?,
            address = ?

        WHERE customer_id = ?

    ");


    $updateQuery->execute([

        $full_name,

        $contact_number,

        $email !== "" ? $email : null,

        $address,

        $customer_id

    ]);


    echo json_encode([

        "success" => true,

        "message" =>
            "Customer information updated successfully."

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to update customer.",

        "error" =>
            $e->getMessage()

    ]);

}

?>
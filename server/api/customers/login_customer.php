<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/Database.php";

try {

    $database = new Database();
    $db = $database->connect();

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $email = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";


    // =========================================
    // VALIDATION
    // =========================================

    if (empty($email) || empty($password)) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Please enter your email and password."
        ]);

        exit;
    }


    // =========================================
    // FIND CUSTOMER
    // =========================================

    $query = "
        SELECT
            customer_id,
            full_name,
            contact_number,
            email,
            password,
            address
        FROM customers
        WHERE email = :email
        LIMIT 1
    ";

    $stmt = $db->prepare($query);

    $stmt->execute([
        ":email" => $email
    ]);

    $customer = $stmt->fetch(PDO::FETCH_ASSOC);


    // =========================================
    // CUSTOMER NOT FOUND
    // =========================================

    if (!$customer) {

        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password."
        ]);

        exit;
    }


    // =========================================
    // VERIFY PASSWORD
    // =========================================

    if (!password_verify($password, $customer["password"])) {

        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password."
        ]);

        exit;
    }


    // =========================================
    // REMOVE PASSWORD
    // =========================================

    unset($customer["password"]);


    // =========================================
    // SUCCESS
    // =========================================

    echo json_encode([
        "success" => true,
        "message" => "Login successful.",
        "user" => [
            "id" => $customer["customer_id"],
            "name" => $customer["full_name"],
            "contact_number" => $customer["contact_number"],
            "email" => $customer["email"],
            "address" => $customer["address"],
            "role" => "customer"
        ]
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage()
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "error" => $e->getMessage()
    ]);
}
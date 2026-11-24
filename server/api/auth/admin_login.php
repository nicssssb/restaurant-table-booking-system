<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/Database.php";

try {

    // =========================================
    // DATABASE CONNECTION
    // =========================================

    $database = new Database();
    $db = $database->connect();


    // =========================================
    // GET LOGIN DATA
    // =========================================

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    $email = trim($input["email"] ?? "");
    $password = $input["password"] ?? "";


    // =========================================
    // VALIDATION
    // =========================================

    if ($email === "" || $password === "") {

        echo json_encode([
            "success" => false,
            "message" => "Email and password are required."
        ]);

        exit;
    }


    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        echo json_encode([
            "success" => false,
            "message" => "Please enter a valid email address."
        ]);

        exit;
    }


    // =========================================
    // FIND ADMIN
    // =========================================

    $sql = "
        SELECT
            user_id,
            full_name,
            username,
            email,
            password,
            role,
            status
        FROM users
        WHERE email = :email
        AND role = 'Admin'
        LIMIT 1
    ";

    $stmt = $db->prepare($sql);

    $stmt->execute([
        ":email" => $email
    ]);

    $admin = $stmt->fetch();


    // =========================================
    // ADMIN NOT FOUND
    // =========================================

    if (!$admin) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid admin email or password."
        ]);

        exit;
    }


    // =========================================
    // CHECK ACCOUNT STATUS
    // =========================================

    if ($admin["status"] !== "Active") {

        echo json_encode([
            "success" => false,
            "message" => "This admin account is inactive."
        ]);

        exit;
    }


    // =========================================
    // CHECK PASSWORD
    // =========================================

    if (!password_verify(
        $password,
        $admin["password"]
    )) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid admin email or password."
        ]);

        exit;
    }


    // =========================================
    // REMOVE PASSWORD
    // =========================================

    unset($admin["password"]);


    // =========================================
    // LOGIN SUCCESS
    // =========================================

    echo json_encode([
        "success" => true,
        "message" => "Admin login successful.",
        "user" => $admin
    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "error" => $e->getMessage()
    ]);
}
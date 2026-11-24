<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


// =========================================================
// HANDLE OPTIONS
// =========================================================

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);
    exit;

}


// =========================================================
// ONLY POST ALLOWED
// =========================================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);

    exit;

}


// =========================================================
// DATABASE
// =========================================================

require_once "../../config/Database.php";


try {

    $database = new Database();
    $db = $database->connect();


    // =========================================================
    // GET JSON DATA
    // =========================================================

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


    // =========================================================
    // GET FORM DATA
    // =========================================================

    $full_name =
        trim($data["full_name"] ?? "");

    $contact_number =
        trim($data["contact_number"] ?? "");

    $email =
        trim($data["email"] ?? "");

    $password =
        $data["password"] ?? "";

    $confirm_password =
        $data["confirm_password"] ?? "";

    $address =
        trim($data["address"] ?? "");


    // =========================================================
    // REQUIRED FIELDS
    // =========================================================

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


    if ($email === "") {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Email is required."
        ]);

        exit;

    }


    if ($password === "") {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Password is required."
        ]);

        exit;

    }


    // =========================================================
    // FULL NAME VALIDATION
    // =========================================================

    if (strlen($full_name) < 2) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Full name must be at least 2 characters."
        ]);

        exit;

    }


    if (strlen($full_name) > 100) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Full name must not exceed 100 characters."
        ]);

        exit;

    }


    // Letters, spaces, apostrophe, and hyphen only

    if (!preg_match(
        "/^[a-zA-ZÀ-ÿ\s'-]+$/u",
        $full_name
    )) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Full name can only contain letters, spaces, apostrophes, and hyphens."
        ]);

        exit;

    }


    // =========================================================
    // CONTACT NUMBER VALIDATION
    // =========================================================

    // Remove spaces and hyphens

    $contact_number =
        preg_replace(
            "/[\s-]+/",
            "",
            $contact_number
        );


    /*
        Accepted Philippine formats:

        09123456789
        +639123456789
    */

    if (!preg_match(
        "/^(09\d{9}|\+639\d{9})$/",
        $contact_number
    )) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Please enter a valid Philippine contact number."
        ]);

        exit;

    }


    // =========================================================
    // EMAIL VALIDATION
    // =========================================================

    if (!filter_var(
        $email,
        FILTER_VALIDATE_EMAIL
    )) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Please enter a valid email address."
        ]);

        exit;

    }


    if (strlen($email) > 100) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Email must not exceed 100 characters."
        ]);

        exit;

    }


    // =========================================================
    // PASSWORD VALIDATION
    // =========================================================

    if (strlen($password) < 8) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Password must be at least 8 characters."
        ]);

        exit;

    }


    if (strlen($password) > 72) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Password must not exceed 72 characters."
        ]);

        exit;

    }


    // Must contain at least one letter

    if (!preg_match(
        "/[A-Za-z]/",
        $password
    )) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Password must contain at least one letter."
        ]);

        exit;

    }


    // Must contain at least one number

    if (!preg_match(
        "/[0-9]/",
        $password
    )) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Password must contain at least one number."
        ]);

        exit;

    }


    // =========================================================
    // CONFIRM PASSWORD
    // =========================================================

    /*
        This validation will only run if
        confirm_password is sent by the frontend.
    */

    if ($confirm_password !== "") {

        if ($password !== $confirm_password) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Passwords do not match."
            ]);

            exit;

        }

    }


    // =========================================================
    // ADDRESS VALIDATION
    // =========================================================

    if ($address !== "") {

        if (strlen($address) < 5) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Address must be at least 5 characters."
            ]);

            exit;

        }


        if (strlen($address) > 255) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Address must not exceed 255 characters."
            ]);

            exit;

        }

    }


    // =========================================================
    // CHECK EXISTING EMAIL
    // =========================================================

    $checkEmailQuery = "

        SELECT customer_id

        FROM customers

        WHERE email = :email

        LIMIT 1

    ";

    $checkEmailStmt =
        $db->prepare(
            $checkEmailQuery
        );


    $checkEmailStmt->execute([
        ":email" => $email
    ]);


    if ($checkEmailStmt->fetch()) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "An account with this email already exists."
        ]);

        exit;

    }


    // =========================================================
    // CHECK EXISTING CONTACT NUMBER
    // =========================================================

    $checkContactQuery = "

        SELECT customer_id

        FROM customers

        WHERE contact_number = :contact_number

        LIMIT 1

    ";

    $checkContactStmt =
        $db->prepare(
            $checkContactQuery
        );


    $checkContactStmt->execute([
        ":contact_number" =>
            $contact_number
    ]);


    if ($checkContactStmt->fetch()) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "An account with this contact number already exists."
        ]);

        exit;

    }


    // =========================================================
    // HASH PASSWORD
    // =========================================================

    $hashedPassword =
        password_hash(
            $password,
            PASSWORD_DEFAULT
        );


    // =========================================================
    // INSERT CUSTOMER
    // =========================================================

    $query = "

        INSERT INTO customers

        (
            full_name,
            contact_number,
            email,
            password,
            address
        )

        VALUES

        (
            :full_name,
            :contact_number,
            :email,
            :password,
            :address
        )

    ";


    $stmt =
        $db->prepare($query);


    $stmt->execute([

        ":full_name" =>
            $full_name,

        ":contact_number" =>
            $contact_number,

        ":email" =>
            $email,

        ":password" =>
            $hashedPassword,

        ":address" =>
            $address !== ""
                ? $address
                : null

    ]);


    // =========================================================
    // SUCCESS
    // =========================================================

    http_response_code(201);

    echo json_encode([

        "success" => true,

        "message" =>
            "Customer account created successfully.",

        "customer_id" =>
            (int) $db->lastInsertId()

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Database error."

    ]);


} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Server error."

    ]);

}

?>
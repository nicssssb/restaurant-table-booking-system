<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");


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


try {

    // =========================================
    // DATABASE
    // =========================================

    $database = new Database();

    $db = $database->connect();


    // =========================================
    // GET JSON DATA
    // =========================================

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
    // GET FIELDS
    // =========================================

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
    // CAPACITY VALIDATION
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

            "message" =>
                "Invalid table status."

        ]);

        exit;

    }


    // =========================================
    // CHECK DUPLICATE TABLE NUMBER
    // =========================================

    $checkQuery = $db->prepare("

        SELECT table_id

        FROM restaurant_tables

        WHERE table_number = ?

        LIMIT 1

    ");


    $checkQuery->execute([

        $table_number

    ]);


    if ($checkQuery->fetch()) {

        http_response_code(409);

        echo json_encode([

            "success" => false,

            "message" =>
                "Table number already exists."

        ]);

        exit;

    }


    // =========================================
    // INSERT TABLE
    // =========================================

    $insertQuery = $db->prepare("

        INSERT INTO restaurant_tables (

            table_number,

            capacity,

            location,

            status

        )

        VALUES (

            ?,

            ?,

            ?,

            ?

        )

    ");


    $insertQuery->execute([

        $table_number,

        $capacity,

        $location,

        $status

    ]);


    // =========================================
    // GET NEW ID
    // =========================================

    $table_id =
        $db->lastInsertId();


    // =========================================
    // SUCCESS
    // =========================================

    http_response_code(201);

    echo json_encode([

        "success" => true,

        "message" =>
            "Restaurant table created successfully.",

        "table_id" =>
            $table_id

    ]);


} catch (PDOException $e) {

    // =========================================
    // DATABASE ERROR
    // =========================================

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to create restaurant table.",

        "error" =>
            $e->getMessage()

    ]);

}

?>
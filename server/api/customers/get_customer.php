<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

require_once "../../config/Database.php";


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);

    exit;
}


if ($_SERVER["REQUEST_METHOD"] !== "GET") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only GET requests are allowed."
    ]);

    exit;
}


if (
    !isset($_GET["id"]) ||
    !is_numeric($_GET["id"])
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Customer ID is required."
    ]);

    exit;
}


$customerId = (int) $_GET["id"];


try {

    $database = new Database();

    $db = $database->connect();


    $query = $db->prepare("
        SELECT
            customer_id,
            full_name,
            contact_number,
            email,
            created_at
        FROM customers
        WHERE customer_id = ?
        LIMIT 1
    ");


    $query->execute([
        $customerId
    ]);


    $customer =
        $query->fetch(
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


    echo json_encode([

        "success" => true,

        "data" => $customer

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Database error.",

        "error" =>
            $e->getMessage()

    ]);

}

?>
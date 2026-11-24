<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


/* =========================================
   CORS PREFLIGHT
========================================= */

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);
    exit;

}


/* =========================================
   REQUEST METHOD
========================================= */

if ($_SERVER["REQUEST_METHOD"] !== "GET") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only GET requests are allowed."
    ]);

    exit;

}


require_once "../../config/Database.php";


try {

    /* =========================================
       DATABASE
    ========================================= */

    $database = new Database();
    $db = $database->connect();


    /* =========================================
       GET CUSTOMERS + RESERVATION COUNT
    ========================================= */

    $query = $db->prepare("

        SELECT

            c.customer_id,

            c.full_name,

            c.contact_number,

            c.email,

            c.address,

            COUNT(r.reservation_id) AS reservation_count

        FROM customers c

        LEFT JOIN reservations r
            ON r.customer_id = c.customer_id

        GROUP BY

            c.customer_id,
            c.full_name,
            c.contact_number,
            c.email,
            c.address

        ORDER BY
            c.customer_id DESC

    ");


    $query->execute();


    $customers = $query->fetchAll(
        PDO::FETCH_ASSOC
    );


    /* =========================================
       CONVERT COUNT TO INTEGER
    ========================================= */

    foreach ($customers as &$customer) {

        $customer["reservation_count"] =
            (int)$customer["reservation_count"];

    }

    unset($customer);


    /* =========================================
       SUCCESS
    ========================================= */

    echo json_encode([

        "success" => true,

        "data" => $customers

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" => "Failed to load customers.",

        "error" => $e->getMessage()

    ]);

}

?>
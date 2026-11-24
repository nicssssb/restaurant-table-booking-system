<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

require_once "../../config/Database.php";


/* =========================================
   CORS
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


/* =========================================
   CUSTOMER ID
========================================= */

if (!isset($_GET["customer_id"]) || !is_numeric($_GET["customer_id"])) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Customer ID is required."
    ]);

    exit;
}


$customer_id = (int) $_GET["customer_id"];


/* =========================================
   DATABASE
========================================= */

try {

    $database = new Database();
    $db = $database->connect();


    /* =====================================
       CHECK CUSTOMER
    ===================================== */

    $customerQuery = $db->prepare("
        SELECT
            customer_id,
            full_name
        FROM customers
        WHERE customer_id = ?
        LIMIT 1
    ");

    $customerQuery->execute([
        $customer_id
    ]);

    $customer = $customerQuery->fetch(PDO::FETCH_ASSOC);


    if (!$customer) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Customer not found."
        ]);

        exit;
    }


    /* =====================================
       COUNT RESERVATIONS
    ===================================== */

    $countQuery = $db->prepare("
        SELECT COUNT(*) AS total
        FROM reservations
        WHERE customer_id = ?
    ");

    $countQuery->execute([
        $customer_id
    ]);

    $countResult = $countQuery->fetch(PDO::FETCH_ASSOC);

    $totalReservations = (int) $countResult["total"];


    /* =====================================
       GET RESERVATIONS
    ===================================== */

    $reservationQuery = $db->prepare("
        SELECT
            r.reservation_id,
            r.customer_id,
            r.table_id,
            r.reservation_date,
            r.reservation_time,
            r.guests,
            r.special_request,
            r.payment_status,
            r.status,
            r.created_at,

            t.table_number,
            t.capacity,
            t.location

        FROM reservations r

        LEFT JOIN restaurant_tables t
            ON r.table_id = t.table_id

        WHERE r.customer_id = ?

        ORDER BY
            r.reservation_date DESC,
            r.reservation_time DESC
    ");

    $reservationQuery->execute([
        $customer_id
    ]);

    $reservations =
        $reservationQuery->fetchAll(PDO::FETCH_ASSOC);


    /* =====================================
       SUCCESS
    ===================================== */

    echo json_encode([

        "success" => true,

        "customer" => $customer,

        "total_reservations" =>
            $totalReservations,

        "data" =>
            $reservations

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to load customer reservations.",

        "error" =>
            $e->getMessage()

    ]);

}

?>
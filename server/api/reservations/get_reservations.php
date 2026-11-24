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

try {

    $database = new Database();
    $db = $database->connect();

    /*
    |--------------------------------------------------------------------------
    | GET RESERVATIONS
    |--------------------------------------------------------------------------
    */

    $query = $db->prepare("
        SELECT
            r.reservation_id,

            r.customer_id,
            c.full_name AS customer_name,
            c.contact_number,
            c.email,

            r.table_id,
            t.table_number,
            t.capacity,
            t.location AS table_location,

            r.reservation_date,
            r.reservation_time,

            r.guests,

            r.special_request,

            r.payment_status,

            r.status,

            r.created_at

        FROM reservations r

        INNER JOIN customers c
            ON r.customer_id = c.customer_id

        INNER JOIN restaurant_tables t
            ON r.table_id = t.table_id

        ORDER BY
            r.reservation_date DESC,
            r.reservation_time DESC,
            r.reservation_id DESC
    ");

    $query->execute();

    $reservations =
        $query->fetchAll(PDO::FETCH_ASSOC);


    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    echo json_encode([

        "success" => true,

        "data" => $reservations

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to load reservations.",

        "error" =>
            $e->getMessage()

    ]);

}

?>

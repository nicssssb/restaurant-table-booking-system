<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


// =========================================================
// OPTIONS
// =========================================================

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);

    exit;

}


require_once "../../config/Database.php";


try {

    // =====================================================
    // DATABASE CONNECTION
    // =====================================================

    $database = new Database();

    $db = $database->connect();


    // =====================================================
    // GET RESERVATION ID
    // =====================================================

    $id = $_GET["id"] ?? null;


    if (!$id) {

        echo json_encode([

            "success" => false,

            "message" =>
                "Reservation ID is required.",

            "data" => null

        ]);

        exit;

    }


    // =====================================================
    // GET RESERVATION
    // =====================================================

    $sql = "

        SELECT

            /* =================================================
               RESERVATION
            ================================================= */

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


            /* =================================================
               CUSTOMER
            ================================================= */

            c.full_name AS customer_name,

            c.contact_number,

            c.email,

            c.address,


            /* =================================================
               TABLE
            ================================================= */

            rt.table_number,

            rt.capacity AS table_capacity,

            rt.location AS table_location,

            rt.status AS table_status


        FROM reservations r


        LEFT JOIN customers c

            ON r.customer_id =
               c.customer_id


        LEFT JOIN restaurant_tables rt

            ON r.table_id =
               rt.table_id


        WHERE r.reservation_id =
              :reservation_id


        LIMIT 1

    ";


    $stmt = $db->prepare($sql);


    $stmt->execute([

        ":reservation_id" =>
            (int)$id

    ]);


    $reservation =
        $stmt->fetch(PDO::FETCH_ASSOC);


    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!$reservation) {

        echo json_encode([

            "success" => false,

            "message" =>
                "Reservation not found.",

            "data" => null

        ]);

        exit;

    }


    // =====================================================
    // FORMAT DATA
    // =====================================================

    $reservation["reservation_id"] =
        (int)$reservation["reservation_id"];


    $reservation["customer_id"] =
        (int)$reservation["customer_id"];


    $reservation["table_id"] =
        (int)$reservation["table_id"];


    $reservation["guests"] =
        (int)$reservation["guests"];


    $reservation["table_capacity"] =
        (int)$reservation["table_capacity"];


    // =====================================================
    // RESPONSE
    // =====================================================

    echo json_encode([

        "success" => true,

        "data" => $reservation

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Database error.",

        "error" =>
            $e->getMessage(),

        "data" => null

    ]);


} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "PHP error.",

        "error" =>
            $e->getMessage(),

        "data" => null

    ]);

}

?>
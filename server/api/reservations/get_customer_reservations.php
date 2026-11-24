<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../../config/Database.php";


try {

    // =========================================================
    // DATABASE CONNECTION
    // =========================================================

    $database = new Database();

    $db = $database->connect();


    // =========================================================
    // GET CUSTOMER ID
    // =========================================================

    $customer_id =
        $_GET["customer_id"] ?? null;


    if (!$customer_id) {

        echo json_encode([

            "success" => false,

            "message" =>
                "Customer ID is required.",

            "data" => []

        ]);

        exit;

    }


    // =========================================================
    // GET RESERVATIONS
    // =========================================================

    $sql = "

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

            rt.table_number,

            rt.location

        FROM reservations r

        LEFT JOIN restaurant_tables rt

            ON r.table_id = rt.table_id

        WHERE r.customer_id = :customer_id

        ORDER BY

            r.reservation_date DESC,

            r.reservation_time DESC,

            r.reservation_id DESC

    ";


    $stmt =
        $db->prepare($sql);


    $stmt->execute([

        ":customer_id" =>
            $customer_id

    ]);


    $reservations =
        $stmt->fetchAll(
            PDO::FETCH_ASSOC
        );


    // =========================================================
    // FORMAT DATA
    // =========================================================

    foreach ($reservations as &$reservation) {

        $reservation["reservation_id"] =
            (int) $reservation["reservation_id"];

        $reservation["customer_id"] =
            (int) $reservation["customer_id"];

        $reservation["table_id"] =
            (int) $reservation["table_id"];

        $reservation["guests"] =
            (int) $reservation["guests"];

    }


    // =========================================================
    // RESPONSE
    // =========================================================

    echo json_encode([

        "success" => true,

        "message" =>
            "Reservations loaded successfully.",

        "data" =>
            $reservations

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Database error.",

        "error" =>
            $e->getMessage(),

        "data" => []

    ]);


} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            $e->getMessage(),

        "data" => []

    ]);

}

?>
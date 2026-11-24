<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once("../../config/Database.php");

try {

    // =========================================
    // GET CUSTOMER ID
    // =========================================

    if (!isset($_GET["customer_id"]) || empty($_GET["customer_id"])) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Customer ID is required."
        ]);

        exit;
    }

    $customerId = intval($_GET["customer_id"]);


    // =========================================
    // DATABASE CONNECTION
    // =========================================

    $database = new Database();
    $conn = $database->connect();


    // =========================================
    // GET ALL RESERVATIONS
    // =========================================

    $sql = "
        SELECT
            reservation_id,
            customer_id,
            table_id,
            reservation_date,
            reservation_time,
            guests,
            special_request,
            payment_status,
            status,
            created_at
        FROM reservations
        WHERE customer_id = ?
        ORDER BY reservation_date DESC, reservation_time DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute([$customerId]);

    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // =========================================
    // STATISTICS
    // =========================================

    $total = count($reservations);

    $upcoming = 0;
    $pending = 0;
    $completed = 0;


    $today = date("Y-m-d");


    foreach ($reservations as $reservation) {

        $status = strtolower($reservation["status"]);
        $date = $reservation["reservation_date"];


        // Pending
        if ($status === "pending") {
            $pending++;
        }


        // Completed
        if ($status === "completed") {
            $completed++;
        }


        // Upcoming
        if (
            $date >= $today &&
            ($status === "pending" || $status === "confirmed")
        ) {
            $upcoming++;
        }

    }


    // =========================================
    // FIND NEXT UPCOMING RESERVATION
    // =========================================

    $upcomingReservation = null;


    foreach ($reservations as $reservation) {

        $status = strtolower($reservation["status"]);
        $date = $reservation["reservation_date"];


        if (
            $date >= $today &&
            ($status === "pending" || $status === "confirmed")
        ) {

            $upcomingReservation = $reservation;

            break;
        }
    }


    // =========================================
    // RECENT RESERVATIONS
    // =========================================

    $recentReservations = array_slice($reservations, 0, 5);


    // =========================================
    // RESPONSE
    // =========================================

    echo json_encode([

        "success" => true,

        "stats" => [
            "total" => $total,
            "upcoming" => $upcoming,
            "pending" => $pending,
            "completed" => $completed
        ],

        "upcomingReservation" => $upcomingReservation,

        "recentReservations" => $recentReservations

    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" => "Database error.",

        "error" => $e->getMessage()

    ]);

}
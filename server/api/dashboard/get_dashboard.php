<?php

/* =========================================================
   CORS
========================================================= */

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


/* =========================================================
   CORS PREFLIGHT
========================================================= */

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);

    exit;
}


/* =========================================================
   REQUEST METHOD
========================================================= */

if ($_SERVER["REQUEST_METHOD"] !== "GET") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only GET requests are allowed."
    ]);

    exit;
}


/* =========================================================
   DATABASE
========================================================= */

require_once "../../config/Database.php";


try {

    $database = new Database();

    $db = $database->connect();


    /* =====================================================
       TODAY
    ===================================================== */

    $today = date("Y-m-d");


    /* =====================================================
       TODAY'S RESERVATIONS
    ===================================================== */

    $stmt = $db->prepare("
        SELECT COUNT(*) 
        FROM reservations
        WHERE reservation_date = ?
    ");

    $stmt->execute([$today]);

    $todayReservations = (int) $stmt->fetchColumn();


    /* =====================================================
       PENDING RESERVATIONS
    ===================================================== */

    $stmt = $db->prepare("
        SELECT COUNT(*)
        FROM reservations
        WHERE status = 'Pending'
    ");

    $stmt->execute();

    $pendingReservations = (int) $stmt->fetchColumn();


    /* =====================================================
       TOTAL CUSTOMERS
    ===================================================== */

    $stmt = $db->query("
        SELECT COUNT(*)
        FROM customers
    ");

    $totalCustomers = (int) $stmt->fetchColumn();


    /* =====================================================
       TOTAL TABLES
    ===================================================== */

    $stmt = $db->query("
        SELECT COUNT(*)
        FROM restaurant_tables
    ");

    $totalTables = (int) $stmt->fetchColumn();


    /* =====================================================
       AVAILABLE TABLES
    ===================================================== */

    $stmt = $db->prepare("
        SELECT COUNT(*)
        FROM restaurant_tables
        WHERE status = 'Available'
    ");

    $stmt->execute();

    $availableTables = (int) $stmt->fetchColumn();


    /* =====================================================
       EXPECTED GUESTS TODAY
    ===================================================== */

    $stmt = $db->prepare("
        SELECT COALESCE(SUM(guests), 0)
        FROM reservations
        WHERE reservation_date = ?
        AND status IN ('Pending', 'Confirmed')
    ");

    $stmt->execute([$today]);

    $expectedGuests = (int) $stmt->fetchColumn();


    /* =====================================================
       RECENT RESERVATIONS
    ===================================================== */

    $stmt = $db->query("
        SELECT
            r.reservation_id,
            c.full_name,
            r.reservation_date,
            r.reservation_time,
            r.guests,
            r.status

        FROM reservations r

        LEFT JOIN customers c
            ON r.customer_id = c.customer_id

        ORDER BY
            r.reservation_id DESC

        LIMIT 5
    ");


    $recentReservations = $stmt->fetchAll(PDO::FETCH_ASSOC);


    /* =====================================================
       CONVERT NUMBERS
    ===================================================== */

    foreach ($recentReservations as &$reservation) {

        $reservation["reservation_id"] =
            (int) $reservation["reservation_id"];

        $reservation["guests"] =
            (int) $reservation["guests"];

    }

    unset($reservation);


    /* =====================================================
       RESPONSE
    ===================================================== */

    echo json_encode([

        "success" => true,

        "data" => [

            "today_reservations" =>
                $todayReservations,

            "pending_reservations" =>
                $pendingReservations,

            "total_customers" =>
                $totalCustomers,

            "available_tables" =>
                $availableTables,

            "total_tables" =>
                $totalTables,

            "expected_guests" =>
                $expectedGuests,

            "recent_reservations" =>
                $recentReservations

        ]

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" => "Dashboard database error.",

        "error" => $e->getMessage()

    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" => "Server error.",

        "error" => $e->getMessage()

    ]);

}

?>
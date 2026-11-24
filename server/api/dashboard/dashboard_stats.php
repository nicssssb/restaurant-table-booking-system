<?php

// =========================================
// CORS
// =========================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");


// =========================================
// OPTIONS
// =========================================

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}


// =========================================
// DATABASE
// =========================================

require_once "../../config/Database.php";


try {

    $database = new Database();
    $db = $database->connect();


    // =====================================
    // TOTAL CUSTOMERS
    // =====================================

    $customerQuery = "
        SELECT COUNT(*) AS total
        FROM customers
    ";

    $customerStmt = $db->prepare(
        $customerQuery
    );

    $customerStmt->execute();

    $totalCustomers =
        (int) $customerStmt
            ->fetch(PDO::FETCH_ASSOC)["total"];


    // =====================================
    // TOTAL TABLES
    // =====================================

    $tableQuery = "
        SELECT COUNT(*) AS total
        FROM tables
    ";

    $tableStmt = $db->prepare(
        $tableQuery
    );

    $tableStmt->execute();

    $totalTables =
        (int) $tableStmt
            ->fetch(PDO::FETCH_ASSOC)["total"];


    // =====================================
    // TOTAL RESERVATIONS
    // =====================================

    $reservationQuery = "
        SELECT COUNT(*) AS total
        FROM reservations
    ";

    $reservationStmt = $db->prepare(
        $reservationQuery
    );

    $reservationStmt->execute();

    $totalReservations =
        (int) $reservationStmt
            ->fetch(PDO::FETCH_ASSOC)["total"];


    // =====================================
    // PENDING
    // =====================================

    $pendingQuery = "
        SELECT COUNT(*) AS total
        FROM reservations
        WHERE status = 'Pending'
    ";

    $pendingStmt = $db->prepare(
        $pendingQuery
    );

    $pendingStmt->execute();

    $pendingReservations =
        (int) $pendingStmt
            ->fetch(PDO::FETCH_ASSOC)["total"];


    // =====================================
    // CONFIRMED
    // =====================================

    $confirmedQuery = "
        SELECT COUNT(*) AS total
        FROM reservations
        WHERE status = 'Confirmed'
    ";

    $confirmedStmt = $db->prepare(
        $confirmedQuery
    );

    $confirmedStmt->execute();

    $confirmedReservations =
        (int) $confirmedStmt
            ->fetch(PDO::FETCH_ASSOC)["total"];


    // =====================================
    // COMPLETED
    // =====================================

    $completedQuery = "
        SELECT COUNT(*) AS total
        FROM reservations
        WHERE status = 'Completed'
    ";

    $completedStmt = $db->prepare(
        $completedQuery
    );

    $completedStmt->execute();

    $completedReservations =
        (int) $completedStmt
            ->fetch(PDO::FETCH_ASSOC)["total"];


    // =====================================
    // CANCELLED
    // =====================================

    $cancelledQuery = "
        SELECT COUNT(*) AS total
        FROM reservations
        WHERE status = 'Cancelled'
    ";

    $cancelledStmt = $db->prepare(
        $cancelledQuery
    );

    $cancelledStmt->execute();

    $cancelledReservations =
        (int) $cancelledStmt
            ->fetch(PDO::FETCH_ASSOC)["total"];


    // =====================================
    // TODAY'S RESERVATIONS
    // =====================================

    $todayQuery = "
        SELECT COUNT(*) AS total
        FROM reservations
        WHERE reservation_date = CURDATE()
        AND status != 'Cancelled'
    ";

    $todayStmt = $db->prepare(
        $todayQuery
    );

    $todayStmt->execute();

    $todayReservations =
        (int) $todayStmt
            ->fetch(PDO::FETCH_ASSOC)["total"];


    // =====================================
    // AVAILABLE TABLES
    // =====================================

    $availableTableQuery = "
        SELECT COUNT(*) AS total
        FROM tables
        WHERE status = 'Available'
    ";

    $availableTableStmt =
        $db->prepare(
            $availableTableQuery
        );

    $availableTableStmt->execute();

    $availableTables =
        (int) $availableTableStmt
            ->fetch(PDO::FETCH_ASSOC)["total"];


    // =====================================
    // RESPONSE
    // =====================================

    echo json_encode([

        "success" => true,

        "data" => [

            "total_customers" =>
                $totalCustomers,

            "total_tables" =>
                $totalTables,

            "total_reservations" =>
                $totalReservations,

            "pending_reservations" =>
                $pendingReservations,

            "confirmed_reservations" =>
                $confirmedReservations,

            "completed_reservations" =>
                $completedReservations,

            "cancelled_reservations" =>
                $cancelledReservations,

            "today_reservations" =>
                $todayReservations,

            "available_tables" =>
                $availableTables

        ]

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
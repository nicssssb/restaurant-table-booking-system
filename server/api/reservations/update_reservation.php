<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/Database.php";

if (
    $_SERVER["REQUEST_METHOD"] !== "PUT" &&
    $_SERVER["REQUEST_METHOD"] !== "POST"
) {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only PUT or POST requests are allowed."
    ]);

    exit;
}

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


/*
|--------------------------------------------------------------------------
| GET DATA
|--------------------------------------------------------------------------
*/

$reservation_id =
    $data["reservation_id"] ?? null;

$customer_id =
    $data["customer_id"] ?? null;

$table_id =
    $data["table_id"] ?? null;

$reservation_date =
    $data["reservation_date"] ?? null;

$reservation_time =
    $data["reservation_time"] ?? null;

$guests =
    $data["guests"] ?? null;

$special_request =
    $data["special_request"] ?? "";

$payment_status =
    $data["payment_status"] ?? "Unpaid";

$status =
    $data["status"] ?? "Pending";


/*
|--------------------------------------------------------------------------
| REQUIRED FIELDS
|--------------------------------------------------------------------------
*/

if (
    !$reservation_id ||
    !$customer_id ||
    !$table_id ||
    !$reservation_date ||
    !$reservation_time ||
    !$guests
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Please complete all required reservation fields."
    ]);

    exit;
}

if ((int)$guests < 1) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Number of guests must be at least 1."
    ]);

    exit;
}


try {

    $database = new Database();
    $db = $database->connect();


    /*
    |--------------------------------------------------------------------------
    | CHECK RESERVATION
    |--------------------------------------------------------------------------
    */

    $reservationQuery = $db->prepare("
        SELECT reservation_id
        FROM reservations
        WHERE reservation_id = ?
        LIMIT 1
    ");

    $reservationQuery->execute([
        $reservation_id
    ]);

    if (!$reservationQuery->fetch()) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Reservation does not exist."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK CUSTOMER
    |--------------------------------------------------------------------------
    */

    $customerQuery = $db->prepare("
        SELECT customer_id
        FROM customers
        WHERE customer_id = ?
        LIMIT 1
    ");

    $customerQuery->execute([
        $customer_id
    ]);

    if (!$customerQuery->fetch()) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Customer does not exist."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK TABLE
    |--------------------------------------------------------------------------
    */

    $tableQuery = $db->prepare("
        SELECT
            table_id,
            table_number,
            capacity,
            status
        FROM restaurant_tables
        WHERE table_id = ?
        LIMIT 1
    ");

    $tableQuery->execute([
        $table_id
    ]);

    $table = $tableQuery->fetch(PDO::FETCH_ASSOC);

    if (!$table) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Selected table does not exist."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK TABLE CAPACITY
    |--------------------------------------------------------------------------
    */

    if ((int)$guests > (int)$table["capacity"]) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" =>
                "The selected table cannot accommodate the number of guests."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK TABLE STATUS
    |--------------------------------------------------------------------------
    */

    if (
        $table["status"] !== "Available"
    ) {

        /*
         * Allow the current reservation to keep
         * its existing table.
         */

        $currentTableQuery = $db->prepare("
            SELECT table_id
            FROM reservations
            WHERE reservation_id = ?
            LIMIT 1
        ");

        $currentTableQuery->execute([
            $reservation_id
        ]);

        $currentTable =
            $currentTableQuery->fetch(PDO::FETCH_ASSOC);

        if (
            !$currentTable ||
            (int)$currentTable["table_id"] !== (int)$table_id
        ) {

            http_response_code(409);

            echo json_encode([
                "success" => false,
                "message" =>
                    "The selected table is currently unavailable."
            ]);

            exit;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK PAST DATE
    |--------------------------------------------------------------------------
    */

    $today = date("Y-m-d");

    if ($reservation_date < $today) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" =>
                "Reservation date cannot be in the past."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK DOUBLE BOOKING
    |--------------------------------------------------------------------------
    |
    | Same table + same date + same time
    | is not allowed.
    |
    | IMPORTANT:
    | Exclude the reservation currently being edited.
    |
    */

    $bookingQuery = $db->prepare("
        SELECT reservation_id
        FROM reservations
        WHERE table_id = ?
          AND reservation_date = ?
          AND reservation_time = ?
          AND reservation_id != ?
          AND status IN (
              'Pending',
              'Confirmed'
          )
        LIMIT 1
    ");

    $bookingQuery->execute([
        $table_id,
        $reservation_date,
        $reservation_time,
        $reservation_id
    ]);

    $existingBooking =
        $bookingQuery->fetch(PDO::FETCH_ASSOC);

    if ($existingBooking) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" =>
                "This table is already reserved for the selected date and time."
        ]);

        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE RESERVATION
    |--------------------------------------------------------------------------
    */

    $updateQuery = $db->prepare("
        UPDATE reservations
        SET
            customer_id = ?,
            table_id = ?,
            reservation_date = ?,
            reservation_time = ?,
            guests = ?,
            special_request = ?,
            payment_status = ?,
            status = ?
        WHERE reservation_id = ?
    ");

    $updateQuery->execute([

        $customer_id,

        $table_id,

        $reservation_date,

        $reservation_time,

        $guests,

        $special_request,

        $payment_status,

        $status,

        $reservation_id

    ]);


    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    echo json_encode([

        "success" => true,

        "message" =>
            "Reservation updated successfully.",

        "reservation_id" =>
            $reservation_id

    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to update reservation.",

        "error" =>
            $e->getMessage()

    ]);

}

?>
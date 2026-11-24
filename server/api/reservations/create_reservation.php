<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


/*
============================================================
OPTIONS REQUEST
============================================================
*/

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);

    exit;

}


/*
============================================================
DATABASE
============================================================
*/

require_once "../../config/Database.php";


try {

    $database = new Database();

    $db = $database->connect();


    /*
    ============================================================
    GET REQUEST DATA
    ============================================================
    */

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );


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
    ============================================================
    VALIDATION
    ============================================================
    */

    if (
        !$customer_id ||
        !$table_id ||
        !$reservation_date ||
        !$reservation_time ||
        !$guests
    ) {

        echo json_encode([

            "success" => false,

            "message" =>
                "Please complete all required reservation fields."

        ]);

        exit;

    }


    /*
    ============================================================
    CHECK TABLE
    ============================================================
    */

    $checkTable = $db->prepare("

        SELECT
            table_id,
            table_number,
            capacity,
            location,
            status

        FROM restaurant_tables

        WHERE table_id = :table_id

        LIMIT 1

    ");


    $checkTable->execute([

        ":table_id" =>
            $table_id

    ]);


    $table = $checkTable->fetch(
        PDO::FETCH_ASSOC
    );


    /*
    ------------------------------------------------------------
    TABLE DOES NOT EXIST
    ------------------------------------------------------------
    */

    if (!$table) {

        echo json_encode([

            "success" => false,

            "message" =>
                "Selected table does not exist."

        ]);

        exit;

    }


    /*
    ------------------------------------------------------------
    TABLE STATUS
    ------------------------------------------------------------
    */

    $tableStatus =
        strtolower(
            trim(
                $table["status"] ?? ""
            )
        );


    if (
        $tableStatus !== "available" &&
        $tableStatus !== ""
    ) {

        echo json_encode([

            "success" => false,

            "message" =>
                "This table is currently unavailable."

        ]);

        exit;

    }


    /*
    ------------------------------------------------------------
    TABLE CAPACITY
    ------------------------------------------------------------
    */

    if (
        (int)$table["capacity"] <
        (int)$guests
    ) {

        echo json_encode([

            "success" => false,

            "message" =>
                "The selected table cannot accommodate your group."

        ]);

        exit;

    }


    /*
    ============================================================
    CHECK DUPLICATE RESERVATION
    ============================================================
    
    IMPORTANT:
    
    We only block the SAME:
    
        TABLE
        DATE
        TIME
    
    Example:
    
        Table 01 - Aug 25 - 7:00 PM
        Table 02 - Aug 25 - 7:00 PM
    
    Both are ALLOWED.
    
    But:
    
        Table 01 - Aug 25 - 7:00 PM
        Table 01 - Aug 25 - 7:00 PM
    
    Second reservation is BLOCKED.
    
    ============================================================
    */

    $checkReservation = $db->prepare("

        SELECT
            reservation_id

        FROM reservations

        WHERE
            table_id = :table_id

            AND reservation_date = :reservation_date

            AND reservation_time = :reservation_time

            AND LOWER(TRIM(status)) IN (
                'pending',
                'confirmed'
            )

        LIMIT 1

    ");


    $checkReservation->execute([

        ":table_id" =>
            $table_id,

        ":reservation_date" =>
            $reservation_date,

        ":reservation_time" =>
            $reservation_time

    ]);


    /*
    ------------------------------------------------------------
    DUPLICATE FOUND
    ------------------------------------------------------------
    */

    if ($checkReservation->fetch()) {

        echo json_encode([

            "success" => false,

            "message" =>
                "This table has already been reserved for the selected date and time."

        ]);

        exit;

    }


    /*
    ============================================================
    INSERT RESERVATION
    ============================================================
    */

    $sql = "

        INSERT INTO reservations (

            customer_id,

            table_id,

            reservation_date,

            reservation_time,

            guests,

            special_request,

            payment_status,

            status

        )

        VALUES (

            :customer_id,

            :table_id,

            :reservation_date,

            :reservation_time,

            :guests,

            :special_request,

            :payment_status,

            :status

        )

    ";


    $stmt = $db->prepare($sql);


    $stmt->execute([

        ":customer_id" =>
            $customer_id,

        ":table_id" =>
            $table_id,

        ":reservation_date" =>
            $reservation_date,

        ":reservation_time" =>
            $reservation_time,

        ":guests" =>
            $guests,

        ":special_request" =>
            $special_request,

        ":payment_status" =>
            $payment_status,

        ":status" =>
            $status

    ]);


    /*
    ============================================================
    SUCCESS
    ============================================================
    */

    echo json_encode([

        "success" => true,

        "message" =>
            "Reservation created successfully.",

        "reservation_id" =>
            $db->lastInsertId()

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

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            $e->getMessage()

    ]);

}

?>
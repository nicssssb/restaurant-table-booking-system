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
    // GET DATE AND TIME
    // =========================================================

    $date = $_GET["date"] ?? "";
    $time = $_GET["time"] ?? "";

    $date = trim($date);
    $time = trim($time);


    if ($date === "" || $time === "") {

        echo json_encode([
            "success" => false,
            "message" => "Date and time are required.",
            "tables" => []
        ]);

        exit;
    }


    // =========================================================
    // GET AVAILABLE TABLES
    // =========================================================

    $sql = "
        SELECT
            rt.table_id,
            rt.table_number,
            rt.capacity,
            rt.location,
            rt.status

        FROM restaurant_tables rt

        WHERE
            (
                LOWER(TRIM(rt.status)) = 'available'
                OR rt.status IS NULL
                OR TRIM(rt.status) = ''
            )

            AND NOT EXISTS (

                SELECT 1

                FROM reservations r

                WHERE
                    r.table_id = rt.table_id

                    AND r.reservation_date = :reservation_date

                    AND r.reservation_time = :reservation_time

                    AND LOWER(TRIM(r.status)) IN (
                        'pending',
                        'confirmed'
                    )
            )

        ORDER BY
            rt.table_id ASC
    ";


    $stmt = $db->prepare($sql);


    $stmt->execute([
        ":reservation_date" => $date,
        ":reservation_time" => $time
    ]);


    $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // =========================================================
    // FORMAT DATA
    // =========================================================

    foreach ($tables as &$table) {

        $table["table_id"] = (int) $table["table_id"];

        $table["capacity"] = (int) $table["capacity"];

        if (
            !isset($table["status"]) ||
            trim($table["status"]) === ""
        ) {
            $table["status"] = "Available";
        }

    }

    unset($table);


    // =========================================================
    // RESPONSE
    // =========================================================

    echo json_encode([
        "success" => true,
        "message" => count($tables) > 0
            ? "Available tables loaded successfully."
            : "No available tables found.",
        "tables" => $tables
    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage(),
        "tables" => []
    ]);


} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "error" => $e->getMessage(),
        "tables" => []
    ]);

}
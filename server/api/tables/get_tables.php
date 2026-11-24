<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");


/* =========================================
   CORS PREFLIGHT
========================================= */

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);

    exit;

}


/* =========================================
   CHECK REQUEST METHOD
========================================= */

if ($_SERVER["REQUEST_METHOD"] !== "GET") {

    http_response_code(405);

    echo json_encode([

        "success" => false,

        "message" =>
            "Only GET requests are allowed."

    ]);

    exit;

}


require_once "../../config/Database.php";


try {

    /* =========================================
       DATABASE
    ========================================= */

    $database = new Database();

    $db = $database->connect();


    /* =========================================
       GET TABLES
    ========================================= */

    $query = $db->prepare("

        SELECT

            t.table_id,

            t.table_number,

            t.capacity,

            t.location,

            CASE

                /*
                 * If there is an active reservation
                 * for this table today or in the future,
                 * show the table as Reserved.
                 */

                WHEN EXISTS (

                    SELECT 1

                    FROM reservations r

                    WHERE r.table_id = t.table_id

                    AND r.reservation_date >= CURDATE()

                    AND r.status IN (
                        'Pending',
                        'Confirmed'
                    )

                )

                THEN 'Reserved'


                /*
                 * Otherwise use the actual
                 * table status.
                 */

                ELSE t.status

            END AS status


        FROM restaurant_tables t


        ORDER BY
            t.table_number ASC

    ");


    $query->execute();


    $tables =
        $query->fetchAll(
            PDO::FETCH_ASSOC
        );


    /* =========================================
       SUCCESS
    ========================================= */

    echo json_encode([

        "success" => true,

        "data" => $tables

    ]);


} catch (PDOException $e) {


    /* =========================================
       DATABASE ERROR
    ========================================= */

    http_response_code(500);


    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to load tables.",

        "error" =>
            $e->getMessage()

    ]);

}

?>
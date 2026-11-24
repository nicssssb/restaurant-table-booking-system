<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");


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


require_once "../../config/Database.php";


if (
    !isset($_GET["id"]) ||
    !is_numeric($_GET["id"])
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Table ID is required."
    ]);

    exit;

}


$tableId = (int) $_GET["id"];


try {

    $database = new Database();
    $db = $database->connect();


    $query = "

        SELECT

            table_id,
            table_number,
            capacity,
            location,
            status

        FROM restaurant_tables

        WHERE table_id = :table_id

        LIMIT 1

    ";


    $stmt = $db->prepare($query);


    $stmt->bindValue(
        ":table_id",
        $tableId,
        PDO::PARAM_INT
    );


    $stmt->execute();


    $table = $stmt->fetch(
        PDO::FETCH_ASSOC
    );


    if (!$table) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Table not found."
        ]);

        exit;

    }


    echo json_encode([
        "success" => true,
        "data" => $table
    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage()
    ]);

}

?>
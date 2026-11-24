<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");


/* =========================================
   CORS
========================================= */

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);
    exit;

}


/* =========================================
   REQUEST METHOD
========================================= */

if ($_SERVER["REQUEST_METHOD"] !== "GET") {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only GET requests are allowed."
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
       PERIOD
    ========================================= */

    $period =
        $_GET["period"] ?? "This Month";


    $allowedPeriods = [

        "Today",
        "This Week",
        "This Month",
        "This Year"

    ];


    if (!in_array($period, $allowedPeriods, true)) {

        $period = "This Month";

    }


    /* =========================================
       DATE RANGE
    ========================================= */

    $today = date("Y-m-d");


    switch ($period) {

        case "Today":

            $startDate = $today;
            $endDate = $today;

            break;


        case "This Week":

            $startDate =
                date(
                    "Y-m-d",
                    strtotime("monday this week")
                );

            $endDate =
                date(
                    "Y-m-d",
                    strtotime("sunday this week")
                );

            break;


        case "This Year":

            $startDate =
                date("Y-01-01");

            $endDate =
                date("Y-12-31");

            break;


        case "This Month":

        default:

            $startDate =
                date("Y-m-01");

            $endDate =
                date("Y-m-t");

            break;

    }


    /* =========================================
       TOTAL RESERVATIONS
    ========================================= */

    $reservationQuery = $db->prepare("

        SELECT COUNT(*) AS total

        FROM reservations

        WHERE reservation_date
        BETWEEN ? AND ?

    ");


    $reservationQuery->execute([

        $startDate,
        $endDate

    ]);


    $reservations =
        (int)$reservationQuery
            ->fetchColumn();


    /* =========================================
       COMPLETED
    ========================================= */

    $completedQuery = $db->prepare("

        SELECT COUNT(*) AS total

        FROM reservations

        WHERE reservation_date
        BETWEEN ? AND ?

        AND status = 'Completed'

    ");


    $completedQuery->execute([

        $startDate,
        $endDate

    ]);


    $completed =
        (int)$completedQuery
            ->fetchColumn();


    /* =========================================
       CANCELLED
    ========================================= */

    $cancelledQuery = $db->prepare("

        SELECT COUNT(*) AS total

        FROM reservations

        WHERE reservation_date
        BETWEEN ? AND ?

        AND status = 'Cancelled'

    ");


    $cancelledQuery->execute([

        $startDate,
        $endDate

    ]);


    $cancelled =
        (int)$cancelledQuery
            ->fetchColumn();


    /* =========================================
       PENDING
    ========================================= */

    $pendingQuery = $db->prepare("

        SELECT COUNT(*) AS total

        FROM reservations

        WHERE reservation_date
        BETWEEN ? AND ?

        AND status = 'Pending'

    ");


    $pendingQuery->execute([

        $startDate,
        $endDate

    ]);


    $pending =
        (int)$pendingQuery
            ->fetchColumn();


    /* =========================================
       CUSTOMERS
       
       Count unique customers who made
       reservations during selected period.
    ========================================= */

    $customerQuery = $db->prepare("

        SELECT COUNT(
            DISTINCT customer_id
        )

        FROM reservations

        WHERE reservation_date
        BETWEEN ? AND ?

    ");


    $customerQuery->execute([

        $startDate,
        $endDate

    ]);


    $customers =
        (int)$customerQuery
            ->fetchColumn();


    /* =========================================
       REVENUE
       
       Uses payment_status = Paid.
       
       NOTE:
       This assumes your reservations table
       has a column named `amount`.
       
       If you DON'T have amount yet,
       revenue will be 0.
    ========================================= */

    $revenue = 0;


    $columnCheck = $db->query("

        SHOW COLUMNS

        FROM reservations

        LIKE 'amount'

    ");


    $hasAmount =
        $columnCheck->fetch();


    if ($hasAmount) {

        $revenueQuery = $db->prepare("

            SELECT COALESCE(
                SUM(amount),
                0
            )

            FROM reservations

            WHERE reservation_date
            BETWEEN ? AND ?

            AND payment_status = 'Paid'

        ");


        $revenueQuery->execute([

            $startDate,
            $endDate

        ]);


        $revenue =
            (float)$revenueQuery
                ->fetchColumn();

    }


    /* =========================================
       RESERVATION TREND
    ========================================= */

    $trend = [];


    if ($period === "Today") {

        $trendQuery = $db->prepare("

            SELECT
                reservation_time,
                COUNT(*) AS reservations

            FROM reservations

            WHERE reservation_date = ?

            GROUP BY reservation_time

            ORDER BY reservation_time

        ");


        $trendQuery->execute([

            $today

        ]);


        $rows =
            $trendQuery->fetchAll(
                PDO::FETCH_ASSOC
            );


        foreach ($rows as $row) {

            $trend[] = [

                "day" =>
                    date(
                        "g:i A",
                        strtotime(
                            $row["reservation_time"]
                        )
                    ),

                "reservations" =>
                    (int)$row["reservations"]

            ];

        }

    } else {

        $trendQuery = $db->prepare("

            SELECT
                reservation_date,
                COUNT(*) AS reservations

            FROM reservations

            WHERE reservation_date
            BETWEEN ? AND ?

            GROUP BY reservation_date

            ORDER BY reservation_date

        ");


        $trendQuery->execute([

            $startDate,
            $endDate

        ]);


        $rows =
            $trendQuery->fetchAll(
                PDO::FETCH_ASSOC
            );


        foreach ($rows as $row) {

            $trend[] = [

                "day" =>
                    date(
                        "M d",
                        strtotime(
                            $row["reservation_date"]
                        )
                    ),

                "reservations" =>
                    (int)$row["reservations"]

            ];

        }

    }


    /* =========================================
       RESPONSE
    ========================================= */

    echo json_encode([

        "success" => true,

        "period" => $period,

        "date_range" => [

            "start" => $startDate,

            "end" => $endDate

        ],

        "data" => [

            "reservations" =>
                $reservations,

            "completed" =>
                $completed,

            "cancelled" =>
                $cancelled,

            "pending" =>
                $pending,

            "customers" =>
                $customers,

            "revenue" =>
                $revenue,

            "trend" =>
                $trend

        ]

    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to load reports.",

        "error" =>
            $e->getMessage()

    ]);

}

?>
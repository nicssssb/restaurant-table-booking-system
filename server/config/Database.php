<?php

class Database
{
    private $host = "localhost";
    private $db_name = "restaurant_db";
    private $username = "root";
    private $password = "";

    public function connect()
    {
        $connection = null;

        try {

            $connection = new PDO(
                "mysql:host=" . $this->host .
                ";dbname=" . $this->db_name .
                ";charset=utf8mb4",
                $this->username,
                $this->password
            );

            $connection->setAttribute(
                PDO::ATTR_ERRMODE,
                PDO::ERRMODE_EXCEPTION
            );

            $connection->setAttribute(
                PDO::ATTR_DEFAULT_FETCH_MODE,
                PDO::FETCH_ASSOC
            );

        } catch (PDOException $e) {

            http_response_code(500);

            echo json_encode([
                "success" => false,
                "message" => "Database connection failed.",
                "error" => $e->getMessage()
            ]);

            exit;
        }

        return $connection;
    }
}
?>

<?php

date_default_timezone_set("Asia/Kolkata");

class MySQLDatabase {

    static $db_fields = array();
    private $connection;
    public $last_query;
    private $magic_quotes_active;
    private $real_escape_string_exists;

    function __construct() {
        $this->open_connection();
        $this->magic_quotes_active = get_magic_quotes_gpc();
        $this->real_escape_string_exists = function_exists("mysql_real_escape_string");
    }

    public function open_connection() {        
//$this->connection = mysqli_connect("50.62.209.85", "jardiance", "jardiance@123");
        $this->connection = mysqli_connect("localhost", "root", "");
        if (!$this->connection) {
            die("Database connection failed: ");
        } else {
            $db_select = mysqli_select_db($this->connection, "jardiance");
            if (!$db_select) {
                die("Database selection failed: " . mysqli_error($this->connection));
            }
        }
    }

    public function close_connection() {
        if (isset($this->connection)) {
            mysqli_close($this->connection);
            unset($this->connection);
        }
    }

    public function query($sql) {
        $this->last_query = $sql;
        $result = mysqli_query($this->connection, $sql);
        $this->confirm_query($result);
        return $result;
    }

    public function escape_value($value) {
        if ($this->real_escape_string_exists) {
            if ($this->magic_quotes_active) {
                $value = stripslashes($value);
            }
            $value = mysqli_real_escape_string($this->connection, $value);
        } else {
            if (!$this->magic_quotes_active) {
                $value = addslashes($value);
            }
        }
        return $value;
    }

    public function fetch_array($result_set) {
        return mysqli_fetch_array($result_set);
    }

    public function num_rows($result_set) {
        return mysqli_num_rows($result_set);
    }

    public function fetch_associative_array($result_set) {
        return mysqli_fetch_assoc($result_set);
    }

    public function insert_id() {
        return mysqli_insert_id($this->connection);
    }

    public function get_fields($result_set) {
        $columnNames = array();
        $fieldMetadata = mysqli_fetch_field($result_set);
        foreach ($fieldMetadata as $value) {
            array_push($columnNames, $value);
            break;
        }

        return $columnNames;
    }

    protected function sanitized_attributes($field_array) {
        $clean_attributes = array();
        foreach ($field_array as $key => $value) {
            $clean_attributes[$key] = $this->escape_value($value);
        }
        return $clean_attributes;
    }

    public function create($field_array, $table_name) {
        $attributes = $this->sanitized_attributes($field_array);
        $sql = "INSERT INTO " . $table_name . " (";
        $sql .= join(", ", array_keys($attributes));
        $sql .= ") VALUES ('";
        $sql .= join("', '", array_values($attributes));
        $sql .= "')";
        if ($this->query($sql)) {
            return $this->insert_id();
        } else {
            return false;
        }
    }

    public function update($field_array, $table_name) {
        $attributes = $this->sanitized_attributes($field_array);
        $attribute_pairs = array();
        foreach ($attributes as $key => $value) {
            $attribute_pairs[] = "{$key}='{$value}'";
        }
        $sql = "UPDATE " . $table_name . " SET ";
        $sql .= join(", ", $attribute_pairs);
        $sql .= " WHERE " . key($field_array) . " = " . current($field_array);

        $this->query($sql);

        return ($this->affected_rows() == 1) ? true : false;
    }

    public function delete($field_array, $table_name) {
        $sql = "DELETE FROM " . $table_name . " WHERE " . key($field_array) . " = " . current($field_array);
        if ($this->query($sql)) {
            return true;
        } else {
            return false;
        }
    }

    public function affected_rows() {
        return mysqli_affected_rows($this->connection);
    }

    private function confirm_query($result) {
        if (!$result) {
            $output = "Database query failed ." . mysqli_error($this->connection) . "<br />" . mysqli_errno($this->connection) . "<br />";

            die($output);
        }
    }

}

$database = new MySQLDatabase();
$db = & $database;
?>
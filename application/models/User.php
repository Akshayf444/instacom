<?php

class User extends My_model {

    public $table_name = 'users';

    function authenticate($username, $password) {
        $query = $this->db->get_where($this->table_name, array('mobile' => $username, 'password' => $password,));
        return $query->row_array();
    }

    public function mobile_add($mobile) {
        $this->db->insert('registration', $mobile);
        return $this->db->insert_id();
    }

    public function find_by_mobile_registration($mobile) {
        $sql = "select * from registration where mobile='$mobile'";
        $query = $this->db->query($sql);
        return $query->row_array();
    }

    public function code_verify($code, $id) {
        $sql = "select * from registration where code='$code' and mobile='$id'";
        $query = $this->db->query($sql);
        return $query->row_array();
    }

    public function update_status($id, $data) {
        $this->db->where(array('id' => $id));
        return $this->db->update('registration', $data);
    }

    public function add($data) {
        $this->db->insert($this->table_name, $data);
        return $this->db->insert_id();
    }

    public function find_by_mobile($mobile) {
        $query = $this->db->get_where($this->table_name, array('mobile' => $mobile));
        $result = $query->result();
        return array_shift($result);
    }

}

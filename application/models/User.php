<?php

class User extends My_model {

    public $table_name = 'user';

    function authenticate($username, $password) {
        $query = $this->db->get_where($this->table_name, array('psr_empid' => $username, 'password' => $password,));
        return $query->row_array();
    }

    function generateReport() {
        $this->db->select('*');
        $this->db->from('user u');
        $this->db->join('doctor d', 'u.psr_empid = d.psr_id');
        $this->db->order_by('u.psr_empid');
        $query = $this->db->get();
        return $query->result();
    }

}

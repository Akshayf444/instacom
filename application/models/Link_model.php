<?php

class Link_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }
    
    public function Add_link($data) {
        return $this->db->insert('links',$data);
    }
    public function show_link($user_id) {
        $sql="select * from links where user_id=$user_id";
        $query=  $this->db->query($sql);
        return $query->result();
    }
    public function find_by_actual($user_id,$actual) {
        $sql="select * from links where user_id=$user_id and Actual='$actual'";
        $query=  $this->db->query($sql);
        return $query->row_array();
    }
}

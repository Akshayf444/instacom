<?php

class Contact_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    public function Add_contact($data) {
        return $this->db->insert('contact', $data);
    }

    public function Show_contact($user_id) {
        $sql = "select * from contact where user_id=$user_id";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function duplicate($user_id, $mobile) {
        $sql = "select * from contact where user_id=$user_id And mobile=$mobile";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function csv($upload, $user_id) {
        $data = array(
            'csv' => $upload,
            'created' => date('Y-m-d H:i:s'),
            'user_id' => $user_id,
        );
        return $this->db->insert('csv', $data);
    }

    function get_addressbook() {
        $query = $this->db->get('contact');
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return FALSE;
        }
    }

    function insert_csv($data) {
       return $this->db->insert('contact', $data);
    }
    function mapping($data) {
       return $this->db->insert('mapping', $data);
    }
    function mapping_check($user_id,$contact_id) {
       $sql="select * from mapping where contact_id=$contact_id And user_id=$user_id";
       $query=  $this->db->query($sql);
       return $query->row_array();
    }
    function group_list($user_id) {
       $sql="select * from group_list where user_id=$user_id";
       $query=  $this->db->query($sql);
       return $query->result();
    }
    function group_create($data) {
       return $this->db->insert('group_list', $data);
    }

}

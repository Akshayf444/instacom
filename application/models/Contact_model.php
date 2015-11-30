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

}

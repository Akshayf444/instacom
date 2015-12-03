<?php

class Contact_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    public function Add_contact($data) {
        $this->db->insert('contact', $data);
        return $this->db->insert_id();
    }
    public function find_by_id($contact_id) {
        $sql = "select * from contact where contact_id=$contact_id";
        $query = $this->db->query($sql);
        return $query->row_array();
    }
    public function update_contact($id,$data) {
        $this->db->where(array('contact_id'=>$id));
        return $this->db->update('contact',$data);
    }
    public function delete_contact($id) {
        $this->db->where(array('contact_id'=>$id));
        return $this->db->delete('contact');
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

    function mapping_check($user_id, $contact_id,$group_id) {
        $sql = "select * from mapping where contact_id=$contact_id And user_id=$user_id and group_id=$group_id";
        $query = $this->db->query($sql);
        return $query->row_array();
    }

    function group_list($user_id) {
        $sql = "select * from group_list where user_id=$user_id";
        $query = $this->db->query($sql);
        return $query->result();
    }

    function send_group($group_id) {
        $sql = "SELECT * FROM mapping mp
                LEFT JOIN  contact c
                ON c.`contact_id`=mp.`contact_id`
                WHERE mp.group_id=$group_id";
        $query = $this->db->query($sql);
        return $query->result();
    }
    function first_last($group_id) {
        $sql = "SELECT * FROM mapping mp
                LEFT JOIN  contact c
                ON c.`contact_id`=mp.`contact_id`
                WHERE mp.group_id=$group_id ";
        $query = $this->db->query($sql);
        return $query->result();
    }
    function contact_count($group_id) {
        $sql = "SELECT COUNT(m.contact_id) AS count_contact FROM mapping m
                WHERE group_id=$group_id";
        $query = $this->db->query($sql);
        return $query->row_array();
    }

    function group_create($data) {
        return $this->db->insert('group_list', $data);
    }
    function save_sms_history($data) {
        return $this->db->insert('sms_count', $data);
    }
    function Add_Template($data) {
        return $this->db->insert('Template', $data);
    }
    function template_view($user_id) {
        $sql = "SELECT * FROM Template
                WHERE user_id=$user_id";
        $query = $this->db->query($sql);
        return $query->result();
    }

}

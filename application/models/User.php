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
    public function mobile_add($mobile) {
       return $this->db->insert('registration',$mobile);
       
    }
    public function find_by_mobile_registration($mobile) {
        $sql="select * from registration where mobile='$mobile'";
        $query=  $this->db->query($sql);
        return $query->row_array();
    }
    public function code_verify($code,$id) {
        $sql="select * from registration where code='$code' and mobile='$id'";
        $query=  $this->db->query($sql);
        return $query->row_array();
    }
    public function update_status($id,$data) {
        $this->db->where(array('id'=>$id));
        return $this->db->update('registration',$data);
    }
}

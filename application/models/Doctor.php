<?php

class Doctor extends My_model {

    public $table_name = 'doctor';

    function add($data) {
        $this->db->insert($this->table_name, $data);
        return $this->db->insert_id();
    }

    function edit($docid,$data) {
        $this->db->where('docid', $docid);
        return $this->db->update($this->table_name, $data);
    }

    function findById($docid) {
        $query = $this->db->get_where('doctor', array('docid' => $docid));
        $result = $query->result();
        return array_shift($result);
    }

    function doctorlist($psr_id = '') {
        if (isset($psr_id) && $psr_id != '') {
            $this->db->select('*');
            $this->db->from('doctor');
            $this->db->where('psr_id', $psr_id);
            $query = $this->db->get();
        }
        return $query->result();
    }

    function countByUser($psr_id = 0) {
        $query = "SELECT COUNT(*) as doctorcount FROM doctor where psr_id = '$psr_id'";
        $query = $this->db->query($query);
        return $query->row_array();
    }

}

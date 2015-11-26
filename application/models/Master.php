<?php

class Master extends My_model {

    public function listIndustry() {
        $query = $this->db->get('industry_master');
        return $query->result();
    }

    function getIndustry($indus_id = -1) {
        $industry = '<option value = "" >Select Industry</option>';
        $result = $this->listIndustry();

        if (!empty($result)) {
            foreach ($result as $row) {
                if ($indus_id == $row->indus_id) {
                    $industry .= '<option value="' . $row->indus_id . '" selected>' . $row->industry . '</option>';
                } else {
                    $industry .= '<option value="' . $row->indus_id . '" >' . $row->industry . '</option>';
                }
            }
        }
        return $industry;
    }

}

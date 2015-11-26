<?php

class Doctors extends My_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Doctor');
    }

    function add() {
        $success = FALSE;
        if ($this->is_logged_in()) {
            $psr_id = $this->session->userdata('user_id');
            if ($this->input->post()) {

                $data = array(
                    'fname' => $this->input->post('fname'),
                    'lname' => $this->input->post('lname'),
                    'speciality' => $this->input->post('speciality'),
                    'class' => $this->input->post('class'),
                    'mobile' => $this->input->post('mobile'),
                    'place' => $this->input->post('place'),
                    'unnati_id' => $this->input->post('unnati_id'),
                    'created_at' => date('Y-m-d H:i:s'),
                    'psr_id' => $psr_id,
                );
                if ($this->Doctor->add($data)) {
                    $success = true;
                };
            }
            $doctorCount = $this->Doctor->countByUser($psr_id);
            $data['doctorCount'] = $doctorCount['doctorcount'] + 1;
            $data['success'] = $success;
            $data = array('title' => 'Add Doctor', 'content' => 'Doctor/add', 'view_data' => $data);
            $this->load->view('template1', $data);
        } else {
            $this->logout();
        }
    }

    function edit($docid) {
        $success = FALSE;
        $is_edit = true;
        if ($this->is_logged_in()) {
            $psr_id = $this->session->userdata('user_id');
            $doctorDetails = $this->Doctor->findById($docid);
            if ($this->input->post()) {

                $data = array(

                    'fname' => $this->input->post('fname'),
                    'lname' => $this->input->post('lname'),
                    'speciality' => $this->input->post('speciality'),
                    'class' => $this->input->post('class'),
                    'mobile' => $this->input->post('mobile'),
                    'place' => $this->input->post('place'),
                    'unnati_id' => $this->input->post('unnati_id'),
                    'updated_at' => date('Y-m-d H:i:s'),
                    'psr_id' => $psr_id,
                );
                if ($this->Doctor->edit($docid,$data)) {
                    redirect('Doctors/doctorList', 'refresh');
                };
            }

            $data['doctorDetail'] = $doctorDetails;
            $data['success'] = $success;
            $data['is_edit'] = $is_edit;
            $data = array('title' => 'Add Doctor', 'content' => 'Doctor/add', 'view_data' => $data);
            $this->load->view('template1', $data);
        } else {
            $this->logout();
        }
    }

    function doctorList() {
        if ($this->is_logged_in()) {
            $psr_id = $this->session->userdata('user_id');
            $data['doctors'] = $this->Doctor->doctorlist($psr_id);
            $data = array('title' => 'Add Doctor', 'content' => 'Doctor/list', 'view_data' => $data);
            $this->load->view('template1', $data);
        } else {
            $this->logout();
        }
    }

}

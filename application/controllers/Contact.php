<?php

class Contact extends My_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('User');
        $this->load->model('Sendsms');
        $this->load->model('Contact_model');
    }

    function view() {
        $user_id = $this->session->userdata('user_id');
        $show['show'] = $this->Contact_model->Show_contact($user_id);
        $data = array('title' => 'View', 'content' => 'User/View_contact', 'view_data' => $show);
        $this->load->view('template1', $data);
    }

    public function Add_contact() {
        if ($this->input->post()) {
            $data = array(
                'fname' => $this->input->post('first_name'),
                'lname' => $this->input->post('last_name'),
                'mobile' => $this->input->post('mobile'),
                'user_id' => $this->session->userdata('user_id'),
                'created_at' => date('Y-m-d H:i:s'),
            );
            $check = $this->Contact_model->duplicate($this->session->userdata('user_id'), $this->input->post('mobile'));
                if(empty($check)) {
                    $this->Contact_model->Add_contact($data);
                }
            redirect('Contact/view');
        }
        $data = array('title' => 'Add Contact', 'content' => 'User/Add_contact', 'view_data' => 'blank');
        $this->load->view('template1', $data);
    }

    public function bulk_contact() {
        if ($this->input->post()) {
            $mob = $this->input->post('text');
            $explode = explode(PHP_EOL, $mob);
            var_dump($explode);
            foreach ($explode as $ex) {
                $data = array(
                    'mobile' => $ex,
                    'user_id' => $this->session->userdata('user_id'),
                    'created_at' => date('Y-m-d H:i:s'),
                );
                $check = $this->Contact_model->duplicate($this->session->userdata('user_id'), $ex);
                if(empty($check)) {
                    $this->Contact_model->Add_contact($data);
                }
            }
            redirect('Contact/view');
        }
        $data = array('title' => 'Add Contact', 'content' => 'User/Add_contact', 'view_data' => 'blank');
        $this->load->view('template1', $data);
    }
    public function Csv_upload() {
       
//            if ($this->input->post()) {
            $user_id = $this->session->userdata('user_id');

            $config['upload_path'] = $_SERVER['DOCUMENT_ROOT'] . '\instacom\assets\Csv';

            $config['allowed_types'] = '*';
            $config['max_size'] = '4096';
            $new_name = time();
            $config['file_name'] = $new_name;
            $this->load->library('upload', $config);
            $this->upload->display_errors('', '');
            if (!$this->upload->do_upload("file")) {
                echo $this->upload->display_errors();
                die();
                $this->data['error'] = array('error' => $this->upload->display_errors());
            } else {
                $upload_result = $this->upload->data();

                print_r($upload_result['file_name']); //or print any valid
                $this->Contact_model->csv($upload_result['file_name'], $user_id);
            }


//            $data = array('title' => 'Resume Upload', 'content' => 'User/resume', 'view_data' => 'blank');
//            $this->load->view('template1', $data);
            
        
    }

}

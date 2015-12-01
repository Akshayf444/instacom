<?php

class Contact extends My_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('User');
        $this->load->model('Sendsms');
        $this->load->model('Contact_model');
        $this->load->library('csvimport');
    }

    function view() {
        $user_id = $this->session->userdata('user_id');
        $show['show'] = $this->Contact_model->Show_contact($user_id);
        $show['list'] = $this->Contact_model->group_list($user_id);
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
            if (empty($check)) {
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
            foreach ($explode as $ex) {
                $data = array(
                    'mobile' => $ex,
                    'user_id' => $this->session->userdata('user_id'),
                    'created_at' => date('Y-m-d H:i:s'),
                );
                $check = $this->Contact_model->duplicate($this->session->userdata('user_id'), $ex);
                if (empty($check)) {
                    $this->Contact_model->Add_contact($data);
                }
            }
            redirect('Contact/view');
        }
        $data = array('title' => 'Add Contact', 'content' => 'User/Add_contact', 'view_data' => 'blank');
        $this->load->view('template1', $data);
    }

    public function Csv_upload() {


        $user_id = $this->session->userdata('user_id');

        $config['upload_path'] = $_SERVER['DOCUMENT_ROOT'] . '\instacom\assets\Csv';

        $config['allowed_types'] = '*';
        $config['max_size'] = '4096';
        $new_name = time();
        $config['file_name'] = $new_name;
        $this->load->library('upload', $config);
        if (!$this->upload->do_upload("resume")) {
            echo $this->upload->display_errors();
            die();
            $this->data['error'] = array('error' => $this->upload->display_errors());
        } else {
            $upload_result = $this->upload->data();

            // $this->Contact_model->csv($upload_result['file_name'], $user_id);
            $file_path = asset_url() . 'Csv/' . $upload_result['file_name'];
            echo $file_path;
            if ($this->csvimport->get_array($file_path)) {
                $csv_array = $this->csvimport->get_array($file_path);
                foreach ($csv_array as $row) {
                    $insert_data = array(
                        'csv' => $row['mobile'],
                        'created' => date('Y-m-d H:i:s'),
                        'user_id' => $this->session->userdata('user_id'),
                    );
                    $this->Contact_model->insert_csv($insert_data);
                }
                $this->session->set_flashdata('success', 'Csv Data Imported Succesfully');
                //echo "<pre>"; print_r($insert_data);
            } else
                $data['error'] = "Error occured";
            echo $data['error'];
        }
//        
//
//
        $data = array('title' => 'Add Contact', 'content' => 'User/Add_contact', 'view_data' => 'blank');
        $this->load->view('template1', $data);
    }

    public function Add_group() {
        if ($_POST) {
            $check = $_POST['check'];
            $check1 = $_POST['list'];
            for ($i = 0; $i < count($check); $i++) {
                $data = array(
                    'contact_id' => $check[$i],
                    'group_id' => $check1,
                    'created' => date('Y-m-d H:i:s'),
                    'user_id' => $this->session->userdata('user_id'),
                );
                //$check = $this->Contact_model->mapping_check($this->session->userdata('user_id'), $check[$i]);
                //if (empty($check)) {
                    $add = $this->Contact_model->mapping($data);
                //}
            }
            //redirect('Contact/view', 'refresh');
        }
    }
    public function create_group() {
        if ($_POST) {
            $check = $_POST['name'];
            if(!empty($check))
            {
                $data=array(
                    'group_name'=>$check,
                    'user_id'=>  $this->session->userdata('user_id'),
                    'created'=>date('Y-m-d H:i:s'),
                );
                $this->Contact_model->group_create($data);
                redirect('Contact/view', 'refresh');
            }
            
        }
    }

}

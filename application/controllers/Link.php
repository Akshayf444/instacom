<?php

class Link extends My_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('User');
        $this->load->model('Sendsms');
        $this->load->model('Contact_model');
        $this->load->library('csvimport');
        $this->load->model('Link_model');
    }

    public function Add_link() {
        $user_id = $this->session->userdata('user_id');
        if ($this->input->post()) {
            $link = $this->input->post('link');
            $convert = md5($link);
            $five = substr($convert, 0, 5);
            $data = array(
                'link' => $five,
                'user_id' => $user_id,
                'Actual' => $link,
                'created' => date('Y-m-d H:i:s'),
            );
            $check = $this->Link_model->find_by_actual($user_id, $link);
            if (empty($check)) {
                $add = $this->Link_model->Add_link($data);
            } else {
                $show['error'] = 'Link Already Exits';
            }

            //redirect('Link/Add_link','refresh');
        }
        if (!empty($show['error'])) {
            $show['error'];
        } else {
            $show = "";
        }
        $data = array('title' => 'View', 'content' => 'User/Add_link', 'view_data' => $show);
        $this->load->view('template1', $data);
    }

}

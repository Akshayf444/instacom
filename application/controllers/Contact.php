<?php

class Contact extends My_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('User');
        $this->load->model('Sendsms');
    }
    
function view() {
        
        $data = array('title' => 'View', 'content' => 'User/View_contact', 'view_data' => 'blank');
        $this->load->view('template1', $data);
    }
}

<?php

class Users extends My_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('User');
    }

    function index() {
        $this->login();
    }

    function login() {
        if ($this->input->post()) {
            $username = $this->input->post('username');
            $password = $this->input->post('password');

            $validUser = $this->User->authenticate($username, $password);
            if (!empty($validUser)) {
                $this->session->set_userdata("user_id", $validUser['psr_empid']);
                $this->session->set_userdata("user_name", $validUser['psr_name']);
                $this->session->set_userdata("mobile", $validUser['psr_mobile']);
                $this->user_id = $this->session->userdata("user_id");
                if ($validUser['complete_profile'] == 0) {
                    redirect('Users/completeProfile', 'refresh');
                } else {
                    $this->db->insert('login_history', array('psr_id' => $this->user_id, 'login_date' => date('Y-m-d H:i:s'), 'ipaddress' => $this->input->ip_address()));
                    redirect('Users/dashboard', 'refresh');
                }
            }
        }
        $data = array('title' => 'Login', 'content' => 'User/login', 'view_data' => 'blank');
        $this->load->view('template2', $data);
    }

    function dashboard() {

        //if ($this->is_logged_in()) {
        $data = array('title' => 'Dashboard', 'content' => 'User/dashboard', 'view_data' => 'blank');
        $this->load->view('template1', $data);
        //} else {
        //  $this->logout();
        // }
    }

    function register() {
        $data = array('title' => 'Login', 'content' => 'User/register', 'view_data' => 'blank');
        $this->load->view('template2', $data);
    }

}

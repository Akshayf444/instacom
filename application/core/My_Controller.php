<?php

class My_Controller extends CI_Controller {

    public $user_id;
    public $reg_id;
    public $user_name;
    public $mobile;

    public function __construct() {
        parent::__construct();
        $this->user_id = $this->session->userdata('user_id');
        $this->user_name = $this->session->userdata('user_name');
        $this->mobile = $this->session->userdata('mobile');

    }

    function is_logged_in() {
        if (!is_null($this->user_id) && $this->user_id != '') {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    function logout() {
        $this->session->unset_userdata('user_id');
        $this->session->unset_userdata('user_name');
        $this->session->unset_userdata('mobile');
        redirect('Users/login', 'refresh');
    }

}

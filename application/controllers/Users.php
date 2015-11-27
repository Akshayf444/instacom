<?php

class Users extends My_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('User');
        $this->load->model('Sendsms');
    }

    function index() {
        $this->login();
    }

    function login() {
        if ($this->input->post()) {
            $username = $this->input->post('username');
            $password = md5($this->input->post('password'));

            $validUser = $this->User->authenticate($username, $password);
            if (!empty($validUser)) {
                $this->session->set_userdata("user_id", $validUser['user_id']);
                $this->session->set_userdata("user_name", $validUser['user_name']);
                $this->session->set_userdata("mobile", $validUser['mobile']);
                $this->user_id = $this->session->userdata("user_id");

                $this->db->insert('login_history', array('user_id' => $this->user_id, 'login_date' => date('Y-m-d H:i:s'), 'ipaddress' => $this->input->ip_address()));
                redirect('Users/dashboard', 'refresh');
            }
        }
        $data = array('title' => 'Login', 'content' => 'User/login', 'view_data' => 'blank');
        $this->load->view('template2', $data);
    }

    function dashboard() {
        if ($this->is_logged_in()) {
            $data = array('title' => 'Dashboard', 'page_title'=>'Dashboard', 'content' => 'User/dashboard', 'view_data' => 'blank');
            $this->load->view('template1', $data);
        } else {
            $this->logout();
        }
    }

    function register() {

        if ($this->input->post()) {
            $mobile = $this->input->post('mobile');
            if (!empty($mobile)) {
                $check = $this->User->find_by_mobile_registration($mobile);
                if (empty($check)) {
                    $code = rand(0, 9999);
                    $message = 'This Is Your Verification Code ' . $code;
                    $data = array(
                        'mobile' => $mobile,
                        'created' => date('Y-m-d H:i:s'),
                        'code' => $code,
                    );
                    $reg_id = $this->User->mobile_add($data);
                    //$this->Sendsms->sendsms($mobile, $message);
                    $this->reg_id = $reg_id;
                    redirect('Users/mobile_verification?id=' . $mobile, 'refresh');
                } else {
                    $error['error'] = "You Mobile Number Is Already Registered";
                }
            } else {
                $error['error'] = "Plese Enter Your Mobile Number";
            }
        }
        if (!empty($error['error'])) {

            $data1['error'] = $error['error'];
        } else {
            $data1['error'] = "";
        }

        $data = array('title' => 'Login', 'content' => 'User/register', 'view_data' => $data1);
        $this->load->view('template2', $data);
    }

    function mobile_verification() {
        $error = '';
        if ($_GET) {
            $idd = $_GET['id'];
            $this->session->set_userdata('mobile', $idd);
        }
        if ($this->input->post()) {
            $code = $this->input->post('code');
            $mob = $this->input->post('mob');

            if (!empty($code)) {
                $find = $this->User->code_verify($code, $mob);
                if (!empty($find)) {
                    if ($code == $find['code']) {
                        $error = "Successfully Registered";
                        $iddd = $find['id'];
                        $data = array(
                            'status' => 1,
                        );
                        $this->User->update_status($iddd, $data);
                        redirect('Users/activate', 'refresh');
                    } else {
                        $error = "Plese Enter Code Properly";
                    }
                }
            } else {
                $error = "Plese Enter Code";
            }
        }

        $data1['error'] = $error;
        $data1['mob'] = $this->session->userdata('mobile');
        $data = array('title' => 'Dashboard', 'content' => 'User/mobile_verification', 'view_data' => $data1);
        $this->load->view('template2', $data);
    }

    function activate() {
        $this->load->model('Master');
        if (isset($this->mobile) && $this->mobile != '') {
            if ($this->input->post()) {
                $userExist = $this->User->find_by_mobile($this->input->post('mobile'));
                if (empty($userExist)) {
                    $data = array(
                        'user_name' => $this->input->post('user_name'),
                        'company_name' => $this->input->post('company_name'),
                        'industry' => $this->input->post('industry'),
                        'password' => md5($this->input->post('password')),
                        'mobile' => $this->input->post('mobile'),
                        'reg_id' => $this->reg_id,
                        'created_at' => date('Y-m-d H:i:s'),
                    );

                    $user_id = $this->User->add($data);
                    if (!empty($user_id)) {
                        $this->Master->addAddress(
                                array(
                                    'address1' => $this->input->post('address1'),
                                    'address2' => $this->input->post('address2'),
                                    'country' => $this->input->post('country'),
                                    'city' => $this->input->post('city'),
                                    'state' => $this->input->post('state'),
                                    'pincode' => $this->input->post('pincode'),
                                    'state' => $this->input->post('state'),
                                    'user_id' => $user_id,
                                    'created_at' => date('Y-m-d H:i:s'),
                                )
                        );
                        $this->user_id = $user_id;
                        redirect('Users/dashboard', 'refresh');
                    }
                }
            }
            $form_data['industry'] = $this->Master->getIndustry();
            $form_data['mobile'] = $this->session->userdata('mobile');
            $data = array('title' => 'Activate Your Account', 'content' => 'User/activate', 'view_data' => $form_data);
            $this->load->view('template2', $data);
        } else {
            $this->logout();
        }
    }

    function randomString() {
        for ($i = 1; $i < 1000000; $i++) {
            $result = substr(md5($i), 0, 5);
            echo $result . ",\n";
        }
    }

}

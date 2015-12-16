<?php

class Contact extends My_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('User');
        $this->load->model('Link_model');
        $this->load->model('Sendsms');
        $this->load->model('Contact_model');
        $this->load->library('csvimport');
    }

    function view() {
        $user_id = $this->session->userdata('user_id');
        $show['show'] = $this->Contact_model->Show_contact($user_id);
        $show['list'] = $this->Contact_model->group_list($user_id);
        $data = array('title' => 'View', 'page_title' => 'Contacts', 'content' => 'User/View_contact', 'view_data' => $show);
        $this->load->view('template1', $data);
    }

    function group_view() {
        $user_id = $this->session->userdata('user_id');
        $check = $this->Contact_model->duplicate($user_id);

        $data = array('title' => 'View', 'page_title' => 'Contacts', 'content' => 'User/View_contact', 'view_data' => $show);
        $this->load->view('template1', $data);
    }

    public function Add_contact() {
        $user_id = $this->session->userdata('user_id');
        if ($this->input->post()) {
            $data = array(
                'fname' => $this->input->post('first_name'),
                'lname' => $this->input->post('last_name'),
                'mobile' => $this->input->post('mobile'),
                'user_id' => $user_id,
                'created_at' => date('Y-m-d H:i:s'),
            );
            $check = $this->Contact_model->duplicate($this->session->userdata('user_id'), $this->input->post('mobile'));
            if (empty($check)) {
                $return = $this->Contact_model->Add_contact($data);
                $convert = md5($return);
                $five = substr($convert, 0, 5);
                $data = array(
                    'tracking_id' => $five,
                );
                $find_by_tracking = $this->Contact_model->find_by_tracking($return, $five);
                if (empty($find_by_tracking)) {
                    $this->Contact_model->tracking_id($return, $data);
                } else {

                    $five = substr($convert, 5, 10);
                    $this->Contact_model->tracking_id($return, $data);
                }
                $data = array(
                    'contact_id' => $return,
                    'user_id' => $user_id,
                    'created' => date('Y-m-d H:i:s'),
                    'group_id' => $this->input->post('group_id'),
                );

                $this->Contact_model->mapping($data);
            }



            redirect('Contact/view');
        }
        $show['list'] = $this->Contact_model->group_list($this->session->userdata('user_id'));
        $data = array('title' => 'Add Contact', 'page_title' => 'Add Contact', 'content' => 'User/Add_contact', 'view_data' => $show);
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
        $data = array('title' => 'Add Contact', 'page_title' => 'Add Contact', 'content' => 'User/Add_contact', 'view_data' => 'blank');
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

            var_dump($check);

            for ($i = 0; $i < count($check); $i++) {
                $data = array(
                    'contact_id' => $check[$i],
                    'group_id' => $check1,
                    'created' => date('Y-m-d H:i:s'),
                    'user_id' => $this->session->userdata('user_id'),
                );
                $checkKK = $this->Contact_model->mapping_check($this->session->userdata('user_id'), $check[$i], $check1);
                if (empty($checkKK)) {
                    $add = $this->Contact_model->mapping($data);
                }
            }
            redirect('Contact/view', 'refresh');
        }
    }

    public function create_group() {
        if ($_POST) {
            $check = $_POST['name'];
            if (!empty($check)) {
                $data = array(
                    'group_name' => $check,
                    'user_id' => $this->session->userdata('user_id'),
                    'created' => date('Y-m-d H:i:s'),
                );
                $this->Contact_model->group_create($data);
                redirect('Contact/view', 'refresh');
            }
        }
    }

    public function create_group2() {
        if ($_POST) {
            $check = $_POST['name'];
            if (!empty($check)) {
                $data = array(
                    'group_name' => $check,
                    'user_id' => $this->session->userdata('user_id'),
                    'created' => date('Y-m-d H:i:s'),
                );
                $this->Contact_model->group_create($data);
                redirect('Contact/Groups', 'refresh');
            }
        }
    }

    public function Send_sms() {
        $user_id = $this->session->userdata('user_id');
        if ($this->input->post()) {
            $mobile = $this->input->post('mobile');
            $message = $this->input->post('message');
            if (!empty($message) && !empty($mobile)) {
                $this->Sendsms->sendsms($mobile, $message);
                $show['success'] = "Successfully Send ";
            }
        }
        $show['list'] = $this->Contact_model->group_list($user_id);
        $show['show'] = $this->Contact_model->template_view($user_id);
        $show['show2'] = $this->Link_model->show_link($user_id);
        $data = array('title' => 'Send Sms', 'content' => 'User/Send_sms', 'view_data' => $show);
        $this->load->view('template1', $data);
    }

    public function Send_sms_group() {
        $user_id = $this->session->userdata('user_id');
        if ($this->input->post()) {
            $group = $this->input->post('group');
            $message = $this->input->post('message');
            if (!empty($message) && !empty($group)) {
                $check = $this->Contact_model->send_group($group);
                if (!empty($check)) {
                    foreach ($check as $ck) {
                        $store = str_replace("#FirstName#", $ck->fname, $message);
                        $store1 = str_replace("#LastName#", $ck->lname, $store);
                        $store3 = str_replace("#tracking#", $ck->tracking_id, $store1);
                        $this->Sendsms->sendsms($ck->mobile, $store3);
                        $data = array(
                            'number' => $ck->mobile,
                            'group_id' => $ck->group_id,
                            'contact_id' => $ck->contact_id,
                            'user_id' => $user_id,
                            'created' => date('Y-m-d H:i:s'),
                        );
                        if (!empty($data)) {
                            $this->Contact_model->save_sms_history($data);
                        }
                    }
                    $show['success'] = "Successfully Send ";
                }
            }

            redirect('Contact/Send_sms', 'refresh');
        }
//        $show['list'] = $this->Contact_model->group_list($user_id);
//        $data = array('title' => 'Send Sms', 'content' => 'User/Send_sms', 'view_data' => $show);
//        $this->load->view('template1', $data);
    }

    public function group() {
        $user_id = $this->session->userdata('user_id');
        if ($this->input->post()) {
            
        }
        $show['list'] = $this->Contact_model->group_list($user_id);
        $data = array('title' => 'Groups','page_title' => 'Groups', 'content' => 'User/Group', 'view_data' => $show);
        $this->load->view('template1', $data);
    }

    public function Group_inside() {
        $user_id = $this->session->userdata('user_id');
        if ($_GET) {
            $group_id = $_GET['id'];
        }
        $show['list'] = $this->Contact_model->first_last($group_id);
        $show['count'] = $this->Contact_model->contact_count($group_id);
        $data = array('title' => 'Groups', 'content' => 'User/group_inside', 'view_data' => $show);
        $this->load->view('template1', $data);
    }

    public function Template() {
        $user_id = $this->session->userdata('user_id');
        $show['show'] = $this->Contact_model->template_view($user_id);
        $data = array('title' => 'Template', 'content' => 'User/Template', 'view_data' => $show);
        $this->load->view('template1', $data);
    }

    public function Create_Template() {
        $user_id = $this->session->userdata('user_id');
        if ($this->input->post()) {
            $title = $this->input->post('title');
            $message = $this->input->post('message');
            $data = array(
                'title' => $title,
                'message' => $message,
                'created' => date('Y-m-d H:i:s'),
                'user_id' => $user_id,
            );
            $add = $this->Contact_model->Add_Template($data);
        }
        $data = array('title' => 'Create Template', 'content' => 'User/Create_Template', 'view_data' => 'blank');
        $this->load->view('template1', $data);
    }

    public function Edit_Contact() {
        $user_id = $this->session->userdata('user_id');
        if ($_GET) {
            $contact_id = $_GET['id'];
        }
        $show['show'] = $this->Contact_model->find_by_id($contact_id);
        $data = array('title' => 'Create Template', 'content' => 'User/Edit_Contact', 'view_data' => $show);
        $this->load->view('template1', $data);
    }

    public function Delete_Contact() {
        $user_id = $this->session->userdata('user_id');
        if ($_GET) {
            $contact_id = $_GET['id'];
        }
        $show['show'] = $this->Contact_model->delete_contact($contact_id);
        //redirect('Contact/view','refresh');
    }

    public function Update_Contact() {
        $user_id = $this->session->userdata('user_id');
        if ($this->input->post()) {
            $contact_id = $this->input->post('contact_id');
            $data = array(
                'fname' => $this->input->post('first_name'),
                'lname' => $this->input->post('last_name'),
                'mobile' => $this->input->post('mobile'),
                'updated_at' => date('Y-m-d H:i:s'),
            );
            $update = $this->Contact_model->update_contact($contact_id, $data);
            redirect('Contact/view', 'refresh');
        }
    }

}

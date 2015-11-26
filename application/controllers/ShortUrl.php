<?php

class ShortUrl extends My_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('ShortenedUrl');
        //$this->load->model('GoogleUrlApi');
    }

    function shortUrls() {
        $url_to_shorten = get_magic_quotes_gpc() ? stripslashes(trim($_REQUEST['longurl'])) : trim($_REQUEST['longurl']);

        if (!empty($url_to_shorten) && preg_match('|^https?://|', $url_to_shorten)) {


            // check if the client IP is allowed to shorten
            if ($_SERVER['REMOTE_ADDR'] != LIMIT_TO_IP) {
                die('You are not allowed to shorten URLs with this service.');
            }

            // check if the URL is valid
            if (CHECK_URL) {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url_to_shorten);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
                $response = curl_exec($ch);
                $response_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
                if ($response_status == '404') {
                    die('Not a valid URL');
                }
            }

            // check if the URL has already been shortened
            $this->db->select("id");
            $this->db->from("shortenedurls");
            $this->db->where('long_url', $url_to_shorten);
            $query = $this->db->get();
            $already_shortened = $query->result();
            if (!empty($already_shortened)) {
                $already_shortened = array_shift($already_shortened);
                // URL has already been shortened
                $shortened_url = $this->ShortenedUrl->getShortenedURLFromID($already_shortened->id);
            } else {
                // URL not in database, insert
                //$this->db->query('LOCK TABLES shortenedurls WRITE');
                $data = array(
                    'long_url' => $url_to_shorten,
                    'created' => time(),
                    'creator' => $_SERVER['REMOTE_ADDR']
                );
                $url_id = $this->ShortenedUrl->add($data);
                //mysql_query('INSERT INTO ' . DB_TABLE . ' (long_url, created, creator) VALUES ("' . mysql_real_escape_string($url_to_shorten) . '", "' . time() . '", "' . mysql_real_escape_string($_SERVER['REMOTE_ADDR']) . '")');
                $shortened_url = $this->ShortenedUrl->getShortenedURLFromID($url_id);
                //$this->db->query('UNLOCK TABLES');
                //mysql_query('UNLOCK TABLES');
            }
            echo BASE_HREF . $shortened_url;
        }
    }

    function bitlyShortUrl() {
        /* usage */
        $longUrl = $this->input->get('longUrl');
        /* $data = array(
          'long_url' => $url_to_shorten,
          'created' => time(),
          'creator' => $_SERVER['REMOTE_ADDR']
          );
          $url_id = $this->ShortenedUrl->add($data); */

        $short = $this->ShortenedUrl->make_bitly_url($longUrl, 'akkif444', 'R_67417772f3b944e6b78276e6b8c0adad', 'json');

        echo 'The short URL is:  ' . $short;
    }

    function googleUrlShort() {
        $this->load->library('UrlShortner');
        $key = 'AIzaSyAN2hEVTtDDuQp7qKrB-A8rVNenFf5m4C4';
        $googer = new GoogleURLAPI($key);

        $shortDWName = $googer->shorten("http://davidwalsh.name");
        var_dump($shortDWName); // returns http://goo.gl/i002
        //echo $shortDWName;
    }

    function generateBase62IDs() {
        $this->load->library('Math');
        $url_to_shorten = get_magic_quotes_gpc() ? stripslashes(trim($_REQUEST['longurl'])) : trim($_REQUEST['longurl']);
        if (!empty($url_to_shorten) && preg_match('|^https?://|', $url_to_shorten)) {
            $this->db->select("id");
            $this->db->from("shortenedurls");
            $this->db->where('long_url', $url_to_shorten);
            $query = $this->db->get();
            $already_shortened = $query->result();
            if (!empty($already_shortened)) {
                $already_shortened = array_shift($already_shortened);
                $shortened_url = Math::to_base($already_shortened->id, 62);
            } else {
                $data = array(
                    'long_url' => $url_to_shorten,
                    'created' => time(),
                    'creator' => $_SERVER['REMOTE_ADDR']
                );
                $url_id = $this->ShortenedUrl->add($data);
                $shortened_url = Math::to_base($url_id, 62);
                $data = array('shortened_url' => 'http://ins.in/l/' . $shortened_url, 'unique_code' => $shortened_url);
                $this->db->where('id', $url_id);
                $this->db->update('shortenedurls', $data);
            }
        } else {
            
        }
    }

}

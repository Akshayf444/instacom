<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ShortenedUrl
 * This is model class from shoretnedrl table
 * @author Admin
 */
class ShortenedUrl extends My_model {

    public $table_name = 'shortenedurls';

    function add($data) {
        $this->db->insert($this->table_name, $data);
        return $this->db->insert_id();
    }

    function getShortenedURLFromID($integer, $base = ALLOWED_CHARS) {
        $length = strlen($base);
        $out = '';
        while ($integer > $length - 1) {
            $out = $base[fmod($integer, $length)] . $out;
            $integer = floor($integer / $length);
        }
        return $base[$integer] . $out;
    }

    /* make a URL small */

    function make_bitly_url($url, $login, $appkey, $format = 'xml', $version = '2.0.1') {
        //create the URL
        $bitly = 'http://api.bit.ly/shorten?version=' . $version . '&longUrl=' . urlencode($url) . '&login=' . $login . '&apiKey=' . $appkey . '&format=' . $format;

        //get the url
        //could also use cURL here
        $response = file_get_contents($bitly);

        //parse depending on desired format
        if (strtolower($format) == 'json') {
            $json = @json_decode($response, true);
            return $json['results'][$url]['shortUrl'];
        } else { //xml
            $xml = simplexml_load_string($response);
            return 'http://bit.ly/' . $xml->results->nodeKeyVal->hash;
        }
    }

}

<?php

require_once ('credentials.php');

// API constants, you shouldn't have to change these.
$API_HOST = "https://api.yelp.com";
$SEARCH_PATH = "/v3/businesses/search";
$TOKEN_PATH = "/oauth2/token";
$GRANT_TYPE = "client_credentials";
// Default search terms to fall back to in case the user does not have any inputs.
$DEFAULT_TERM = 'hole in the wall';
$DEFAULT_LOCATION = "irvine, ca";
$LIMIT = 49;
$RADIUS = 16000;
$PRICE = '1,2';
/**
 * Given a bearer token, send a GET request to the API.
 *
 * @return   OAuth bearer token, obtained using client_id and client_secret.
 */
function obtain_bearer_token() {
    try {
        # Using the built-in cURL library for easiest installation.
        # Extension library HttpRequest would also work here.
        $curl = curl_init();
        if (FALSE === $curl)
            throw new Exception('Failed to initialize');
        $postfields = "client_id=" . $GLOBALS['CLIENT_ID'] .
            "&client_secret=" . $GLOBALS['CLIENT_SECRET'] .
            "&grant_type=" . $GLOBALS['GRANT_TYPE'];
        curl_setopt_array($curl, array(
            CURLOPT_URL => $GLOBALS['API_HOST'] . $GLOBALS['TOKEN_PATH'],
            CURLOPT_RETURNTRANSFER => true,  // Capture response.
            CURLOPT_ENCODING => "",  // Accept gzip/deflate/whatever.
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $postfields,
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/x-www-form-urlencoded",
            ),
        ));
        $response = curl_exec($curl);
        if (FALSE === $response)
            throw new Exception(curl_error($curl), curl_errno($curl));
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if (200 != $http_status)
            throw new Exception($response, $http_status);
        curl_close($curl);
    } catch(Exception $e) {
        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);
    }
    $body = json_decode($response);
    $bearer_token = $body->access_token;
    return $bearer_token;
}
/**
 * Makes a request to the Yelp API and returns the response
 *
 * @param    $bearer_token   API bearer token from obtain_bearer_token
 * @param    $host    The domain host of the API
 * @param    $path    The path of the API after the domain. In this case it will remain as the basic Yelp Search
 * @param    $url_params    Array of query-string parameters.
 * @return   The JSON response from the request
 */
function request($bearer_token, $host, $path, $url_params = array()) {
    // Send Yelp API Call
    try {
        $curl = curl_init();
        if (FALSE === $curl)
            throw new Exception('Failed to initialize');
        $url = $host . $path . "?" . http_build_query($url_params);
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,  // Capture response.
            CURLOPT_ENCODING => "",  // Accept gzip/deflate/whatever.
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "authorization: Bearer " . $bearer_token,
                "cache-control: no-cache",
            ),
        ));
        $response = curl_exec($curl);
        if (FALSE === $response)
            throw new Exception(curl_error($curl), curl_errno($curl));
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if (200 != $http_status)
            throw new Exception($response, $http_status);
        curl_close($curl);
    } catch(Exception $e) {
        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);
    }
    return $response;
}
/**
 * Query the Search API by a search term and location
 *
 * @param    $bearer_token   API bearer token from obtain_bearer_token
 * @param    $term        The search term passed to the API
 * @param    $location    The search location passed to the API
 * @return   The JSON response from the request
 */
function search($bearer_token, $term, $location) {
    $url_params = [];

    $url_params['term'] = $term;
    $url_params['location'] = $location;
    $url_params['radius'] = $GLOBALS['RADIUS'];
    $url_params['price'] = $GLOBALS['PRICE'];


    return request($bearer_token, $GLOBALS['API_HOST'], $GLOBALS['SEARCH_PATH'], $url_params);
}
/**
 * Queries the API by the input values from the user
 *
 * @param    $term        The search term to query
 * @param    $location    The location of the business to query
 */
function query_api($term, $location) {
    $bearer_token = obtain_bearer_token();
    $response = json_decode(search($bearer_token, $term, $location));
        $pretty_response = json_encode($response->businesses, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        print_r($pretty_response);
}

/**
 * User input is handled here
 */

$term = $_GET['term'] ?: $GLOBALS['DEFAULT_TERM'];
$location = $_GET['location'] ?: $GLOBALS['DEFAULT_LOCATION'];
query_api($term, $location);
?>
<?php
/*	cURL_translate.php
	2010-10-19
	Carson S. Christian
	cchristian@moocsinterface.net
	
	Connection layer for BCS communication to/from an AJAX source.
*/
/*
	This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License.
	To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/
	or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
/*
	$_GET should contain the following:
		location:	The url of the BCS device
		target:		The resource to access at the BCS target
		mode:		The mode to use to connect to the target (get/post)
		message:	The pre-url-encoded string to pass, if any

	This script will directly echo any response from the target.
*/
$location = $_GET['location'];
$target = $_GET['target'];
$mode = $_GET['mode'];
$message = $_GET['message'];

// create curl resource 
$ch = curl_init(); 

// set url and options
curl_setopt_array($ch, array(
	CURLOPT_URL => sprintf('%s/%s%s', $location, $target, (($mode === 'get' && !empty($message)) ? "?$message" : '')),
	CURLOPT_RETURNTRANSFER => 1));
	
if ($mode === 'post' && !empty($message)) {
	curl_setopt_array($ch, array(
		CURLOPT_POST => 1,
		CURLOPT_POSTFIELDS => $message));
}

// $output contains the output string
$output = curl_exec($ch);

// close curl resource to free up system resources
curl_close($ch);

echo $output;
?>
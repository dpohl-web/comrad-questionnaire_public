<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
// header("Access-Control-Allow-Origin: http://blinc.q21.de");
// header("Access-Control-Allow-Origin: http://mahara_17_10.local");
// header("Access-Control-Allow-Origin: http://moodle.rebus.local");
header("Access-Control-Allow-Origin: http://localhost:3000");
// header("Access-Control-Allow-Origin: http://wp_react_router.local");
// header("Access-Control-Allow-Origin: http://mahara.learningrebus.net");
// header("Access-Control-Allow-Origin: https://reveal-eu.org");
$fileContents = file_get_contents("radar.xml");
$fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
$fileContents = trim(str_replace('"', "'", $fileContents));
$simpleXml = simplexml_load_string($fileContents, null, LIBXML_NOCDATA);
$json = json_encode($simpleXml);
echo $json;
// echo $simpleXml->asXML();

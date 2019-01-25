<?php
//jsからjsonデータを受け取る
$JsonPostData = $_POST['postJsonData'];

//rubyで立てたサーバーのportを指定
$url = 'http://localhost:8080';

// HTTPヘッダの内容
$headers = array(
    'Content-Type: application/x-www-form-urlencoded'
);

$options = array('http' => array(
    'ignore_errors' => true,
    'method' => 'POST',
    'content' => $JsonPostData,
    'header' => implode("\r\n", $headers)
));

$options = stream_context_create($options);
$contents = file_get_contents($url, false, $options);
echo $contents;
//var_dump($contents);

?>

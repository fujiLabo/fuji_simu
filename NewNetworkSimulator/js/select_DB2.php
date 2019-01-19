<?php
//問題のidを取得
$id = $_POST['question_id'];

//データベースから問題を取得
//接続先のアドレス
$address = 'localhost';
//MySQLのユーザー名
$user = 'root';
//MySQLのpass
$pass = 'Td;Rk;Fk;';
//データベース名
$database = 'e-learning';
//テーブル名
$table = 'Questions';
//問題のidを格納しているフィールド名
$field = 'id';

//$id = 1;

//変数idに数字を入れると数字に応じた問題文を$jsonに格納する
$conn = mysqli_connect($address, $user, $pass, $database);

//接続エラー、検索エラーが発生した場合は$jsonにnullを格納する
if ($conn) {
  $re = mysqli_query($conn, "SELECT * FROM $table WHERE $field LIKE '$id'");
  $json = mysqli_fetch_array($re)[1];
} else {
  $json = null;
}

mysqli_close($conn);

//問題の内容をUIに表示(jsに問題を返す)
echo $json;
?>

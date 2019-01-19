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

//変数idに数字を入れると数字に応じた問題文を変数textに格納する
$conn = mysqli_connect($address, $user, $pass, $database);

//接続エラー、検索エラーが発生した場合は変数textにnullを格納する
if(!$conn){
  $text = null;
}

$re = mysqli_query($conn, "SELECT * FROM $table WHERE $field LIKE '$id'");

if(!$re){
  $text = null;
}
else{
  $text = mysqli_fetch_array($re)[1];
}
mysqli_close($conn);

//問題の内容をUIに表示(jsに問題を返す)
echo $text;
?>

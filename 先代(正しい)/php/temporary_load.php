<?php
/*
 * 一時保存されたネットワークトポロジーを返すプログラム
 */

require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))).'/config.php');

//問題のidを取得
$qid = $_POST['question_id'];

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
$table = 'save';

//$qid = 3;

$conn = mysqli_connect($address, $user, $pass, $database);
if ($conn) {
  $re = mysqli_query($conn, "SELECT json FROM $table
  							 WHERE (qid LIKE $qid)
  							 AND (userid LIKE $USER->id)");
  $result = mysqli_fetch_array($re)[0];
} else {
  $result = null;
}
mysqli_close($conn);

//問題の内容をUIに表示(jsに問題を返す)
echo $result;
?>

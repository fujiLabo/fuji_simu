<?php
/*
 * 実行ボタンを押したときに採点結果を一時保存データベースに保存するプログラム
 */

require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))).'/config.php');

//接続先のアドレス
$address = 'localhost';
//MySQLのユーザー名
$user = 'root';
//MySQLのpass
$pass = 'Td;Rk;Fk;';
//データベース名
$database = 'moodle';
//テーブル名
$table = 'mdl_networksimmod_grades';

$networksimmod = $_POST['id'];
$qid = $_POST['question_id'];
//optional_param('question_id', 0, PARAM_INT);
$userid = $USER->id;
$grade = $_POST['postData'];

$conn = mysqli_connect($address, $user, $pass, $database);

// レコードがなかったらINSERT、あったらUPDATEする
$sql_result = mysqli_query($conn, "INSERT INTO $table (networksimmod, qid, userid, grade) VALUES ($networksimmod, $qid, $userid, $grade) ON DUPLICATE KEY UPDATE grade = $grade");

mysqli_close($conn);
?>
<?php
/* 
 * 一時保存用の成績データベースから現在のユーザー、コース、アイテムに合致するデータの合計点を計算するプログラム
 * 返り値は合計点、各問題のタイトルと点数
 */


require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))).'/config.php');

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
//アイテムID
$itemid = optional_param('id', 0, PARAM_INT);

//問題用データベースへアクセス
$conn = mysqli_connect($address, $user, $pass, $database);
$re = mysqli_query($conn, "SELECT * FROM $table");

//成績データベースへアクセス
$data = $DB->get_records_sql("SELECT qid, grade FROM {networksimmod_grades}
							 WHERE (userid LIKE $USER->id)
							 AND (networksimmod LIKE $itemid)
							 ORDER BY qid");
while($question = mysqli_fetch_array($re)) {
	$qjson = json_decode($question[1]);
	$titlejson = new stdClass();
	$titlejson->id = $qjson->id;
	$titlejson->title = $qjson->title;
	for ($i = 0; $i < count($data); $i++) {
		//問題用データベースと成績データベースの結合
		if ($question[0] == $data[$i + 1]->qid) {
			$titlejson->grade = $data[$i + 1]->grade;
		} else {
			$titlejson->grade = "0";
		}
	}
	$result[] = $titlejson;
}

$data = $DB->get_records_sql("SELECT * FROM {networksimmod_grades}
							 WHERE (userid LIKE $USER->id)
							 AND (networksimmod LIKE $itemid)");

$total = 0;
while (count($data) > 0) {
	$total += array_shift($data)->grade;
}

$temp = new stdClass();
$temp->point = $total;

array_unshift($result, $temp);
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
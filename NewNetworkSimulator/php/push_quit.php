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
$gradesbase = 'e-learning';
//テーブル名
$table = 'Questions';
//アイテムID
$itemid = $_POST['id'];
//optional_param('id', 0, PARAM_INT);

//問題用データベースへアクセス
$conn = mysqli_connect($address, $user, $pass, $gradesbase);
$re = mysqli_query($conn, "SELECT * FROM $table");

//成績データベースへアクセス
$grades = $DB->get_records_sql("SELECT qid, grade FROM {networksimmod_grades}
							 WHERE (userid LIKE $USER->id)
							 AND (networksimmod LIKE '$itemid')
							 ORDER BY qid");

$total = 0;
$result = array();
while($question = mysqli_fetch_array($re)) {
	$qjson = json_decode($question[1]);
	$gradejson = new stdClass();
	$gradejson->id = $qjson->id;
	$gradejson->title = $qjson->title;
	$gradejson->grade = "0";
	$gradejson->point = $qjson->point;
	foreach($grades as $element) {
		//問題用データベースと成績データベースの結合
		if ($question[0] == $element->qid) {
			$gradejson->grade = $element->grade;
			if ($element->grade * $qjson->point > 0) {
				$total += $element->grade * $qjson->point;
			}
			break;
		}
	}
	$result[] = $gradejson;
}

$pointjson = new stdClass();
$pointjson->point = $total;
//$result["points"] = $total;
array_unshift($result, $pointjson);

//対象ユーザーの成績データベースIDを検索
$data = $DB->get_records_sql("SELECT * FROM {grade_grades}
							 WHERE (userid LIKE $USER->id)
							 AND (itemid LIKE $itemid)");
$obj = array_shift($data);

$update = new stdClass();
$update->id = $obj->id;
$update->finalgrade = $total;
$update->timemodified = time();
$DB->update_record('grade_grades', $update, false);

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
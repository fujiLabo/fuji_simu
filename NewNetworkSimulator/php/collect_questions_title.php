<?PHP
/*
 * UI側で問題選択ボタンが押されたときに、問題のタイトルと過去の正誤を返すプログラム
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
$networksimmod = $_POST['id'];

//問題用データベースへアクセス
$conn = mysqli_connect($address, $user, $pass, $database);
$re = mysqli_query($conn, "SELECT * FROM $table");

//成績データベースへアクセス
$grades = $DB->get_records_sql("SELECT qid, grade FROM {networksimmod_grades}
							 WHERE (userid LIKE $USER->id)
							 AND (networksimmod LIKE $networksimmod)
							 ORDER BY qid");

$result = array();
while($question = mysqli_fetch_array($re)) {
	$qjson = json_decode($question[1]);
	$titlejson = new stdClass();
	$titlejson->id = $qjson->id;
	$titlejson->title = $qjson->title;
	$titlejson->grade = "0";
	foreach ($grades as $element) {
		//問題用データベースと成績データベースの結合
		if ($question[0] == $element->qid) {
			$titlejson->grade = $element->grade;
			break;
		}
	}
	$result[] = $titlejson;
}
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>

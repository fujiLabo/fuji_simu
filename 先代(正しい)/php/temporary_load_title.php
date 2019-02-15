<?PHP
/*
 * UI側で一時保存ロードボタンが押されたときにデータベースに存在する一時保存データの有無を返すプログラム
 */

require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))).'/config.php');

$address = 'localhost';
$user = 'root';
$pass = 'Td;Rk;Fk;';
$database = 'e-learning';

$conn = mysqli_connect($address, $user, $pass, $database);
$result = array();
if ($conn) {
	$qestion = mysqli_query($conn, "SELECT id, json FROM Questions");

	while($qelement = mysqli_fetch_array($qestion)) {
		$temp = mysqli_query($conn, "SELECT qid, json FROM save WHERE userid LIKE $USER->id");
		$titlejson = new stdClass();
		while($telement = mysqli_fetch_array($temp)) {
			if ($qelement[0] == $telement[0]) {
				$qjson = json_decode($qelement[1]);
				$titlejson->id = $telement[0];
				$titlejson->title = $qjson->title;
				$result[] = $titlejson;
				break;
			}
		}
	}
} else {
	echo null;
}
mysqli_close($conn);
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
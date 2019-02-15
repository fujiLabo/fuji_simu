<?PHP
/*
 * 操作を保存するプログラム
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
$table = 'operation';
//アイテムID
$itemid = $_POST['id'];

$json = $_POST['postJsonData'];
$json = str_replace('\\', "\\\\", $json);

//問題用データベースへアクセス
$conn = mysqli_connect($address, $user, $pass, $database);
if ($conn) {
  // レコードがなかったらINSERT、あったらUPDATEする
  $sql_result = mysqli_query($conn, "INSERT INTO $table (userid, itemid, json) VALUES ($USER->id, $itemid, '$json')");
} else {
  echo NULL;
}
mysqli_close($conn);
?>

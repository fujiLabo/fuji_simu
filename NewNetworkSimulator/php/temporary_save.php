<?PHP
/*
 * ネットワークトポロジーを一時保存するプログラム
 */

require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))).'/config.php');

$json = $_POST['postJsonData'];
$save = json_decode($json);
$save->userid = $USER->id;

$address = 'localhost';
$user = 'root';
$pass = 'Td;Rk;Fk;';
$database = 'e-learning';
$table = 'save';

$conn = mysqli_connect($address, $user, $pass, $database);
if ($conn) {
  // レコードがなかったらINSERT、あったらUPDATEする
  $sql_result = mysqli_query($conn, "INSERT INTO $table (userid, qid, json) VALUES ($save->userid, $save->id, '$json') ON DUPLICATE KEY UPDATE json = '$json'");
} else {
  echo NULL;
}
mysqli_close($conn);
?>